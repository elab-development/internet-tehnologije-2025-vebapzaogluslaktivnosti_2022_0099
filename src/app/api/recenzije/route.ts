import { db } from "@/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Dodajemo za pristup kuki-jima
import { verifyAuthToken, AUTH_COOKIE } from "@/lib/auth"; // Importujemo tvoju auth logiku
import {
    preduzecaTable,
    rezervacijeTable,
    recenzijeTable,
    terminiTable,
    uslugeTable
} from "@/db/schema";
import { sql, and, eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        // 1. PROVERA AUTENTIFIKACIJE 
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_COOKIE)?.value;

        if (!token) {
            return NextResponse.json({ message: "Niste ulogovani." }, { status: 401 });
        }

        let user;
        try {
            user = verifyAuthToken(token); // Verifikacija JWT tokena 
        } catch (e) {
            return NextResponse.json({ message: "Nevalidna sesija." }, { status: 401 });
        }

        const idkorisnik = user.sub; 
        const body = await req.json();
        const { ocena, komentar, idpreduzece } = body; 

        // 2. PROVERA USLOVA ZA OCENJIVANJE 
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
            return NextResponse.json({ message: "Morate imati završenu uslugu da biste ocenili pružaoca." }, { status: 403 });
        }

        if (!ocena || ocena < 1 || ocena > 5 || !idpreduzece) {
            return NextResponse.json({ message: "Nevalidni podaci." }, { status: 400 });
        }

        // 3. UNOS RECENZIJE
        const [novaRecenzija] = await db.insert(recenzijeTable).values({
            ocena,
            komentar,
            idkorisnik,
            idpreduzece,
        }).returning();

        // 4. AUTOMATSKO AŽURIRANJE VERIFIKACIJE (Bedž) 
        const [statistikaUsluga] = await db
            .select({ count: sql<number>`count(*)` })
            .from(rezervacijeTable)
            .innerJoin(terminiTable, eq(rezervacijeTable.idtermin, terminiTable.idtermin))
            .innerJoin(uslugeTable, eq(terminiTable.idusluga, uslugeTable.idusluga))
            .where(and(
                eq(uslugeTable.idpreduzece, idpreduzece),
                eq(rezervacijeTable.status, "COMPLETED")
            ));

        const [statistikaOcena] = await db
            .select({ prosek: sql<number>`avg(${recenzijeTable.ocena})` })
            .from(recenzijeTable)
            .where(eq(recenzijeTable.idpreduzece, idpreduzece));

        const brojUsluga = Number(statistikaUsluga?.count || 0);
        const prosek = Number(statistikaOcena?.prosek || 0);
        const verifikovanStatus = brojUsluga >= 10 && prosek >= 4.5; 

        await db
            .update(preduzecaTable)
            .set({ verifikovan: verifikovanStatus })
            .where(eq(preduzecaTable.idpreduzece, idpreduzece));

        return NextResponse.json({ message: "Uspesno ocenjivanje.", recenzija: novaRecenzija }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Greška na serveru." }, { status: 500 });
    }
}
