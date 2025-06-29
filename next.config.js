/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações válidas para Next.js 14
  experimental: {
    serverActions: true,
  },
  reactStrictMode: true,
}

module.exports = nextConfig