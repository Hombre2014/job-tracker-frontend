/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wallpapers.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
