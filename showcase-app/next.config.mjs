/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/showcase',
  assetPrefix: '/showcase/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
