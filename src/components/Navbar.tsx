"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import NavCard from "./NavCard"; // Uvoz reusable komponente

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow-md mb-6 sticky top-0 z-50">
            <Link href="/" className="text-xl font-bold text-indigo-600">Usluge.rs</Link>

            <div className="flex gap-2 items-center">
                {/* Dostupno svima  */}
                <NavCard href="/">Početna</NavCard>

                {/* Use Case 3 & 4: Samo za pružaoce usluga  */}
                {user && (user.uloga === 'SAMOSTALAC' || user.uloga === 'USLUZNO_PREDUZECE') && (
                    <>
                        <NavCard href="/usluge/create" className="text-green-600 font-bold">
                            + Novi Oglas
                        </NavCard>
                        <NavCard href="/termini/create" className="bg-indigo-600 text-white hover:bg-indigo-700">
                            + Kreiraj Termin
                        </NavCard>
                    </>
                )}

                {/* Use Case 1: Pregled usluga za klijente  */}
                {user?.uloga === 'KORISNIK' && (
                    <NavCard href="/usluge" active>Usluge</NavCard>
                )}

                <div className="h-6 w-[1px] bg-gray-200 mx-2" /> {/* Separator */}

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                            {user.email} ({user.uloga})
                        </span>
                        <button 
                            onClick={logout} 
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition shadow-sm"
                        >
                            Odjavi se
                        </button>
                    </div>
                ) : (
                    <NavCard href="/login" className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                        Prijava / Registracija
                    </NavCard>
                )}
            </div>
        </nav>
    );
}