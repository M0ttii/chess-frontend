/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.vox-cdn.com',
          port: '',
          pathname: '/uploads/**',
        },
      ],
    },
  }
