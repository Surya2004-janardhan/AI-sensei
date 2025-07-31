import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import crypto from "crypto";
// console.log("DEBUG crypto object:", crypto);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
