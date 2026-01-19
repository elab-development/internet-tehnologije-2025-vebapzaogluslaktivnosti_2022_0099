import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { naziv, opis, cena, slikaurl, idpreduzece } = body;

    // Provera obaveznih polja prema modelu 
    if (!naziv || !cena || !idpreduzece) {
      return NextResponse.json({ message: "Nedostaju podaci." }, { status: 400 });
    }

    const novaUsluga = await prisma.usluga.create({
      data: {
        naziv,
        opis,
        cena: parseFloat(cena),
        slikaurl,
        idpreduzece: parseInt(idpreduzece)
      }
    });

    return NextResponse.json({ message: "Uspesno kreiranje.", usluga: novaUsluga }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Neuspesno kreiranje.", error: error.message }, { status: 500 });
  }
}

// GET metoda za prikaz svih usluga na početnoj strani
export async function GET() {
  const usluge = await prisma.usluga.findMany({
    include: { preduzece: true } // Uključuje podatke o firmi koja nudi uslugu
  });
  return NextResponse.json(usluge);
}