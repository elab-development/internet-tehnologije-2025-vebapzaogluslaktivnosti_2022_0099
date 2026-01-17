-- CreateTable
CREATE TABLE `Korisnik` (
    `idkorisnik` INTEGER NOT NULL AUTO_INCREMENT,
    `ime` VARCHAR(191) NOT NULL,
    `prezime` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `lozinka` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Korisnik_email_key`(`email`),
    PRIMARY KEY (`idkorisnik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Preduzece` (
    `idpreduzece` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `lozinka` VARCHAR(191) NOT NULL,
    `naziv` VARCHAR(191) NOT NULL,
    `brojusluga` INTEGER NOT NULL DEFAULT 0,
    `verifikovan` BOOLEAN NOT NULL DEFAULT false,
    `tip` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Preduzece_email_key`(`email`),
    PRIMARY KEY (`idpreduzece`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Radnik` (
    `idradnik` INTEGER NOT NULL AUTO_INCREMENT,
    `ime` VARCHAR(191) NOT NULL,
    `prezime` VARCHAR(191) NOT NULL,
    `idpreduzece` INTEGER NOT NULL,

    PRIMARY KEY (`idradnik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usluga` (
    `idusluga` INTEGER NOT NULL AUTO_INCREMENT,
    `naziv` VARCHAR(191) NOT NULL,
    `opis` VARCHAR(191) NOT NULL,
    `cena` DOUBLE NOT NULL,
    `slikaurl` VARCHAR(191) NULL,
    `idpreduzece` INTEGER NOT NULL,

    PRIMARY KEY (`idusluga`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Termin` (
    `idtermin` INTEGER NOT NULL AUTO_INCREMENT,
    `datumvreme` DATETIME(3) NOT NULL,
    `idusluga` INTEGER NOT NULL,
    `idradnik` INTEGER NOT NULL,

    PRIMARY KEY (`idtermin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rezervacija` (
    `idrezervacija` INTEGER NOT NULL AUTO_INCREMENT,
    `napomena` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `idkorisnik` INTEGER NOT NULL,
    `idtermin` INTEGER NOT NULL,

    UNIQUE INDEX `Rezervacija_idtermin_key`(`idtermin`),
    PRIMARY KEY (`idrezervacija`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recenzija` (
    `idrecenzija` INTEGER NOT NULL AUTO_INCREMENT,
    `ocena` INTEGER NOT NULL,
    `komentar` VARCHAR(191) NOT NULL,
    `idkorisnik` INTEGER NOT NULL,
    `idpreduzece` INTEGER NOT NULL,

    PRIMARY KEY (`idrecenzija`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Radnik` ADD CONSTRAINT `Radnik_idpreduzece_fkey` FOREIGN KEY (`idpreduzece`) REFERENCES `Preduzece`(`idpreduzece`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usluga` ADD CONSTRAINT `Usluga_idpreduzece_fkey` FOREIGN KEY (`idpreduzece`) REFERENCES `Preduzece`(`idpreduzece`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Termin` ADD CONSTRAINT `Termin_idusluga_fkey` FOREIGN KEY (`idusluga`) REFERENCES `Usluga`(`idusluga`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Termin` ADD CONSTRAINT `Termin_idradnik_fkey` FOREIGN KEY (`idradnik`) REFERENCES `Radnik`(`idradnik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rezervacija` ADD CONSTRAINT `Rezervacija_idkorisnik_fkey` FOREIGN KEY (`idkorisnik`) REFERENCES `Korisnik`(`idkorisnik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rezervacija` ADD CONSTRAINT `Rezervacija_idtermin_fkey` FOREIGN KEY (`idtermin`) REFERENCES `Termin`(`idtermin`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recenzija` ADD CONSTRAINT `Recenzija_idkorisnik_fkey` FOREIGN KEY (`idkorisnik`) REFERENCES `Korisnik`(`idkorisnik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recenzija` ADD CONSTRAINT `Recenzija_idpreduzece_fkey` FOREIGN KEY (`idpreduzece`) REFERENCES `Preduzece`(`idpreduzece`) ON DELETE RESTRICT ON UPDATE CASCADE;
