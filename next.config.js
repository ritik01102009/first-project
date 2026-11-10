/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack (experimental) and force the stable Webpack compiler
  // This avoids Windows file‑lock / subprocess issues when processing CSS.
  experimental: {
    turbopack: false,
  },
  // Optional: silence the React‑version warning (React 19 will be used later)
  // reactStrictMode: true,
};
module.exports = nextConfig;
