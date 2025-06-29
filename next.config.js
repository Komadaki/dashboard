/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configurações válidas para Next.js 14+:
  experimental: {
    serverActions: true,       // Habilitar Server Actions
    optimizePackageImports: [  // Otimizar imports
      '@radix-ui/react-icons'
    ]
  }
}

module.exports = nextConfig