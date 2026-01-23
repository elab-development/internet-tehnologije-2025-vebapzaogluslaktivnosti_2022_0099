import { db } from "@/db";
import { radniciTable, terminiTable, uslugeTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idPreduzeca = searchParams.get("idPreduzeca");

    if (!idPreduzeca) {
      return NextResponse.json({ error: "ID preduzeća nije prosleđen." }, { status: 400 });
    }

    // Filtriranje podataka tako da se dobiju samo oni koji pripadaju ulogovanom preduzeću
    const mojiRadnici = await db
      .select()
      .from(radniciTable)
      .where(eq(radniciTable.idpreduzece, Number(idPreduzeca)));

    const mojeUsluge = await db
      .select()
      .from(uslugeTable)
      .where(eq(uslugeTable.idpreduzece, Number(idPreduzeca)));

    return NextResponse.json({ radnici: mojiRadnici, usluge: mojeUsluge });
  } catch (error) {
    return NextResponse.json({ error: "Greška na serveru." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { datumvreme, idradnik, idusluga } = body;

    if (!datumvreme || !idradnik || !idusluga) {
      return NextResponse.json({ message: "Sva polja su obavezna." }, { status: 400 });
    }

    const [noviTermin] = await db.insert(terminiTable).values({
      datumvreme: new Date(datumvreme),
      idradnik: Number(idradnik),
      idusluga: Number(idusluga),
    }).returning();

    return NextResponse.json({ message: "Uspesno kreiranje.", termin: noviTermin }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Neuspesno kreiranje." }, { status: 500 });
  }
}