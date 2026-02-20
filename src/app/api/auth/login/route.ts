import { NextResponse } from 'next/server';
import { db } from "@/db";
import { korisniciTable, preduzecaTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import { signAuthToken, AUTH_COOKIE, cookieOpts } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, lozinka } = await req.json();

    if (!email || !lozinka) {
      return NextResponse.json({ error: "Email i lozinka su obavezni." }, { status: 400 });
    }

    let authenticatedUser: any = null;
    let uloga: "KORISNIK" | "SAMOSTALAC" | "USLUZNO_PREDUZECE" = 'KORISNIK';

    const [korisnik] = await db.select().from(korisniciTable).where(eq(korisniciTable.email, email)).limit(1);

    if (korisnik) {
      authenticatedUser = korisnik;
      uloga = 'KORISNIK';
    } else {
      const [preduzece] = await db.select().from(preduzecaTable).where(eq(preduzecaTable.email, email)).limit(1);
      if (preduzece) {
        authenticatedUser = preduzece;
        uloga = preduzece.tip as any; 
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json({ error: "Pogrešan email ili lozinka." }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(lozinka, authenticatedUser.lozinka);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Pogrešan email ili lozinka." }, { status: 401 });
    }

    const realId = uloga === 'KORISNIK' ? authenticatedUser.idkorisnik : authenticatedUser.idpreduzece;

    const token = signAuthToken({
      sub: String(realId),
      email: authenticatedUser.email,
      role: uloga,
      name: uloga === 'KORISNIK' ? `${authenticatedUser.ime} ${authenticatedUser.prezime}` : authenticatedUser.naziv
    });

    const response = NextResponse.json({
      message: "Uspešna prijava.",
      user: { id: realId, email: authenticatedUser.email, uloga }
    });

    response.cookies.set(AUTH_COOKIE, token, cookieOpts());
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: "Greška na serveru.", details: error.message }, { status: 500 });
  }
}