/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.transparentpng.com',
        port: '',
        pathname: '/thumb/**',
      },
    ],
  },
}

module.exports = nextConfig 