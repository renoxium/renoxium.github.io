import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build into /docs at the repo root so GitHub Pages can serve from /docs on the
// renoxium.github.io repo. base is '/' because user/organization Pages sites
// (username.github.io) are served from the domain root, not a sub-path.
export default defineConfig({
  plugins: [react()],
  base: '/',
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
