import { db } from "@/db";
import { rezervacijeTable } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idtermin, idkorisnik, napomena } = body;

    if (!idtermin || !idkorisnik) {
      return NextResponse.json({ message: "Neuspesno zakazivanje. Nedostaju podaci." }, { status: 400 });
    }

    const [novaRezervacija] = await db.insert(rezervacijeTable).values({
      idtermin: idtermin,
      idkorisnik: idkorisnik,
      napomena: napomena || "",
      status: "CREATED"
    }).returning();

    return NextResponse.json({ 
      message: "Uspesno zakazivanje.", 
      rezervacija: novaRezervacija 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Neuspesno zakazivanje." }, { status: 500 });
  }
}