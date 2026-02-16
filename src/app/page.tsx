import Image from "next/image";
import Navbar from "@/components/Navbar";
import ReservationChart from "@/components/ReservationChart";
import MapSection from "@/components/MapSection";
import dynamic from 'next/dynamic';


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero sekcija */}
      <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Sve usluge na <span className="text-indigo-600">jednom mestu.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Pronađite pouzdane majstore, frizere, trenere i konsultante. Naša platforma objedinjuje
            najbolje samostalne radnike i preduzeća, omogućavajući vam transparentan uvid u kvalitet
            rada kroz ocene i recenzije.
          </p>
        </div>


      </div>
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Analiza poslovanja</h1>
        <ReservationChart />
      </div>
      <MapSection />
    </main>
  );
}