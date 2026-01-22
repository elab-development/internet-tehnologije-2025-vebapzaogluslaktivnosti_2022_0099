CREATE TYPE "public"."status_rezervacije" AS ENUM('CREATED', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "korisnici" (
	"idkorisnik" serial PRIMARY KEY NOT NULL,
	"ime" varchar(100) NOT NULL,
	"prezime" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"lozinka" varchar(255) NOT NULL,
	CONSTRAINT "korisnici_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "recenzije" (
	"idrecenzija" serial PRIMARY KEY NOT NULL,
	"ocena" integer NOT NULL,
	"komentar" text NOT NULL,
	"idkorisnik" integer NOT NULL,
	"idpreduzece" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rezervacije" (
	"idrezervacija" serial PRIMARY KEY NOT NULL,
	"napomena" text,
	"status" "status_rezervacije" NOT NULL,
	"idkorisnik" integer NOT NULL,
	"idtermin" integer NOT NULL,
	CONSTRAINT "rezervacije_idtermin_unique" UNIQUE("idtermin")
);
--> statement-breakpoint
ALTER TABLE "termini" DROP CONSTRAINT "termini_idpreduzece_preduzeca_idpreduzece_fk";
--> statement-breakpoint
ALTER TABLE "radnici" ALTER COLUMN "idpreduzece" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "termini" ALTER COLUMN "idradnik" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "usluge" ALTER COLUMN "idpreduzece" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "preduzeca" ADD COLUMN "brojusluga" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "termini" ADD COLUMN "idusluga" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "usluge" ADD COLUMN "slikaurl" text;--> statement-breakpoint
ALTER TABLE "recenzije" ADD CONSTRAINT "recenzije_idkorisnik_korisnici_idkorisnik_fk" FOREIGN KEY ("idkorisnik") REFERENCES "public"."korisnici"("idkorisnik") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recenzije" ADD CONSTRAINT "recenzije_idpreduzece_preduzeca_idpreduzece_fk" FOREIGN KEY ("idpreduzece") REFERENCES "public"."preduzeca"("idpreduzece") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rezervacije" ADD CONSTRAINT "rezervacije_idkorisnik_korisnici_idkorisnik_fk" FOREIGN KEY ("idkorisnik") REFERENCES "public"."korisnici"("idkorisnik") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rezervacije" ADD CONSTRAINT "rezervacije_idtermin_termini_idtermin_fk" FOREIGN KEY ("idtermin") REFERENCES "public"."termini"("idtermin") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "termini" ADD CONSTRAINT "termini_idusluga_usluge_idusluga_fk" FOREIGN KEY ("idusluga") REFERENCES "public"."usluge"("idusluga") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "termini" DROP COLUMN "idpreduzece";