/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:shortcode',
        destination: '/redirect/:shortcode',
      },
    ]
  },
}

module.exports = nextConfig
