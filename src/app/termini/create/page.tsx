"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider"; 
import Navbar from "@/components/Navbar";

export default function CreateTerminPage() {
  const { user } = useAuth(); // Pristup podacima o ulogovanom preduzeću
  const [podaci, setPodaci] = useState<{ radnici: any[], usluge: any[] }>({ radnici: [], usluge: [] });
  const [selectedRadnik, setSelectedRadnik] = useState("");
  const [selectedUsluga, setSelectedUsluga] = useState("");
  const [datum, setDatum] = useState("");
  const [poruka, setPoruka] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/termini?idPreduzeca=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPodaci(data);
        })
        .catch((err) => console.error("Greška pri učitavanju:", err));
    }
  }, [user]); // Re-render se vrši kada se promeni status ulogovanog korisnika 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/termini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        datumvreme: datum,
        idradnik: selectedRadnik,
        idusluga: selectedUsluga
      }),
    });
    setSelectedRadnik("");
    setSelectedUsluga("");
    const data = await res.json();
    if (res.ok) {
      alert("Uspesno kreiranje.");
    } else {
      alert("Neuspesno kreiranje.");
    }
    //setPoruka(data.message); 
  };

  if (!user || user.uloga === 'KORISNIK') {
    return <div className="p-10 text-center">Nemate dozvolu za pristup ovoj stranici.</div>;
  }
  return (
    <main>
    <Navbar />
    <div className="mx-auto max-w-md mt-10 p-6 bg-white rounded shadow border border-gray-200">
      <h1 className="text-xl font-bold mb-4">Kreiranje termina</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium">Datum i vreme:</label>
        <input 
          type="datetime-local" 
          className="border p-2 rounded" 
          onChange={(e) => setDatum(e.target.value)} 
          required 
        />

        <label className="text-sm font-medium">Usluga:</label>
        <select 
          className="border p-2 rounded" 
          value={selectedUsluga}
          onChange={(e) => setSelectedUsluga(e.target.value)} 
          required
        >
          <option value="">-- Odaberite uslugu --</option>
          {podaci.usluge.map((u) => (
            <option key={u.idusluga} value={u.idusluga}>{u.naziv}</option>
          ))}
        </select>

        <label className="text-sm font-medium">Radnik:</label>
        <select 
          className="border p-2 rounded" 
          value={selectedRadnik}
          onChange={(e) => setSelectedRadnik(e.target.value)} 
          required
        >
          <option value="">-- Odaberite radnika --</option>
          {podaci.radnici.map((r) => (
            <option key={r.idradnik} value={r.idradnik}>{r.ime} {r.prezime}</option>
          ))}
        </select>

        <button type="submit" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
          Sačuvaj termin
        </button>
      </form>
      {poruka && <p className="mt-4 text-center font-bold text-blue-600">{poruka}</p>}
    </div>
    </main>
  );
}