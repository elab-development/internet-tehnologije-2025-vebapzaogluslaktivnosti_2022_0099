import { db } from "@/db";
import { NextResponse } from "next/server";
import {
    preduzecaTable,
    rezervacijeTable,
    recenzijeTable,
    terminiTable,
    uslugeTable,
    korisniciTable
} from "@/db/schema";
import { sql, and, eq } from "drizzle-orm";

export async function POST(req: Request) {

    try {
        const body = await req.json();
        const { ocena, komentar, idkorisnik, idpreduzece } = body;

        const provera = await db
            .select()
            .from(rezervacijeTable)
            .innerJoin(terminiTable, eq(rezervacijeTable.idtermin, terminiTable.idtermin))
            .innerJoin(uslugeTable, eq(terminiTable.idusluga, uslugeTable.idusluga))
            .where(and(
                eq(rezervacijeTable.idkorisnik, idkorisnik),
                eq(uslugeTable.idpreduzece, idpreduzece),
                eq(rezervacijeTable.status, "COMPLETED")
            ));

        if (provera.length === 0) {
            return NextResponse.json({ message: "Morate imati završenu uslugu kod ovog pružaoca da biste ga ocenili." }, { status: 403 });
        }
        // Validacija ocene 1-5
        if (!ocena || ocena < 1 || ocena > 5 || !idpreduzece) {
            return NextResponse.json({ message: "Neuspesno ocenjivanje. Nevalidni podaci." }, { status: 400 });
        }

        const [novaRecenzija] = await db.insert(recenzijeTable).values({
            ocena,
            komentar,
            idkorisnik,
            idpreduzece,
        }).returning();

        // 1. Izračunaj broj završenih usluga
        const [statistikaUsluga] = await db
            .select({ count: sql<number>`count(*)` })
            .from(rezervacijeTable)
            .innerJoin(terminiTable, eq(rezervacijeTable.idtermin, terminiTable.idtermin))
            .innerJoin(uslugeTable, eq(terminiTable.idusluga, uslugeTable.idusluga))
            .where(and(
                eq(uslugeTable.idpreduzece, idpreduzece),
                eq(rezervacijeTable.status, "COMPLETED")
            ));

        // 2. Izračunaj novu prosečnu ocenu
        const [statistikaOcena] = await db
            .select({ prosek: sql<number>`avg(${recenzijeTable.ocena})` })
            .from(recenzijeTable)
            .where(eq(recenzijeTable.idpreduzece, idpreduzece));

        // 3. Provera uslova za bedž (10 usluga i prosek >= 4.5)
        const brojUsluga = Number(statistikaUsluga?.count || 0);
        const prosek = Number(statistikaOcena?.prosek || 0);
        const verifikovanStatus = brojUsluga >= 2 && prosek >= 4.5; //10

        // 4. Trajno ažuriranje u bazi podataka
        await db
            .update(preduzecaTable)
            .set({ verifikovan: verifikovanStatus })
            .where(eq(preduzecaTable.idpreduzece, idpreduzece));
        return NextResponse.json({
            message: "Uspesno ocenjivanje.",
            recenzija: novaRecenzija
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Neuspesno ocenjivanje." }, { status: 500 });
    }
}
