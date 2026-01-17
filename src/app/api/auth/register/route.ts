import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, lozinka, ime, prezime, naziv, uloga } = body; // uloga: 'KORISNIK', 'SAMOSTALAC' ili 'USLUZNO_PREDUZECE'

    const hashedLozinka = await bcrypt.hash(lozinka, 10);

    // LOGIKA ZA KLIJENTA (Korisnik tabela)
    if (uloga === 'KORISNIK') {
      const noviKorisnik = await prisma.korisnik.create({
        data: { email, ime, prezime, lozinka: hashedLozinka }
      });
      return NextResponse.json({ message: "Uspesna registracija korisnika.", user: noviKorisnik }, { status: 201 });
    } 

    // LOGIKA ZA PRUŽAOCA USLUGA (Preduzeće tabela)
    if (uloga === 'SAMOSTALAC' || uloga === 'USLUZNO_PREDUZECE') {
      const novoPreduzece = await prisma.preduzece.create({
        data: { 
          email, 
          naziv, 
          lozinka: hashedLozinka, 
          tip: uloga, // Ovde se mapira na Enumeraciju Tip [9]
          verifikovan: false // Početno stanje pre provere kriterijuma za bedž [10]
        }
      });
      return NextResponse.json({ message: "Uspesna registracija preduzeca/samostalca.", user: novoPreduzece }, { status: 201 });
    }

    return NextResponse.json({ message: "Neispravna uloga." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: "Email je vec zauzet ili je doslo do greske.", error: error.message }, { status: 500 });
  }
}