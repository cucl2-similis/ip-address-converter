/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'docs',
  assetPrefix: '/docs',
  rewrites() {
    return [
      { source: '/docs/_next/:path*', destination: '/_next/:path*' }
    ]
  }
};

export default nextConfig;
