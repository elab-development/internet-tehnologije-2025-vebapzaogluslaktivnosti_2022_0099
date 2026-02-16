# Veb aplikacija za oglašavanje uslužnih aktivnosti
https://github.com/elab-development/internet-tehnologije-2025-vebapzaogluslaktivnosti_2022_0099

Ova aplikacija omogućava lak pronalazak pružalaca usluga (samostalaca i preduzeća), zakazivanje termina i transparentno ocenjivanje obavljenih usluga.

## Tehnologije
- **Frontend**: Next.js (React), Tailwind CSS, TypeScript
- **Backend**: Next.js API rute, Drizzle ORM 
- **Baza podataka**: PostgreSQL u Docker kontejneru 
- **Autentifikacija**: JWT tokeni i bezbedni kuki-fajlovi 

## Kako pokrenuti aplikaciju

### Preduslovi
- Instaliran **Docker** i **Docker Compose** 
- Instaliran **Node.js** 

### Instalacija i pokretanje
1. Klonirajte repozitorijum:
   ```bash
   git clone [URL tvog repozitorijuma]
2. Instalirajte zavisnosti:
3. Podesite .env fajl (DATABASE_URL, JWT_SECRET).
4. Pokrenite ceo sistem pomoću Docker-a:
5. Pokrenite migracije i seedovanje baze (u novom terminalu):
Aplikacija će biti dostupna na: http://localhost:3000 API dokumentacija (Swagger): http://localhost:3000/api/docs