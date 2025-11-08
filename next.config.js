/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  // Desactivar source maps en producción para ahorrar RAM
  productionBrowserSourceMaps: false,
  
  webpack: (config, { isServer }) => {
    // Soporte para Web Workers en el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig

