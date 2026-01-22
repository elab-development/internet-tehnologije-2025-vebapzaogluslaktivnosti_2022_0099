import { NextResponse } from 'next/server';
import { db } from "@/db";
import { korisniciTable, preduzecaTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tvoja_tajna_sifra';

export async function POST(req: Request) {
  try {
    const { email, lozinka } = await req.json();

    //  Validacija
    if (!email || !lozinka) {
      return NextResponse.json(
        { message: "Email i lozinka su obavezni." },
        { status: 400 }
      );
    }

    //  Traženje korisnika u tabeli KORISNICI
    const korisnikResult = await db
      .select()
      .from(korisniciTable)
      .where(eq(korisniciTable.email, email))
      .limit(1);

    let authenticatedUser: any = korisnikResult[0];
    let uloga = 'KORISNIK';

    //  Ako nije korisnik → tražimo u PREDUZEĆIMA
    if (!authenticatedUser) {
      const preduzeceResult = await db
        .select()
        .from(preduzecaTable)
        .where(eq(preduzecaTable.email, email))
        .limit(1);

      authenticatedUser = preduzeceResult[0];

      if (authenticatedUser) {
        uloga = authenticatedUser.tip; // SAMOSTALAC | USLUZNO_PREDUZECE

      }
      console.log("EMAIL:", email);
      console.log("USER FROM DB:", authenticatedUser);
      console.log("HASH FROM DB:", authenticatedUser?.lozinka);
    }

    //  Ako ne postoji
    if (!authenticatedUser) {
      return NextResponse.json(
        { message: "Pogrešan email ili lozinka." },
        { status: 401 }
      );
    }


    //  Provera lozinke
    const isPasswordCorrect = await bcrypt.compare(
      lozinka,
      authenticatedUser.lozinka
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Pogrešan email ili lozinka." },
        { status: 401 }
      );
    }

    //  JWT
    const token = jwt.sign(
      {
        userId: authenticatedUser.id,
        email: authenticatedUser.email,
        uloga
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    let id1: number;
    if (uloga === 'KORISNIK') {
      id1 = authenticatedUser.idkorisnik;
    } else {
      id1 = authenticatedUser.idpreduzece;
    }
    //  Odgovor
    return NextResponse.json(
      {
        message: "Uspešna prijava.",
        token,
        user: {
          id: id1,
          email: authenticatedUser.email,
          uloga
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: "Greška na serveru.", error: error.message },
      { status: 500 }
    );
  }
}
