import { NextResponse } from "next/server";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Veb aplikacija za oglašavanje uslužnih aktivnosti API",
    version: "1.0.0",
    description: "API dokumentacija za seminarski rad [8]"
  },
  paths: {
    "/api/auth/login": {
      post: {
        summary: "Prijava korisnika",
        responses: { "200": { description: "Uspešna prijava" } }
      }
    },
    "/api/usluge": {
      get: {
        summary: "Pregled svih usluga",
        responses: { "200": { description: "Lista usluga" } }
      }
    }
  }
};
export async function GET() {
  return NextResponse.json(swaggerSpec);
}