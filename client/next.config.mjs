/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
  webpack: (config, { dev }) => {
    // Ensure that Fast Refresh is not affected by caching in development mode
    if (config.cache && dev) {
      config.cache = false; // Disable caching in development for better Fast Refresh
    }

    // Important: return the modified config
    return config;
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
