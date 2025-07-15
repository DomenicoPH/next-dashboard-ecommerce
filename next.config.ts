import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'depilzoneblob.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nestjs-eccommercex-819245f6bb7d.herokuapp.com',
        pathname: '/**',
      }
    ],
    domains: [
      'depilzoneblob.blob.core.windows.net',
      'nestjs-eccommercex-819245f6bb7d.herokuapp.com'
    ],
  },
};

export default nextConfig;