import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Kreiranje Korisnika (Akteri: Ana i Lana) 
  const ana = await prisma.korisnik.create({
    data: {
      ime: 'Ana',
      prezime: 'Marinković',
      email: 'ana@elab.rs',
      lozinka: 'hash_lozinka_123', // Prema zahtevima lozinke moraju biti hashirane [7]
    },
  })

  const lana = await prisma.korisnik.create({
    data: {
      ime: 'Lana',
      prezime: 'Spasić',
      email: 'lana@elab.rs',
      lozinka: 'hash_lozinka_456',
    },
  })

  const strahinja = await prisma.korisnik.create({
    data: {
      ime: 'Strahinja',
      prezime: 'Mitov',
      email: 'strale@elab.rs',
      lozinka: 'hash_lozinka_789',
    },
  })

  // 2. Kreiranje Preduzeća (Tipovi: SAMOSTALAC i USLUZNO_PREDUZECE) 
  const preduzece1 = await prisma.preduzece.create({
    data: {
      naziv: 'Brzi Majstori d.o.o.',
      email: 'kontakt@brzimajstori.rs',
      lozinka: 'firma123',
      tip: 'USLUZNO_PREDUZECE',
      verifikovan: true, 
    },
  })

  // 3. Kreiranje Radnika (Povezan sa preduzećem) 
  const radnik1 = await prisma.radnik.create({
    data: {
      ime: 'Marko',
      prezime: 'Markovic',
      idpreduzece: preduzece1.idpreduzece,
    },
  })

  // 4. Kreiranje Usluge (Povezana sa preduzećem) 
  const usluga1 = await prisma.usluga.create({
    data: {
      naziv: 'Krecenje stana',
      opis: 'Profesionalno krecenje sa vasim ili nasim materijalom.',
      cena: 150.50,
      idpreduzece: preduzece1.idpreduzece,
    },
  })

  // 5. Kreiranje Termina (Povezan sa uslugom i radnikom) 
  const termin1 = await prisma.termin.create({
    data: {
      datumvreme: new Date('2025-05-20T10:00:00Z'),
      idusluga: usluga1.idusluga,
      idradnik: radnik1.idradnik,
    },
  })

  // 6. Kreiranje Rezervacije (Status: CREATED) 
  await prisma.rezervacija.create({
    data: {
      napomena: 'Molim vas dodjite tacno u 10h.',
      status: 'CREATED',
      idkorisnik: ana.idkorisnik,
      idtermin: termin1.idtermin,
    },
  })

  // 7. Kreiranje Recenzije 
  await prisma.recenzija.create({
    data: {
      ocena: 5,
      komentar: 'Odlicna usluga, radnik Marko je veoma ljubazan!',
      idkorisnik: lana.idkorisnik,
      idpreduzece: preduzece1.idpreduzece,
    },
  })

  console.log('Seedovanje baze uspesno zavrseno!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })