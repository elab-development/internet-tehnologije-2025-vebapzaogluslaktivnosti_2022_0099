"use client";
import { useState } from "react";

type Props = {
  onSearch: (query: string, price: number) => void;
};

export default function SearchFilters({ onSearch }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000); // Podrazumevana max cena

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-end">
        {/* Polje za tekstualnu pretragu */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pretraga</label>
          <input
            type="text"
            placeholder="Naziv usluge ili preduzeća..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        {/* Slider za cenu */}
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maksimalna cena: <span className="text-indigo-600 font-bold">{maxPrice} €</span>
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        {/* Dugme za pretragu */}
        <button
          onClick={() => onSearch(inputValue, maxPrice)}
          className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Pretraži
        </button>
      </div>
    </div>
  );
}