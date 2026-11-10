/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  // Static export for Netlify (publish = "out")
  images: {
    unoptimized: true,
  },
};
module.exports = nextConfig;
