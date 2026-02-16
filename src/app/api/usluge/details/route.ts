import { db } from "@/db";
import { uslugeTable, terminiTable, rezervacijeTable } from "@/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idUsluge = searchParams.get("id");

    if (!idUsluge) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    const [usluga] = await db.select().from(uslugeTable).where(eq(uslugeTable.idusluga, idUsluge));

    const dostupniTermini = await db
      .select({
        idtermin: terminiTable.idtermin,
        datumvreme: terminiTable.datumvreme,
      })
      .from(terminiTable)
      .leftJoin(rezervacijeTable, eq(terminiTable.idtermin, rezervacijeTable.idtermin))
      .where(
        and(
          eq(terminiTable.idusluga, idUsluge),
          isNull(rezervacijeTable.idrezervacija) 
        )
      );

    return NextResponse.json({ usluga, termini: dostupniTermini });
  } catch (error) {
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}