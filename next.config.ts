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
        destination: '/self-employed-tax#mileage',
        permanent: true,
      },
      {
        source: '/tax-digital-twin',
        destination: '/take-home-pay',
        permanent: true,
      },
      {
        source: '/payslip-decoder',
        destination: '/payslip-auditor',
        permanent: true,
      },
      {
        source: '/self-assessment-calculator',
        destination: '/self-employed-tax',
        permanent: true,
      },
      {
        source: '/contractor-day-rate',
        destination: '/contractor-ir35',
        permanent: true,
      },
      {
        source: '/ir35-calculator',
        destination: '/contractor-ir35',
        permanent: true,
      },
      {
        source: '/dividend-tax',
        destination: '/director-dividend',
        permanent: true,
      },
      {
        source: '/child-benefit-calculator',
        destination: '/child-benefit-trap',
        permanent: true,
      },
      {
        source: '/tax-code',
        destination: '/payslip-auditor',
        permanent: true,
      },
      {
        source: '/company-car-tax',
        destination: '/salary-sacrifice-calculator',
        permanent: true,
      },
      {
        source: '/national-insurance',
        destination: '/take-home-pay',
        permanent: true,
      },
      {
        source: '/sole-trader-vs-limited',
        destination: '/director-dividend',
        permanent: true,
      },
      {
        source: '/pension-allowance',
        destination: '/salary-sacrifice-calculator',
        permanent: true,
      },
      {
        source: '/vat-calculator',
        destination: '/take-home-pay',
        permanent: true,
      },
    ];
  },
};

export default config;
