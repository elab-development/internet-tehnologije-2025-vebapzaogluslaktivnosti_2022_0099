"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { useAuth } from "@/components/AuthProvider"; 
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DetaljiUslugePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [usluga, setUsluga] = useState<any>(null);
  const [termini, setTermini] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTermin, setSelectedTermin] = useState<number | null>(null);
  const [poruka, setPoruka] = useState("");

  const idUsluge = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/usluge/details?id=${idUsluge}`);
        const data = await res.json();

        setUsluga(data.usluga);
        setTermini(data.termini || []);
      } catch (err) {
        console.error("Greška pri učitavanju:", err);
      } finally {
        setLoading(false);
      }
    };

    if (idUsluge) {
      fetchData();
    }
  }, [idUsluge]);

  const handleRezervacija = async () => {
    if (!selectedTermin || !user) {
      setPoruka("Morate biti ulogovani i izabrati termin.");
      return;
    }

    const res = await fetch("/api/rezervacije", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idtermin: selectedTermin,
        idkorisnik: user.id, 
        napomena: "Rezervacija preko web platforme"
      }),
    });

    const data = await res.json();
    //setPoruka(data.message); 
    if (res.ok) {
      alert("Uspesno zakazivanje.");
    } else {
      //alert("Neuspesno zakazivanje.");
      alert(data.message);
    }
  };

  if (loading) return <div className="p-10 text-center">Učitavanje podataka o usluzi...</div>;
  if (!usluga) return <div className="p-10 text-center">Usluga nije pronađena.</div>;

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl p-6 bg-gray-50 min-h-screen">
        <Link href="/usluge" className="text-indigo-600 hover:underline mb-4 inline-block">
          ← Nazad na sve usluge
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{usluga.naziv}</h1>
          <p className="text-gray-500 mt-2 text-lg">{usluga.opis}</p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-2xl font-black text-indigo-600">{usluga.cena} €</span>
            
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center italic">
            Kalendar dostupnosti - Izaberite termin
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {termini.length > 0 ? (
              termini.map((t) => (
                <button
                  key={t.idtermin}
                  onClick={() => setSelectedTermin(t.idtermin)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${selectedTermin === t.idtermin
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md"
                      : "border-gray-100 bg-gray-50 hover:border-indigo-300 text-gray-600"
                    }`}
                >
                  <div className="font-bold">
                    {new Date(t.datumvreme).toLocaleDateString("sr-RS")}
                  </div>
                  <div className="text-sm">
                    {new Date(t.datumvreme).toLocaleTimeString("sr-RS", { hour: '2-digit', minute: '2-digit' })}h
                  </div>
                </button>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400 py-10">
                Trenutno nema slobodnih termina za ovu uslugu.
              </p>
            )}
          </div>

          <button
            onClick={handleRezervacija}
            disabled={!selectedTermin || !user}
            className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors shadow-lg shadow-indigo-100"
          >
            {user ? "Potvrdi rezervaciju" : "Prijavite se da biste rezervisali"}
          </button>

          {poruka && (
            <div className={`mt-6 p-4 rounded-xl text-center font-semibold ${poruka.includes("Uspesno") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              }`}>
              {poruka}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
