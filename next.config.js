/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configurações modernas para Next.js 14
  experimental: {
    serverActions: true,
    optimizePackageImports: ['@radix-ui/react-icons']
  }
}

module.exports = nextConfig