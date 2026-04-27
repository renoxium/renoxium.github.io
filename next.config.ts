import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // better-sqlite3 is a native module and must run on the server only.
  // serverExternalPackages keeps Next from trying to bundle it.
  serverExternalPackages: ['better-sqlite3'],
};

export default config;
