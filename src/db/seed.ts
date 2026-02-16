import "dotenv/config";
import { 
  korisniciTable, 
  preduzecaTable, 
  radniciTable, 
  uslugeTable, 
  terminiTable, 
  rezervacijeTable, 
  recenzijeTable 
} from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

async function main() {
  console.log("Seedovanje baze je počelo...");

  const hash = await bcrypt.hash("lozinka123", 10);

  const user1Id = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const user2Id = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12";
  const preduzeceId = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21";
  const samostalacId = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";
  const radnik1Id = "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31";
  const usluga1Id = "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41";
  const termin1Id = "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51";

  await db.transaction(async (tx) => {
    await tx.insert(korisniciTable).values([
      { idkorisnik: user1Id, ime: "Marko", prezime: "Marković", email: "marko@gmail.com", lozinka: hash },
      { idkorisnik: user2Id, ime: "Jovana", prezime: "Jović", email: "jovana@gmail.com", lozinka: hash },
    ]);

    await tx.insert(preduzecaTable).values([
      { 
        idpreduzece: preduzeceId, 
        naziv: "Servis Plus DOO", 
        email: "servis@plus.com", 
        lozinka: hash, 
        tip: "USLUZNO_PREDUZECE",
        verifikovan: true,
        brojusluga: 1
      },
      { 
        idpreduzece: samostalacId, 
        naziv: "Majstor Mile", 
        email: "mile@majstor.com", 
        lozinka: hash, 
        tip: "SAMOSTALAC",
        verifikovan: false,
        brojusluga: 1
      },
    ]);

    await tx.insert(radniciTable).values([
      { idradnik: radnik1Id, idpreduzece: preduzeceId, ime: "Dragan", prezime: "Nikolić" },
    ]);

    await tx.insert(uslugeTable).values([
      { 
        idusluga: usluga1Id, 
        idpreduzece: preduzeceId, 
        naziv: "Servis Klima Uređaja", 
        opis: "Kompletno čišćenje i dopuna freona.", 
        cena: 4500,
        slikaurl: "https://picsum.photos/400/300" 
      },
    ]);

    await tx.insert(terminiTable).values([
      { 
        idtermin: termin1Id, 
        idusluga: usluga1Id, 
        idradnik: radnik1Id, 
        datumvreme: new Date("2024-12-25T10:00:00") 
      },
    ]);

    await tx.insert(rezervacijeTable).values([
      { 
        idrezervacija: "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a61", 
        idkorisnik: user1Id, 
        idtermin: termin1Id, 
        napomena: "Prvi sprat, stan 4.", 
        status: "CREATED" 
      },
    ]);

    await tx.insert(recenzijeTable).values([
      { 
        idrecenzija: "00eebc99-9c0b-4ef8-bb6d-6bb9bd380a71", 
        idkorisnik: user1Id, 
        idpreduzece: preduzeceId, 
        ocena: 5, 
        komentar: "Sjajna usluga, veoma brzi!" 
      },
    ]);
  });

  console.log("Seedovanje je uspešno završeno!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Greška prilikom seedovanja:", err);
  process.exit(1);
});