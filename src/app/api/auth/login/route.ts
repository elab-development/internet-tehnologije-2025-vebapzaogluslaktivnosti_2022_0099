import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tvoja_tajna_sifra';

export async function POST(req: Request) {
  try {
    const { email, lozinka } = await req.json();

    // 1. Validacija unosa - provera da li su polja prisutna 
    if (!email || !lozinka) {
      return NextResponse.json({ message: "Email i lozinka su obavezni." }, { status: 400 });
    }

    // 2. Traženje korisnika u obe tabele (Korisnik i Preduzeće)
    let authenticatedUser: any = await prisma.korisnik.findUnique({ where: { email } });
    let uloga = 'KORISNIK';

    if (!authenticatedUser) {
      authenticatedUser = await prisma.preduzece.findUnique({ where: { email } });
      if (authenticatedUser) {
        uloga = authenticatedUser.tip; // SAMOSTALAC ili USLUZNO_PREDUZECE
      }
    }

    // 3. Provera da li korisnik uopšte postoji
    if (!authenticatedUser) {
      return NextResponse.json({ message: "Pogrešan email ili lozinka." }, { status: 401 });
    }

    // 4. KLJUČNI KORAK: Provera lozinke 
    const isPasswordCorrect = await bcrypt.compare(lozinka, authenticatedUser.lozinka);
    
    if (!isPasswordCorrect) {
      // Ako lozinka nije tačna, vraćamo 401 i ne idemo dalje!
      return NextResponse.json({ message: "Pogrešan email ili lozinka." }, { status: 401 });
    }

    // 5. Ako je sve u redu, generisanje JWT tokena 
    const token = jwt.sign(
      { 
        userId: authenticatedUser.idkorisnik || authenticatedUser.idpreduzece, 
        email: authenticatedUser.email, 
        uloga 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 6. Slanje uspešnog odgovora sa JSON podacima 
    return NextResponse.json({ 
      message: "Uspesna prijava.", 
      token, 
      user: { email: authenticatedUser.email, uloga } 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: "Greska na serveru.", error: error.message }, { status: 500 });
  }
}