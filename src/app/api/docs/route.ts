import { NextResponse } from "next/server";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Veb aplikacija za oglašavanje uslužnih aktivnosti - API",
    version: "1.0.0",
    description: "Kompletna API dokumentacija koja pokriva sve Use Case-ove projekta.",
  },
  paths: {
    // --- AUTENTIFIKACIJA (Use Case 6, 7, 8) ---
    "/api/auth/register": {
      post: {
        summary: "Registracija (Use Case 6)",
        tags: ["Autentifikacija"],
        responses: { 201: { description: "Nalog uspešno kreiran." } }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Prijava (Use Case 7)",
        tags: ["Autentifikacija"],
        responses: { 200: { description: "Uspešna autentifikacija putem JWT tokena." } }
      }
    },
    "/api/auth/logout": {
      post: {
        summary: "Odjava (Use Case 8)",
        tags: ["Autentifikacija"],
        responses: { 200: { description: "Sesija uspešno prekinuta." } }
      }
    },

    // --- USLUGE (Use Case 1, 3) ---
    "/api/usluge": {
      get: {
        summary: "Pretraga i filtriranje usluga (Use Case 1)",
        tags: ["Usluge"],
        description: "Pregled dostupnih usluga uz filtriranje po ceni i oceni.",
        responses: { 200: { description: "Lista filtriranih usluga." } }
      },
      post: {
        summary: "Kreiranje nove usluge (Use Case 3)",
        tags: ["Usluge"],
        security: [{ cookieAuth: [] }],
        description: "Dozvoljeno samo samostalcima i preduzećima.",
        responses: { 201: { description: "Usluga uspešno kreirana." } }
      }
    },

    // --- TERMINI (Use Case 4) ---
    "/api/termini": {
      post: {
        summary: "Kreiranje dostupnog termina (Use Case 4)",
        tags: ["Termini"],
        security: [{ cookieAuth: [] }],
        description: "Definisanje termina u kalendaru za određenu uslugu i radnika.",
        responses: { 201: { description: "Termin uspešno dodat." } }
      }
    },

    // --- REZERVACIJE (Use Case 2) ---
    "/api/rezervacije": {
      post: {
        summary: "Zakazivanje termina (Use Case 2)",
        tags: ["Rezervacije"],
        security: [{ cookieAuth: [] }],
        description: "Korisnik bira termin i vrši potvrdu rezervacije.",
        responses: { 201: { description: "Termin uspešno zakazan." } }
      }
    },

    // --- RECENZIJE (Use Case 5) ---
    "/api/recenzije": {
      post: {
        summary: "Ocenjivanje pružaoca usluga (Use Case 5)",
        tags: ["Recenzije"],
        security: [{ cookieAuth: [] }],
        description: "Ostavljanje ocene (1-5) i komentara nakon obavljene usluge.",
        responses: { 201: { description: "Recenzija uspešno sačuvana." } }
      }
    },

    // --- PREDUZEĆA ---
    "/api/preduzeca": {
      get: {
        summary: "Pregled profila preduzeća/samostalca",
        tags: ["Preduzeća"],
        description: "Prikaz osnovnih informacija, ocena i verifikacionog statusa.",
        responses: { 200: { description: "Podaci o profilu uspešno učitani." } }
      }
    }
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "auth"
      }
    }
  }
};

export async function GET() {
  return NextResponse.json(swaggerSpec);
}