import { db } from "@/db";
import { rezervacijeTable, terminiTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = await db
      .select({
        mesec: sql<string>`to_char(${terminiTable.datumvreme}, 'Month')`,
        broj: sql<number>`count(${rezervacijeTable.idrezervacija})::int`,
      })
      .from(rezervacijeTable)
      .innerJoin(terminiTable, eq(rezervacijeTable.idtermin, terminiTable.idtermin))
      .groupBy(sql`to_char(${terminiTable.datumvreme}, 'Month')`);

    const formatiraniPodaci = [
      ["Mesec", "Broj rezervacija"],
      ...stats.map((s) => [s.mesec.trim(), s.broj]),
    ];

    return NextResponse.json(formatiraniPodaci);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri čitanju baze" }, { status: 500 });
  }
}