/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": "/home/ubuntu/client-manager/src",
      };
    }
    return config;
  },
};

module.exports = nextConfig;


