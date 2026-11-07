/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — configured for Netlify static deployment
  output: "export",
  trailingSlash: true,

  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Static export doesn't support Next.js image optimisation server
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;

