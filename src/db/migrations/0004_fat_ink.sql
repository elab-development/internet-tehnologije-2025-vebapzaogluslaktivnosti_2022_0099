ALTER TABLE "korisnici" ALTER COLUMN "idkorisnik" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "korisnici" ALTER COLUMN "idkorisnik" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "preduzeca" ALTER COLUMN "idpreduzece" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "preduzeca" ALTER COLUMN "idpreduzece" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "radnici" ALTER COLUMN "idradnik" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "radnici" ALTER COLUMN "idradnik" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "radnici" ALTER COLUMN "idpreduzece" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "recenzije" ALTER COLUMN "idrecenzija" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "recenzije" ALTER COLUMN "idrecenzija" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "recenzije" ALTER COLUMN "idkorisnik" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "recenzije" ALTER COLUMN "idpreduzece" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "rezervacije" ALTER COLUMN "idrezervacija" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "rezervacije" ALTER COLUMN "idrezervacija" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "rezervacije" ALTER COLUMN "status" SET DEFAULT 'CREATED';--> statement-breakpoint
ALTER TABLE "rezervacije" ALTER COLUMN "idkorisnik" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "rezervacije" ALTER COLUMN "idtermin" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "termini" ALTER COLUMN "idtermin" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "termini" ALTER COLUMN "idtermin" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "termini" ALTER COLUMN "idusluga" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "termini" ALTER COLUMN "idradnik" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "usluge" ALTER COLUMN "idusluga" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "usluge" ALTER COLUMN "idusluga" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "usluge" ALTER COLUMN "opis" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usluge" ALTER COLUMN "idpreduzece" SET DATA TYPE uuid;