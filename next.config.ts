import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'www.leafrootfruit.com.au' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // html-to-docx is server-only; prevent it being bundled client-side
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, encoding: false };
    }
    return config;
  },
};

export default nextConfig;
