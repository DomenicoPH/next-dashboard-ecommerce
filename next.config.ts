import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      /*
      {
        protocol: 'https',
        hostname: 'nestjs-eccommercex-819245f6bb7d.herokuapp.com',
        pathname: '/**',
      },
      */
      {
        protocol: 'https',
        hostname: 'depilzone-ecommerce-backend.ambitiousisland-19a5adf8.westus2.azurecontainerapps.io',
        pathname: '/**',
      },
    ],
    domains: [
      'depilzoneblob.blob.core.windows.net',
      //'nestjs-eccommercex-819245f6bb7d.herokuapp.com',
      'depilzone-ecommerce-backend.ambitiousisland-19a5adf8.westus2.azurecontainerapps.io'
    ],
  },
};

export default nextConfig;