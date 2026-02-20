import * as jwt from "jsonwebtoken";

export const AUTH_COOKIE = "auth"; 

const JWT_SECRET = process.env.JWT_SECRET || "safe-build-secret";

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.warn("UPOZORENJE: JWT_SECRET nije pronađen u okruženju.");
}

export type JwtUserClaims = {
  sub: string;   
  email: string; 
  name?: string; 
  role: "KORISNIK" | "SAMOSTALAC" | "USLUZNO_PREDUZECE"; 
};

export function signAuthToken(claims: JwtUserClaims) {
  return jwt.sign(claims, JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" });
}

export function verifyAuthToken(token: string): JwtUserClaims {
  const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtUserClaims;
  
  if (!payload || !payload.sub || !payload.email || !payload.role) {
    throw new Error("Invalid token claims");
  }

  return { 
    sub: payload.sub, 
    email: payload.email, 
    role: payload.role,
    name: payload.name 
  };
}

export function cookieOpts() {
  return {
    httpOnly: true, 
    sameSite: "lax" as const, 
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 
  };
}