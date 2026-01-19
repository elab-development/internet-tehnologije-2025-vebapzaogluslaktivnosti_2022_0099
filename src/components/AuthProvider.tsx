"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipovi korisnika 
type User = {
  id: number;
  email: string;
  uloga: 'KORISNIK' | 'SAMOSTALAC' | 'USLUZNO_PREDUZECE';
} | null;

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // useEffect se poziva prilikom prvog rendera da proveri da li je korisnik vec ulogovan 
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};