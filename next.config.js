/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  // === OPTIMIZACIÓN: Reducir uso de memoria en builds ===
  experimental: {
    // Reducir workers en paralelo para ahorrar RAM
    workerThreads: false,
    cpus: 1,
  },
  
  // Desactivar source maps en producción para ahorrar RAM
  productionBrowserSourceMaps: false,
  
  webpack: (config, { isServer, dev }) => {
    // Soporte para Web Workers en el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // === OPTIMIZACIÓN: Reducir uso de memoria en webpack ===
    if (!dev) {
      // Limitar paralelismo
      config.parallelism = 1;
      
      // Optimizar performance con menos memoria
      config.performance = {
        ...config.performance,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig

