"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider"; // Korišćenje auth kuke 

export default function CreateTerminPage() {
  const { user } = useAuth();
  const [radnici, setRadnici] = useState<any[]>([]);
  const [selectedRadnik, setSelectedRadnik] = useState("");
  const [datum, setDatum] = useState("");
  const [poruka, setPoruka] = useState("");

  useEffect(() => {
    if (user?.id) {
      // API ruta koju smo upravo napravili
      fetch(`/api/termini?idPreduzeca=${user.id}`)
        .then(res => res.json())
        .then(data => setRadnici(data));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/termini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        datumvreme: datum,
        idradnik: selectedRadnik,
        idpreduzece: user?.id
      }),
    });
    const data = await res.json();
    setPoruka(data.message); // Prikazuje "Uspesno kreiranje." prema Use Case 4 
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow border border-gray-200">
      <h1 className="text-xl font-bold mb-4">Kreiranje termina (Use Case 4)</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium">Datum i vreme:</label>
        <input 
          type="datetime-local" 
          className="border p-2 rounded" 
          onChange={(e) => setDatum(e.target.value)} 
          required 
        />
        <label className="text-sm font-medium">Izaberite radnika:</label>
        <select 
          className="border p-2 rounded" 
          onChange={(e) => setSelectedRadnik(e.target.value)} 
          required
        >
          <option value="">-- Izaberi --</option>
          {radnici.map((r) => (
            <option key={r.idradnik} value={r.idradnik}>{r.ime} {r.prezime}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Potvrdi kreiranje
        </button>
      </form>
      {poruka && <p className={`mt-4 text-center font-bold ${poruka.includes('Uspesno') ? 'text-green-600' : 'text-red-600'}`}>{poruka}</p>}
    </div>
  );
}