import { NextResponse } from 'next/server';
import { db } from '@/db';
import { korisniciTable, preduzecaTable } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { signAuthToken, AUTH_COOKIE, cookieOpts } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, lozinka, ime, prezime, naziv, uloga } = body;

    if (!email || !lozinka || !uloga) {
      return NextResponse.json(
        { error: "Email, lozinka i uloga su obavezni." },
        { status: 400 }
      );
    }

    const hashedLozinka = await bcrypt.hash(lozinka, 10);

    let realId: string | number;
    let displayName: string;

    if (uloga === 'KORISNIK') {
      if (!ime || !prezime) {
        return NextResponse.json({ error: "Ime i prezime su obavezni." }, { status: 400 });
      }

      const [noviKorisnik] = await db
        .insert(korisniciTable)
        .values({
          email,
          lozinka: hashedLozinka,
          ime,
          prezime,
        })
        .returning();

      realId = noviKorisnik.idkorisnik;
      displayName = `${noviKorisnik.ime} ${noviKorisnik.prezime}`;
    } 
    else if (uloga === 'SAMOSTALAC' || uloga === 'USLUZNO_PREDUZECE') {
      if (!naziv) {
        return NextResponse.json({ error: "Naziv je obavezan." }, { status: 400 });
      }

      const [novoPreduzece] = await db
        .insert(preduzecaTable)
        .values({
          email,
          lozinka: hashedLozinka,
          naziv,
          tip: uloga,  
          verifikovan: false,
        })
        .returning();

      realId = novoPreduzece.idpreduzece;
      displayName = novoPreduzece.naziv;
    } 
    else {
      return NextResponse.json({ error: "Neispravna uloga." }, { status: 400 });
    }

    const token = signAuthToken({
      sub: String(realId), 
      email: email,
      role: uloga as "KORISNIK" | "SAMOSTALAC" | "USLUZNO_PREDUZECE", // Middleware ovo proverava [2]
      name: displayName
    });

    const response = NextResponse.json(
      {
        message: "Uspešna registracija.",
        user: { id: realId, email, uloga }
      },
      { status: 201 }
    );

    response.cookies.set(AUTH_COOKIE, token, cookieOpts());

    return response;

  } catch (error: any) {
    
    return NextResponse.json(
      { error: "Email je zauzet ili je došlo do greške na serveru." },
      { status: 500 }
    );
  }
}