CREATE TYPE "public"."tip" AS ENUM('SAMOSTALAC', 'USLUZNO_PREDUZECE');--> statement-breakpoint
CREATE TABLE "preduzeca" (
	"idpreduzece" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"lozinka" varchar(255) NOT NULL,
	"naziv" varchar(100) NOT NULL,
	"verifikovan" boolean DEFAULT false,
	"tip" "tip" NOT NULL,
	CONSTRAINT "preduzeca_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "radnici" (
	"idradnik" serial PRIMARY KEY NOT NULL,
	"ime" varchar(100) NOT NULL,
	"prezime" varchar(100) NOT NULL,
	"idpreduzece" integer
);
--> statement-breakpoint
CREATE TABLE "termini" (
	"idtermin" serial PRIMARY KEY NOT NULL,
	"datumvreme" timestamp NOT NULL,
	"idradnik" integer,
	"idpreduzece" integer
);
--> statement-breakpoint
CREATE TABLE "usluge" (
	"idusluga" serial PRIMARY KEY NOT NULL,
	"naziv" varchar(100) NOT NULL,
	"opis" varchar(500),
	"cena" double precision NOT NULL,
	"idpreduzece" integer
);
--> statement-breakpoint
ALTER TABLE "radnici" ADD CONSTRAINT "radnici_idpreduzece_preduzeca_idpreduzece_fk" FOREIGN KEY ("idpreduzece") REFERENCES "public"."preduzeca"("idpreduzece") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "termini" ADD CONSTRAINT "termini_idradnik_radnici_idradnik_fk" FOREIGN KEY ("idradnik") REFERENCES "public"."radnici"("idradnik") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "termini" ADD CONSTRAINT "termini_idpreduzece_preduzeca_idpreduzece_fk" FOREIGN KEY ("idpreduzece") REFERENCES "public"."preduzeca"("idpreduzece") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usluge" ADD CONSTRAINT "usluge_idpreduzece_preduzeca_idpreduzece_fk" FOREIGN KEY ("idpreduzece") REFERENCES "public"."preduzeca"("idpreduzece") ON DELETE no action ON UPDATE no action;