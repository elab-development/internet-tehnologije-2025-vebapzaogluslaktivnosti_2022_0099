
"use client";
import Link from "next/link";
import { ReactNode } from "react";

interface NavCardProps {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export default function NavCard({ href, children, active, className = "" }: NavCardProps) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
        ${active 
          ? "bg-indigo-100 text-indigo-700 shadow-sm" 
          : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"} 
        ${className}`}
    >
      {children}
    </Link>
  );
}