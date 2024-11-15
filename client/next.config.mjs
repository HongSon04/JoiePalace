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
};

export default nextConfig;
