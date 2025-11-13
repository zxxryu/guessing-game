/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    API_BASE: process.env.API_BASE || "http://localhost:8787",
  },
  allowedDevOrigins: ['*'],
}

export default nextConfig
