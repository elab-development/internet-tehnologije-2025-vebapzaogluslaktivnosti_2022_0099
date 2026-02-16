"use client"; 

import dynamic from 'next/dynamic';


const ServiceLocation = dynamic(() => import('@/components/ServiceLocation'), { 
  ssr: false,
  loading: () => <p className="p-8 text-center">Učitavam mapu...</p>
});

export default function MapSection() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Lokacije</h1>
      <ServiceLocation />
    </div>
  );
}