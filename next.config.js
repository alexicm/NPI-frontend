/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remover redirecionamentos que podem estar causando problemas
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/novos-projetos",
  //       permanent: true,
  //     },
  //   ]
  // },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
  // Configuração para garantir que o Next.js gere corretamente as páginas estáticas
  output: "standalone",
  // Add this line to fix the dependency conflict
  experimental: {
    swcMinify: true, // Certifique-se de que está ativado
  },
}

module.exports = nextConfig
