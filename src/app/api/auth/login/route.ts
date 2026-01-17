import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tvoja_tajna_sifra';

export async function POST(req: Request) {
  try {
    const { email, lozinka } = await req.json();

    // 1. Provera u tabeli Korisnik (Klijenti)
    let authenticatedUser = await prisma.korisnik.findUnique({ where: { email } });
    let uloga = 'KORISNIK';

    // 2. Ako nije klijent, provera u tabeli Preduzeće (Samostalci/Firme)
    if (!authenticatedUser) {
      authenticatedUser = (await prisma.preduzece.findUnique({ where: { email } })) as any;
      if (authenticatedUser) uloga = authenticatedUser.tip; // Uzima tip: SAMOSTALAC ili USLUZNO_PREDUZECE
    }

    if (!authenticatedUser || !(await bcrypt.compare(lozinka, authenticatedUser.lozinka))) {
      return NextResponse.json({ message: "Neuspesna prijava. Losi kredencijali." }, { status: 401 });
    }

    // 3. Generisanje JWT tokena (Nefunkcionalni zahtev za bezbednost)
    const token = jwt.sign(
      { 
        userId: (authenticatedUser as any).idkorisnik || (authenticatedUser as any).idpreduzece, 
        email: authenticatedUser.email, 
        uloga 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ 
      message: "Uspesna prijava.", 
      token, 
      user: { email: authenticatedUser.email, uloga } 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: "Greska na serveru.", error: error.message }, { status: 500 });
  }
}