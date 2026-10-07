/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sharp'],
  async rewrites() {
    return [
      {
        source: "/Admin",
        destination: "/admin",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
