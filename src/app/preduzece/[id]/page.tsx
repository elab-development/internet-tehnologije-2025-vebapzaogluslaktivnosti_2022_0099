"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";


export default function ProfilPreduzecaPage() {
    const params = useParams();
    const { user } = useAuth();
    const [ocena, setOcena] = useState(5);
    const [komentar, setKomentar] = useState("");
    const [poruka, setPoruka] = useState("");
    const [recenzije, setRecenzije] = useState<any[]>([]);
    const [preduzece, setPreduzece] = useState<any>(null);
    const [prethodneUsluge, setPrethodneUsluge] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchProfil = async () => {
            const res = await fetch(`/api/preduzece/details?id=${params.id}`);
            const data = await res.json();

            setPreduzece(data.preduzece);
            setPrethodneUsluge(data.prethodneUsluge || []);
            setRecenzije(data.recenzije || []);
            setLoading(false);
        };

        fetchProfil();
    }, [params.id]);

    if (loading) return <p className="p-10 text-center">Učitavanje...</p>;
    if (!preduzece) return <p className="p-10 text-center">Preduzeće nije pronađeno.</p>;

    // 3. LOGIKA ZA VERIFIKACIJU (Bedž)
    const prosek = recenzije.length > 0
        ? recenzije.reduce((acc, r) => acc + r.ocena, 0) / recenzije.length
        : 0;
    const isVerifikovan = prethodneUsluge.length >= 2 && prosek >= 4.5; //10
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const res = await fetch("/api/recenzije", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ocena,
                komentar,
                idkorisnik: user.id,
                idpreduzece: params.id
            }),
        });

        setKomentar("");
        const data = await res.json();
        //setPoruka(data.message);
        if (res.ok) {
            alert("Uspesno ocenjivanje.");
        } else {
            alert("Neuspesno ocenjivanje.");
            //alert(data.message);
        }
    };

    return (
        <main>
            <Navbar />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Profil pružaoca usluga</h1>
                <div className="flex items-center gap-4 mb-8 border-b pb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{preduzece.naziv}</h1>
                    {isVerifikovan && (
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                            ✔ VERIFIKOVAN
                        </span>
                    )}
                </div>
                <section>
                    <h2 className="text-xl font-bold mb-4 text-indigo-700 uppercase tracking-wide">
                        Prethodno obavljene usluge
                    </h2>
                    <div className="space-y-3">
                        {prethodneUsluge.map((u, i) => (
                            <div key={i} className="p-4 bg-gray-50 border rounded-xl flex justify-between items-center">
                                <span className="font-medium text-gray-700">{u.nazivUsluge}</span>
                                <span className="text-sm text-gray-400">{new Date(u.datumvreme).toLocaleDateString()}</span>
                            </div>
                        ))}
                        {prethodneUsluge.length === 0 && <p className="text-gray-400 italic">Nema zabeleženih završenih usluga.</p>}
                    </div>
                </section>
                {user?.uloga === 'KORISNIK' ? (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="font-semibold mb-4">Ostavite ocenu i komentar</h2>

                        <label className="block text-sm mb-2">Ocena (1-5):</label>
                        <select
                            value={ocena}
                            onChange={(e) => setOcena(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>

                        <label className="block text-sm mb-2">Vaš komentar:</label>
                        <textarea
                            className="w-full p-2 border rounded mb-4"
                            rows={3}
                            value={komentar}
                            onChange={(e) => setKomentar(e.target.value)}
                            placeholder="Podelite vaše iskustvo..."
                        />

                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                            Potvrdi recenziju
                        </button>
                    </form>
                ) : (
                    <p className="text-gray-500 italic">Samo ulogovani klijenti mogu ostavljati recenzije.</p>
                )}

                {poruka && <p className="mt-4 text-center font-bold text-indigo-600">{poruka}</p>}
                <section className="mt-10">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Zadovoljstvo korisnika i komentari</h2>

                    <div className="space-y-4">
                        {recenzije.length > 0 ? (
                            recenzije.map((r, index) => (
                                <div
                                    key={index} // Svaki element u nizu mora imati jedinstveni key [1]
                                    className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-bold text-indigo-700">
                                            {r.imeKorisnika || "Anonimni korisnik"}
                                        </span>
                                        <div className="flex text-yellow-500">
                                            {/* Dinamički prikaz zvezdica na osnovu ocene 1-5 [2, 6] */}
                                            {Array.from({ length: r.ocena }).map((_, i) => (
                                                <span key={i}>★</span>
                                            ))}
                                            {Array.from({ length: 5 - r.ocena }).map((_, i) => (
                                                <span key={i} className="text-gray-300">★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic leading-relaxed">
                                        "{r.komentar}"
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed">
                                Još uvek nema recenzija za ovog pružaoca usluga.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}