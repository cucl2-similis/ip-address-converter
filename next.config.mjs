/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'docs',
  assetPrefix: '/ip-address-converter',
  rewrites() {
    return [
      { source: '/ip-address-converter/_next/:path*', destination: '/_next/:path*' }
    ]
  }
};

export default nextConfig;
