"use client";
import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState(''); // Samo za Korisnika
  const [naziv, setNaziv] = useState('');     // Samo za Preduzece/Samostalca
  const [uloga, setUloga] = useState<'KORISNIK' | 'SAMOSTALAC' | 'USLUZNO_PREDUZECE'>('KORISNIK');

  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    const body = isLogin 
      ? { email, lozinka } 
      : { email, lozinka, ime, prezime, naziv, uloga };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.token) localStorage.setItem('token', data.token);
      alert(isLogin ? "Uspešna prijava!" : "Uspešna registracija!");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Prijava' : 'Registracija'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {!isLogin && (
          <select 
            className="border p-2 rounded"
            value={uloga} 
            onChange={(e) => setUloga(e.target.value as any)}
          >
            <option value="KORISNIK">Klijent (Korisnik)</option>
            <option value="SAMOSTALAC">Samostalni radnik</option>
            <option value="USLUZNO_PREDUZECE">Uslužno preduzeće</option>
          </select>
        )}

        {/* Dinamicka polja u zavisnosti od uloge i moda (login/register)  */}
        {!isLogin && uloga === 'KORISNIK' && (
          <>
            <input className="border p-2 rounded" placeholder="Ime" onChange={e => setIme(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Prezime" onChange={e => setPrezime(e.target.value)} />
          </>
        )}

        {!isLogin && (uloga === 'SAMOSTALAC' || uloga === 'USLUZNO_PREDUZECE') && (
          <input className="border p-2 rounded" placeholder="Naziv preduzeća/radnje" onChange={e => setNaziv(e.target.value)} />
        )}

        <input className="border p-2 rounded" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input className="border p-2 rounded" type="password" placeholder="Lozinka" onChange={e => setLozinka(e.target.value)} required />
        
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isLogin ? 'Prijavi se' : 'Registruj se'}
        </button>
      </form>
      
      <button onClick={() => setIsLogin(!isLogin)} className="mt-4 text-sm text-blue-500 underline">
        {isLogin ? 'Nemaš nalog? Registruj se' : 'Već imaš nalog? Prijavi se'}
      </button>
    </div>
  );
}