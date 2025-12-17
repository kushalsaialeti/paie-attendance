// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000
//   }
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // IMPORTANT: ensures correct routing & asset resolution on Vercel
  base: "/",

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false
  },

  server: {
    port: 5173,
    strictPort: true
  }
});
