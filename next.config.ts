import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // ESLint still runs during dev; skipped during production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors caught during dev; won't block production build
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'www.leafrootfruit.com.au' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // html-to-docx is server-only; keep fs/encoding out of client bundle
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, encoding: false };
    }
    return config;
  },
};

export default nextConfig;
