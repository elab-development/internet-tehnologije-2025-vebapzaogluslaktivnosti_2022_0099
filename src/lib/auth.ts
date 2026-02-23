import * as jwt from "jsonwebtoken";

export const AUTH_COOKIE = "auth"; 

const JWT_SECRET = process.env.JWT_SECRET || "build-safe-fallback-secret";

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.warn("UPOZORENJE: JWT_SECRET nedostaje u produkciji!");
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
  try {
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
  } catch (err) {
    throw new Error("Invalid token");
  }
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