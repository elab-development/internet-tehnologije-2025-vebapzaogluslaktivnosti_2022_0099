import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken, AUTH_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs'; 

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (!token) {
    return NextResponse.json({ error: "Morate biti ulogovani" }, { status: 401 });
  }

  try {
    const payload = verifyAuthToken(token);

    
    // 1. Upravljanje uslugama (Smeju samo SAMOSTALAC i USLUZNO_PREDUZECE) 
    if (pathname.startsWith('/api/usluge') && ['POST', 'PUT', 'DELETE'].includes(method)) {
      if (payload.role === 'KORISNIK') {
        return NextResponse.json({ error: "Nemate dozvolu za upravljanje uslugama" }, { status: 403 });
      }
    }

    // 2. Rezervacije i Recenzije (Sme samo KORISNIK) 
    if ((pathname.startsWith('/api/rezervacije') || pathname.startsWith('/api/recenzije')) && method === 'POST') {
      if (payload.role !== 'KORISNIK') {
        return NextResponse.json({ error: "Samo klijenti mogu vršiti rezervacije i ocenjivanje" }, { status: 403 });
      }
    }

    return NextResponse.next();
  } catch (err: any) {
    // Vraćamo JSON grešku prema zahtevima 
    return NextResponse.json({ error: "Nevalidna sesija: " + err.message }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/usluge/:path*', '/api/rezervacije/:path*', '/api/recenzije/:path*', '/api/termini/:path*'],
};