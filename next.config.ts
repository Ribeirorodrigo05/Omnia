import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains: ['drive.google.com', 'i.ibb.co', 'gemini.google.com'] // Adicione os domínios das imagens que você deseja permitir,
  }
};

export default nextConfig;
