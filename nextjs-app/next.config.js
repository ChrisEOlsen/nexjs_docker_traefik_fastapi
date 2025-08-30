const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    // Add alias for the src folder
    config.resolve.alias["@"] = path.resolve(__dirname, "src")
    return config
  },
  // This is the crucial setting for the Dockerfile
  output: 'standalone',
};

module.exports = nextConfig;