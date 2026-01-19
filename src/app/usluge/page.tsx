"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function ServicesPage() {
  const [usluge, setUsluge] = useState([]);
  const [search, setSearch] = useState("");
  const [maxCena, setMaxCena] = useState(10000);
  const [loading, setLoading] = useState(true);

  // Čitanje podataka iz baze (API poziv)
  useEffect(() => {
    const fetchUsluge = async () => {
      try {
        const res = await fetch("/api/usluge");
        const data = await res.json();
        setUsluge(data);
      } catch (error) {
        console.error("Greška pri čitanju iz baze:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsluge();
  }, []);

  // Filtriranje po nazivu i ceni
  const filtriraneUsluge = usluge.filter((u: any) => 
    u.naziv.toLowerCase().includes(search.toLowerCase()) && u.cena <= maxCena
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Dostupne usluge</h2>

        {/* Filteri */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 p-6 bg-white rounded-xl shadow-sm">
          <input 
            type="text" 
            placeholder="Pretraži po nazivu..." 
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-500 whitespace-nowrap">Maksimalna cena: {maxCena}€</label>
            <input 
              type="range" 
              min="0" max="10000" step="100"
              value={maxCena}
              onChange={(e) => setMaxCena(Number(e.target.value))}
              className="w-48"
            />
          </div>
        </div>

        {/* Prikaz usluga (Grid kartica) */}
        {loading ? <p>Učitavanje usluga iz baze...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtriraneUsluge.map((u: any) => (
              <div key={u.idusluga} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
                <div className="relative h-48 w-full">
                  <Image src={u.slikaurl || "https://picsum.photos/300/200"} alt={u.naziv} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800">{u.naziv}</h3>
                  <p className="text-gray-500 mt-2 text-sm line-clamp-2">{u.opis}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">{u.cena} €</span>
                    <button className="text-indigo-600 font-semibold hover:underline">Detalji</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}