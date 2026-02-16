"use client";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

export default function ReservationChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/statistika/rezervacije");
        const data = await res.json();
        setChartData(data);
      } catch (err) {
        console.error("Neuspešno učitavanje statistike:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center p-4">Učitavam statistiku...</p>;

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={chartData.length > 1 ? chartData : [["Mesec", "Rezervacije"], ["Nema podataka", 0]]}
        options={{
          title: "Stvarna statistika rezervacija iz baze",
          curveType: "function",
          legend: { position: "bottom" },
          colors: ["#4f46e5"],
        }}
      />
    </div>
  );
}