/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/showcase',
  assetPrefix: '/showcase/',
  trailingSlash: true,
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
