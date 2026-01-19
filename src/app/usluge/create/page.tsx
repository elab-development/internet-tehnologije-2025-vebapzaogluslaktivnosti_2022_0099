"use client";
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function CreateServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ naziv: '', opis: '', cena: '', slikaurl: '' });

  // Zaštita rute: Samo Samostalac i Preduzeće smeju ovde 
  if (!user || user.uloga === 'KORISNIK') {
    return <div className="p-10 text-center">Nemate dozvolu za pristup ovoj stranici.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("PROVERAAAA");
    console.log(user.id);
    const res = await fetch('/api/usluge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, idpreduzece: user.id }),
    });
    
    if (res.ok) {
      alert("Uspesno kreiranje oglas!");
      router.push('/');
    } else {
      alert("Greska pri kreiranju.");
    }
  };

  return (
    <main>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-2xl font-bold mb-6">Kreiraj novu uslugu</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="border p-2 rounded" placeholder="Naziv usluge" onChange={e => setFormData({...formData, naziv: e.target.value})} required />
          <textarea className="border p-2 rounded" placeholder="Opis usluge" onChange={e => setFormData({...formData, opis: e.target.value})} />
          <input className="border p-2 rounded" type="number" placeholder="Cena (EUR)" onChange={e => setFormData({...formData, cena: e.target.value})} required />
          <input className="border p-2 rounded" placeholder="URL slike" onChange={e => setFormData({...formData, slikaurl: e.target.value})} />
          <button type="submit" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Objavi uslugu</button>
        </form>
      </div>
    </main>
  );
}