import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  boolean,
  doublePrecision,
  pgEnum,
  text
} from "drizzle-orm/pg-core";

export const tipEnum = pgEnum("tip", [
  "SAMOSTALAC",
  "USLUZNO_PREDUZECE"
]);

export const statusRezervacijeEnum = pgEnum("status_rezervacije", [
  "CREATED",
  "COMPLETED"
]);

export const korisniciTable = pgTable("korisnici", {
  idkorisnik: serial("idkorisnik").primaryKey(),
  ime: varchar("ime", { length: 100 }).notNull(),
  prezime: varchar("prezime", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  lozinka: varchar("lozinka", { length: 255 }).notNull()
});


export const preduzecaTable = pgTable("preduzeca", {
  idpreduzece: serial("idpreduzece").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  lozinka: varchar("lozinka", { length: 255 }).notNull(),
  naziv: varchar("naziv", { length: 100 }).notNull(),
  brojusluga: integer("brojusluga").default(0),
  verifikovan: boolean("verifikovan").default(false),
  tip: tipEnum("tip").notNull(),
});


export const radniciTable = pgTable("radnici", {
  idradnik: serial("idradnik").primaryKey(),
  ime: varchar("ime", { length: 100 }).notNull(),
  prezime: varchar("prezime", { length: 100 }).notNull(),
  idpreduzece: integer("idpreduzece")
    .notNull()
    .references(() => preduzecaTable.idpreduzece),
});


export const uslugeTable = pgTable("usluge", {
  idusluga: serial("idusluga").primaryKey(),
  naziv: varchar("naziv", { length: 100 }).notNull(),
  opis: varchar("opis", { length: 500 }),
  cena: doublePrecision("cena").notNull(),
  slikaurl: text("slikaurl"),
  idpreduzece: integer("idpreduzece")
    .notNull()
    .references(() => preduzecaTable.idpreduzece),
});

export const terminiTable = pgTable("termini", {
  idtermin: serial("idtermin").primaryKey(),
  datumvreme: timestamp("datumvreme").notNull(),
  idusluga: integer("idusluga")
    .notNull()
    .references(() => uslugeTable.idusluga),
  idradnik: integer("idradnik")
    .notNull()
    .references(() => radniciTable.idradnik),
});


export const rezervacijeTable = pgTable("rezervacije", {
  idrezervacija: serial("idrezervacija").primaryKey(),
  napomena: text("napomena"),
  status: statusRezervacijeEnum("status").notNull(),
  idkorisnik: integer("idkorisnik")
    .notNull()
    .references(() => korisniciTable.idkorisnik),
  idtermin: integer("idtermin")
    .notNull()
    .unique()
    .references(() => terminiTable.idtermin),
});


export const recenzijeTable = pgTable("recenzije", {
  idrecenzija: serial("idrecenzija").primaryKey(),
  ocena: integer("ocena").notNull(),
  komentar: text("komentar").notNull(),
  idkorisnik: integer("idkorisnik")
    .notNull()
    .references(() => korisniciTable.idkorisnik),
  idpreduzece: integer("idpreduzece")
    .notNull()
    .references(() => preduzecaTable.idpreduzece),
});
