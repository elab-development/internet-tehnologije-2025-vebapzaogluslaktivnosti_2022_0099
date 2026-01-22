import { NextResponse } from 'next/server';
import { db } from '@/db';
import { korisniciTable, preduzecaTable, tipEnum } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { type InferModel } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, lozinka, ime, prezime, naziv, uloga } = body;

    if (!email || !lozinka || !uloga) {
      return NextResponse.json(
        { message: "Nedostaju obavezna polja." },
        { status: 400 }
      );
    }

    const hashedLozinka = await bcrypt.hash(lozinka, 10);

    if (uloga === 'KORISNIK') {
      if (!ime || !prezime) {
        return NextResponse.json(
          { message: "Ime i prezime su obavezni za korisnika." },
          { status: 400 }
        );
      }

      type KorisnikInsert = InferModel<typeof korisniciTable, "insert">;
      type KorisnikSelect = InferModel<typeof korisniciTable, "select">;

      const [noviKorisnik]: KorisnikSelect[] = await db
        .insert(korisniciTable)
        .values({
          email,
          lozinka: hashedLozinka,
          ime,
          prezime,
        } as KorisnikInsert)
        .returning();

      return NextResponse.json(
        {
          message: "Uspešna registracija korisnika.",
          user: {
            id: noviKorisnik.idkorisnik,
            email: noviKorisnik.email,
            uloga: 'KORISNIK',
          },
        },
        { status: 201 }
      );
    }

    if (uloga === 'SAMOSTALAC' || uloga === 'USLUZNO_PREDUZECE') {
      if (!naziv) {
        return NextResponse.json(
          { message: "Naziv je obavezan za preduzeće." },
          { status: 400 }
        );
      }

      type PreduzeceInsert = InferModel<typeof preduzecaTable, "insert">;
      type PreduzeceSelect = InferModel<typeof preduzecaTable, "select">;

      const [novoPreduzece]: PreduzeceSelect[] = await db
        .insert(preduzecaTable)
        .values({
          email,
          lozinka: hashedLozinka,
          naziv,
          tip: uloga as typeof tipEnum.enumName,
          verifikovan: false,
        } as PreduzeceInsert)
        .returning();

      return NextResponse.json(
        {
          message: "Uspešna registracija preduzeća.",
          user: {
            id: novoPreduzece.idpreduzece,
            email: novoPreduzece.email,
            uloga: uloga,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "Neispravna uloga." },
      { status: 400 }
    );

  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Email je već zauzet ili je došlo do greške.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
