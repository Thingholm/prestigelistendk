/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fyoonxbvccocgqkxnjqs.supabase.co',
        port: '',
        pathname: 'storage/v1/object/public/riderPortraits/**'
      }
    ],
  },
}

module.exports = nextConfig
