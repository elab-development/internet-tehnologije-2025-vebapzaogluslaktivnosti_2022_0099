"use client";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";

export default function DetaljiUslugePage() {
  const params = useParams();
  const id = params.id;

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Detalji usluge</h1>
        <p className="mt-4 text-gray-600">Trenutno gledate detalje za uslugu sa ID-jem: <strong>{id}</strong></p>
        <div className="mt-10 p-20 border-2 border-dashed border-gray-200 rounded-lg">
          Ovde će se kasnije nalaziti svi podaci o usluzi, slike i recenzije.
        </div>
      </div>
    </main>
  );
}