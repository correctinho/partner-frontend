/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "images.pexels.com"
      },
      {
        protocol: 'https',
        hostname:'produto.app'
      },
      {
        protocol: 'https',
        hostname:'cdn-cosmos.bluesoft.com.br'
      },
      {
        protocol: 'https',
        hostname:'ggeixytstedqzounudkz.supabase.co'
      }
    ]
  }

}

module.exports = nextConfig
