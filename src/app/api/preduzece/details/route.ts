import { db } from "@/db"; 
import { 
  preduzecaTable, 
  rezervacijeTable, 
  recenzijeTable, 
  terminiTable, 
  uslugeTable,
  korisniciTable 
} from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idPreduzece = searchParams.get("id");
    const idKorisnik = searchParams.get("userId");

    if (!idPreduzece) {
      return NextResponse.json({ error: "ID preduzeća nedostaje" }, { status: 400 });
    }

    const [preduzece] = await db
      .select()
      .from(preduzecaTable)
      .where(eq(preduzecaTable.idpreduzece, Number(idPreduzece)));

    if (!preduzece) {
      return NextResponse.json({ error: "Preduzeće nije pronađeno" }, { status: 404 });
    }

    
    const prethodneUsluge = await db
      .select({
        idrezervacija: rezervacijeTable.idrezervacija,
        nazivUsluge: uslugeTable.naziv,
        datumvreme: terminiTable.datumvreme,
      })
      .from(rezervacijeTable)
      .innerJoin(terminiTable, eq(rezervacijeTable.idtermin, terminiTable.idtermin))
      .innerJoin(uslugeTable, eq(terminiTable.idusluga, uslugeTable.idusluga))
      .where(
        and(
          eq(uslugeTable.idpreduzece, Number(idPreduzece)),
          eq(rezervacijeTable.status, "COMPLETED")
        )
      );


    const recenzije = await db
      .select({
        ocena: recenzijeTable.ocena,
        komentar: recenzijeTable.komentar,
        imeKorisnika: korisniciTable.ime,
      })
      .from(recenzijeTable)
      .innerJoin(korisniciTable, eq(recenzijeTable.idkorisnik, korisniciTable.idkorisnik))
      .where(eq(recenzijeTable.idpreduzece, Number(idPreduzece)));

    let mozeDaOceni = false;
    if (idKorisnik) {
      const zavrsenaRezervacija = await db
        .select()
        .from(rezervacijeTable)
        .innerJoin(terminiTable, eq(rezervacijeTable.idtermin, terminiTable.idtermin))
        .innerJoin(uslugeTable, eq(terminiTable.idusluga, uslugeTable.idusluga))
        .where(
          and(
            eq(rezervacijeTable.idkorisnik, Number(idKorisnik)),
            eq(uslugeTable.idpreduzece, Number(idPreduzece)),
            eq(rezervacijeTable.status, "COMPLETED")
          )
        );
      
      if (zavrsenaRezervacija.length > 0) {
        mozeDaOceni = true;
      }
    }

    return NextResponse.json({
      preduzece,
      prethodneUsluge,
      recenzije,
      mozeDaOceni
    });

  } catch (error) {
    console.error("Backend Error:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}