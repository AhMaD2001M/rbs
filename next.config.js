/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGO_URI: process.env.MONGO_URI,
  },
}

module.exports = nextConfig 