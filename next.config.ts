import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/t',
        destination: '/t/1',
        permanent: true,
      },
      {
        source: '/t/:id/editor',
        destination: '/t/:id',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
