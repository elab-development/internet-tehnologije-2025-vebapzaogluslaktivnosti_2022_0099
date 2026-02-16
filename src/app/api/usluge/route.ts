import { NextResponse } from 'next/server';
import { db } from '@/db';
import { uslugeTable, preduzecaTable } from '@/db/schema';
import { type InferModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { naziv, opis, cena, slikaurl, idpreduzece } = body;

    if (!naziv || !cena || !idpreduzece) {
      return NextResponse.json(
        { message: "Nedostaju obavezni podaci." },
        { status: 400 }
      );
    }

      type UslugaInsert = InferModel<typeof uslugeTable, "insert">;
      type UslugaSelect = InferModel<typeof uslugeTable, "select">;

      const [novaUsluga]: UslugaSelect[] = await db
        .insert(uslugeTable)
        .values({
          naziv,
          opis: opis || "",
          cena: parseFloat(cena),
          slikaurl: slikaurl || null,
          idpreduzece: idpreduzece,
        } as UslugaInsert)
        .returning();

    return NextResponse.json(
      { message: "Uspešno kreirana usluga.", usluga: novaUsluga },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Neuspešno kreiranje usluge.", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const usluge = await db
      .select({
        idusluga: uslugeTable.idusluga,
        naziv: uslugeTable.naziv,
        opis: uslugeTable.opis,
        cena: uslugeTable.cena,
        slikaurl: uslugeTable.slikaurl,
        idpreduzece: uslugeTable.idpreduzece,
        preduzece_naziv: preduzecaTable.naziv,
      })
      .from(uslugeTable)
      .innerJoin(preduzecaTable, eq(preduzecaTable.idpreduzece, uslugeTable.idpreduzece)); 

    return NextResponse.json(usluge);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Greška pri dohvaćanju usluga.", error: error.message },
      { status: 500 }
    );
  }
}

