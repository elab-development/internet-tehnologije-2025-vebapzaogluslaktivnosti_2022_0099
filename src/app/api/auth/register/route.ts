import { NextResponse } from 'next/server';
import { db } from '@/db';
import { korisniciTable, preduzecaTable } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { signAuthToken, AUTH_COOKIE, cookieOpts } from "@/lib/auth";

export const dynamic = "force-dynamic"; 

export async function POST(req: Request) {
  try {
    const podaci = await req.json();
    const { email, lozinka, uloga, ime, prezime, naziv } = podaci;

    if (!email || !lozinka || !uloga) {
      return NextResponse.json({ error: "Email, lozinka i uloga su obavezni parametri." }, { status: 400 });
    }

    const hešovanaLozinka = await bcrypt.hash(lozinka, 10); 
    let korisnikId: string | number;
    let prikazanoIme: string;

    if (uloga === 'KORISNIK') {
      if (!ime || !prezime) return NextResponse.json({ error: "Ime i prezime su obavezni za korisnika." }, { status: 400 });

      const [novi] = await db.insert(korisniciTable).values({
        email,
        lozinka: hešovanaLozinka,
        ime,
        prezime
      }).returning();

      korisnikId = novi.idkorisnik; 
      prikazanoIme = `${novi.ime} ${novi.prezime}`;
    } else if (uloga === 'SAMOSTALAC' || uloga === 'USLUZNO_PREDUZECE') {
      if (!naziv) return NextResponse.json({ error: "Naziv je obavezan za preduzeće/samostalca." }, { status: 400 });

      const [firma] = await db.insert(preduzecaTable).values({
        email,
        lozinka: hešovanaLozinka,
        naziv,
        tip: uloga,
        verifikovan: false 
      }).returning();

      korisnikId = firma.idpreduzece; 
      prikazanoIme = firma.naziv;
    } else {
      return NextResponse.json({ error: "Prosleđena uloga nije prepoznata u sistemu." }, { status: 400 });
    }

    const token = signAuthToken({
      sub: String(korisnikId),
      email,
      role: uloga as "KORISNIK" | "SAMOSTALAC" | "USLUZNO_PREDUZECE",
      name: prikazanoIme
    });

    const odgovor = NextResponse.json({
      poruka: "Nalog je uspešno kreiran.",
      korisnik: { id: korisnikId, email, uloga }
    }, { status: 201 });

    odgovor.cookies.set(AUTH_COOKIE, token, cookieOpts());

    return odgovor;

  } catch (err: any) {
    return NextResponse.json({ error: "Došlo je do greške. Moguće je da je email već u upotrebi." }, { status: 500 });
  }
}