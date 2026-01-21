"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchFilters from "@/components/SearchFilters";
import Image from "next/image";

export default function ServicesPage() {
  const [sveUsluge, setSveUsluge] = useState([]);
  const [filtriraneUsluge, setFiltriraneUsluge] = useState([]);
  const [poruka, setPoruka] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/usluge");
        const data = await res.json();
        setSveUsluge(data);
        setFiltriraneUsluge(data);
      } catch (err) {
        console.error("Greška pri dohvatanju podataka:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Logika koja se pokreće na klik dugmeta
  const handleSearch = (upit: string, cena: number) => {
    const rezultati = sveUsluge.filter((u: any) => {
      const poklapaTekst = 
        u.naziv.toLowerCase().includes(upit.toLowerCase()) || 
        u.preduzece.naziv.toLowerCase().includes(upit.toLowerCase());
      const poklapaCenu = u.cena <= cena;
      
      return poklapaTekst && poklapaCenu;
    });

    setFiltriraneUsluge(rezultati);

    // Prouke
    if (rezultati.length > 0) {
      setPoruka("Usluge su pronadjene.");
    } else {
      setPoruka("Usluga nije pronadjena.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Pretraga i filtriranje usluga</h2>
        
        <SearchFilters onSearch={handleSearch} />

        {/* Statusna poruka - Use Case 1 */}
        {poruka && (
          <div className={`mb-6 p-3 rounded-lg border ${
            filtriraneUsluge.length > 0 ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {poruka}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Učitavanje podataka iz baze...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtriraneUsluge.map((u: any) => (
              <div key={u.idusluga} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="relative h-48 w-full">
                  {/* Image komponenta sa optimizacijom */}
                  <Image 
                    src={u.slikaurl || "https://picsum.photos/300/200"} 
                    alt={u.naziv} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800">{u.naziv}</h3>
                  <p className="text-indigo-600 text-sm font-medium">Pruža: {u.preduzece.naziv}</p>
                  <p className="text-gray-600 mt-2 text-sm line-clamp-2">{u.opis}</p>
                  <div className="mt-4 flex justify-between items-center border-t pt-4">
                    <span className="text-2xl font-bold text-gray-900">{u.cena} €</span>
                    <button className="text-white bg-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                      Detalji
                    </button>
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