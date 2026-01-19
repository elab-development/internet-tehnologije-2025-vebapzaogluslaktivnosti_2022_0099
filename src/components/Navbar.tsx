"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow-md mb-6">
            <Link href="/" className="text-xl font-bold text-indigo-600">Usluge.rs</Link>

            <div className="flex gap-4 items-center">
                {/* POČETNA STRANICA - Ovaj link se prikazuje SVIM korisnicima */}
                <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                    Početna
                </Link>
                {user && (user.uloga === 'SAMOSTALAC' || user.uloga === 'USLUZNO_PREDUZECE') && (
                    <Link href="/usluge/create" className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                        + Novi Oglas
                    </Link>
                )}
                {/* Samo ulogovani klijenti (KORISNIK) vide ovu karticu */}
                {user?.uloga === 'KORISNIK' && (
                    <Link href="/usluge" className="font-medium text-indigo-600 border-b-2 border-indigo-600">
                        Usluge
                    </Link>
                )}
                {user ? (
                    <>
                        <span className="text-sm text-gray-600">Zdravo, {user.email} ({user.uloga})</span>
                        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Odjavi se</button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="text-indigo-600 hover:underline">Prijava / Registracija</Link>
                    </>
                )}
            </div>
        </nav>
    );
}