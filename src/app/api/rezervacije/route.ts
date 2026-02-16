import { db } from "@/db";
import { rezervacijeTable, terminiTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Provera autentifikacije (Korisnik mora biti ulogovan)
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Morate biti ulogovani" }, { status: 401 });
    }

    const user = verifyAuthToken(token); // Izvlačenje ID-a korisnika iz tokena

    // 2. Preuzimanje podataka iz zahteva
    const { idtermin, napomena } = await req.json();

    if (!idtermin) {
      return NextResponse.json({ error: "Termin je obavezan" }, { status: 400 });
    }

    // 3. Provera da li termin postoji
    const [termin] = await db
      .select()
      .from(terminiTable)
      .where(eq(terminiTable.idtermin, idtermin));

    if (!termin) {
      return NextResponse.json({ error: "Termin ne postoji" }, { status: 404 });
    }

    // 4. Kreiranje rezervacije u bazi 
    const [novaRezervacija] = await db
      .insert(rezervacijeTable)
      .values({
        idkorisnik: user.sub, // 'sub' je ID korisnika iz JWT tokena 
        idtermin: idtermin,
        napomena: napomena || "",
        status: "CREATED",
      })
      .returning();

    return NextResponse.json({
      message: "Uspesno zakazivanje.",
      rezervacija: novaRezervacija
    }, { status: 201 });

  } catch (error) {
    console.error("Greška prilikom rezervacije:", error);
    return NextResponse.json({ error: "Neuspesno zakazivanje." }, { status: 500 });
  }
}