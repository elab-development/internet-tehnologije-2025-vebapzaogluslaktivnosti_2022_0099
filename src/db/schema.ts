import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  boolean,
  doublePrecision,
  pgEnum,
  text
} from "drizzle-orm/pg-core";

export const tipEnum = pgEnum("tip", ["SAMOSTALAC", "USLUZNO_PREDUZECE"]);

export const statusRezervacijeEnum = pgEnum("status_rezervacije", [
  "CREATED",
  "COMPLETED"
]);

// 1. Korisnici 
export const korisniciTable = pgTable("korisnici", {
  idkorisnik: uuid("idkorisnik").primaryKey().defaultRandom(), 
  ime: varchar("ime", { length: 100 }).notNull(),
  prezime: varchar("prezime", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  lozinka: varchar("lozinka", { length: 255 }).notNull()
});

// 2. Preduzeća 
export const preduzecaTable = pgTable("preduzeca", {
  idpreduzece: uuid("idpreduzece").primaryKey().defaultRandom(), 
  email: varchar("email", { length: 255 }).notNull().unique(),
  lozinka: varchar("lozinka", { length: 255 }).notNull(),
  naziv: varchar("naziv", { length: 100 }).notNull(),
  brojusluga: integer("brojusluga").default(0),
  verifikovan: boolean("verifikovan").default(false),
  tip: tipEnum("tip").notNull(),
});

// 3. Radnici 
export const radniciTable = pgTable("radnici", {
  idradnik: uuid("idradnik").primaryKey().defaultRandom(),
  ime: varchar("ime", { length: 100 }).notNull(),
  prezime: varchar("prezime", { length: 100 }).notNull(),
  idpreduzece: uuid("idpreduzece") 
    .notNull()
    .references(() => preduzecaTable.idpreduzece),
});

// 4. Usluge 
export const uslugeTable = pgTable("usluge", {
  idusluga: uuid("idusluga").primaryKey().defaultRandom(),
  naziv: varchar("naziv", { length: 100 }).notNull(),
  opis: text("opis"), 
  cena: doublePrecision("cena").notNull(),
  slikaurl: text("slikaurl"), 
  idpreduzece: uuid("idpreduzece")
    .notNull()
    .references(() => preduzecaTable.idpreduzece),
});

// 5. Termini 
export const terminiTable = pgTable("termini", {
  idtermin: uuid("idtermin").primaryKey().defaultRandom(),
  datumvreme: timestamp("datumvreme", { mode: "date" }).notNull(), 
  idusluga: uuid("idusluga")
    .notNull()
    .references(() => uslugeTable.idusluga),
  idradnik: uuid("idradnik")
    .notNull()
    .references(() => radniciTable.idradnik),
});

// 6. Rezervacije 
export const rezervacijeTable = pgTable("rezervacije", {
  idrezervacija: uuid("idrezervacija").primaryKey().defaultRandom(),
  napomena: text("napomena"),
  status: statusRezervacijeEnum("status").notNull().default("CREATED"),
  idkorisnik: uuid("idkorisnik")
    .notNull()
    .references(() => korisniciTable.idkorisnik),
  idtermin: uuid("idtermin")
    .notNull()
    .unique()
    .references(() => terminiTable.idtermin),
});

// 7. Recenzije 
export const recenzijeTable = pgTable("recenzije", {
  idrecenzija: uuid("idrecenzija").primaryKey().defaultRandom(),
  ocena: integer("ocena").notNull(),
  komentar: text("komentar").notNull(),
  idkorisnik: uuid("idkorisnik")
    .notNull()
    .references(() => korisniciTable.idkorisnik),
  idpreduzece: uuid("idpreduzece")
    .notNull()
    .references(() => preduzecaTable.idpreduzece),
});