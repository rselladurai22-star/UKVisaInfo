import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/notice-period-calculator',
        destination: '/redundancy-pay#notice-period',
        permanent: true,
      },
      {
        source: '/mileage-expense-calculator',
        destination: '/self-assessment-calculator#mileage',
        permanent: true,
      },
    ];
  },
};

export default config;
