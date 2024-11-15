/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dlpvcsewd/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/dlpvcsewd/**",
      },
      {
        protocol: "https",
        hostname: "whitepalace.com.vn",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/736x/**",
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (config.cache && dev) {
      config.cache = false;
    }
    return config;
  },
  productionBrowserSourceMaps: false,
  env: {
    GOOGLE_ID:
      "697374533132-drs6mt7kui60vukftijiiq7biji9qcg4.apps.googleusercontent.com",
    GOOGLE_SECRET: "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",
    NEXTAUTH_SECRET: "nguyenquocthanh-admin-secret-key",
    NEXTAUTH_URL: "http://localhost:3000",
  },
};

export default nextConfig;
