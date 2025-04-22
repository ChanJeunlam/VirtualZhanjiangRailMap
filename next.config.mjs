/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/VirtualZhanjiangRailMap' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/VirtualZhanjiangRailMap/' : '',
  trailingSlash: true,
  // Add webpack configuration to handle Leaflet
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

export default nextConfig;
