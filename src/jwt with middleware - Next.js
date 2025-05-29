1. login page (Frontend)
const handleLogin = async () => {     -----------------------------> Sending the user data to log in and in response it will get the token
  const res = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  localStorage.setItem('token', data.token);

  // Navigate to dashboard
  router.push('/dashboard');
};



2. app/api/login/route.ts (backend)    ---------------------------> this will check from database, if user_id, pass is correct or not. If yes, then signToken
import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === 'admin@example.com' && password === 'password123') {  ---->  this can be checked from database
    const token = signToken({ email });
    return NextResponse.json({ token });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}



3. lib/auth.ts(backend)    ------------------------------------> In this file signToken, verifyToken function is implemented (DRY)
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret';

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): any | null {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}




4. middleware.ts ---------------------------------------------------->

🔒 Why use middleware?
- No need to duplicate token checking in each route.
- Protects whole sections like /dashboard/...../.

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');     //localStorage is not accessible in middleware — that’s why the client sends the token in Authorization headers.

  const isValid = token && verifyToken(token);

  // Protect only these routes
  const protectedPaths = ['/dashboard', '/profile'];

  const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

  if (isProtected && !isValid) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'], // Adjust as needed
};


5. in other customized route where you dont want to use middleware...there you need to use token manually................>>>>>>
const token = localStorage.getItem('token');
const res = await fetch('/api/some-protected-route', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
