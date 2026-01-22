import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idPreduzeca = searchParams.get("idPreduzeca");

    if (!idPreduzeca) return NextResponse.json([], { status: 400 });

    // Dohvatanje radnika za Use Case 4 
    const radnici = await prisma.radnik.findMany({
      where: { idpreduzece: parseInt(idPreduzeca) }
    });

    return NextResponse.json(radnici);
  } catch (error) {
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { datumvreme, idradnik, idpreduzece } = body;

    // Čuvanje termina prema Use Case 4 glavnom toku 
    const noviTermin = await prisma.termin.create({
      data: {
        datumvreme: new Date(datumvreme),
        idradnik: parseInt(idradnik),
        idpreduzece: parseInt(idpreduzece)
      }
    });

    return NextResponse.json({ message: "Uspesno kreiranje.", termin: noviTermin }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Neuspesno kreiranje." }, { status: 500 });
  }
}

