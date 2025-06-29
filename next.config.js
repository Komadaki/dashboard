// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Configurações válidas para Next.js 14
    serverActions: true,
    optimizePackageImports: ['@radix-ui/react-icons']
  }
}

module.exports = nextConfig