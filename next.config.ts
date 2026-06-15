import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '://unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // <-- AGREGAMOS ESTA CONFIGURACIÓN DE WEBPACK PARA TAURI
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Le dice a Next.js que no intente cargar módulos de servidor en la app de PC
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        dns: false,
        child_process: false,
        undici: false,
        http2: false
      };
    }
    return config;
  },
};

export default nextConfig;

