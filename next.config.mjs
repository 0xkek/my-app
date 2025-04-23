// next.config.mjs (Adding webpack externals to silence warnings)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // This line helps prevent errors if client-side code accidentally tries to import server-only modules
    config.resolve.fallback = { fs: false, net: false, tls: false };
    // This line tells webpack to ignore missing optional dependencies
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
  // We are NOT adding typescript: { ignoreBuildErrors: true }
};

export default nextConfig;