import { AUTH_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const odgovor = NextResponse.json({ uspeh: true, poruka: "Korisnik je uspešno odjavljen." });

  odgovor.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true, 
    sameSite: "lax" as const, 
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, 
    expires: new Date(0), 
  });

  return odgovor;
}