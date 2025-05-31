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

|
|
|
4--------> (for Frontend Route Protection)
5-------->  (for API Security)
|
|
|
  
4. middleware.ts ---------------------------------------              for the frontend ✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓               ------------->
  ✅ This improves user experience by stopping unauthenticated users early. maybe using postman or else ..with out user from actual browser

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


5. in api endpoint route ...there you need to use token manually.......      from frontend ------------------->         for backend ✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓.........>>>>>>
const token = localStorage.getItem('token');
const res = await fetch('/api/some-protected-route', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

6. then in backend token will be collected from localstorage and use for verify








################################################################################ USING COOKIES ###############################################################################







1. login page (Frontend)
▶️ Send credentials ➜ server sets token in cookie


const handleLogin = async () => {
  const res = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    alert("Login failed");
    return;
  }

  // ✅ No need to store token manually — it's set as cookie by server
  router.push('/dashboard');
};






2. app/api/login/route.ts (Backend)               -------------------> it sets here ..not sends back to frontend like localstorage------------------------->
▶️ Validate user ➜ sign token ➜ set it as HTTP-only cookie


import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === 'admin@example.com' && password === 'password123') {
    const token = signToken({ email });

    // ✅ Set token as HTTP-only cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return NextResponse.json({ message: 'Login successful' });
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







4. middleware.ts (Frontend route protection) 🔐 ---------------------------------------              for the frontend ✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓               ------------->
✅ Automatically redirects unauthorized users from protected pages


import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const isValid = token && verifyToken(token);

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

--->
🔍 req.cookies.get() works in middleware — unlike localStorage, which doesn't.







5. in api endpoint route ...there you need to use cookie send by include manually.......      from frontend ------------------->         for backend ✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓.........>>>>>>
const res = await fetch('/api/some-protected-route', {
  method: 'GET',
  credentials: 'include', // ✅ IMPORTANT: ensures cookies are sent with the request
});
const data = await res.json();




6. then in backend token will be collected from cookies and use for verify
like 
  |
  |
  v
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  const token = cookies().get('token')?.value;

  const user = verifyToken(token);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  return new Response(JSON.stringify({ message: 'Welcome back!', user }));
}

