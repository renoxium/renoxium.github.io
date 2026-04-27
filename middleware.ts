import { NextResponse, type NextRequest } from 'next/server';

// Gate /admin/* with HTTP basic auth. Creds set via env vars on the VPS:
//   ADMIN_USER=admin
//   ADMIN_PASS=<long random string>
// Locally, .env.local sets a dev pair. If either env is missing, /admin is
// blocked outright — no accidental "default password" exposure.

export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware(req: NextRequest) {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASS;

  if (!expectedUser || !expectedPass) {
    return new NextResponse('Admin disabled (ADMIN_USER/ADMIN_PASS not set)', { status: 503 });
  }

  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    const decoded = atob(auth.slice(6));
    const sep = decoded.indexOf(':');
    if (sep > 0) {
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);
      if (user === expectedUser && pass === expectedPass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Renoxium Admin", charset="UTF-8"',
    },
  });
}
