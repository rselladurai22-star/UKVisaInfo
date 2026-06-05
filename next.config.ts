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
        source: '/visa-switching',
        destination: '/visa-types/visa-switching',
        permanent: true,
      },
      {
        source: '/tools/compare',
        destination: '/visa-types/compare',
        permanent: true,
      },
      {
        source: '/visa/:path*',
        destination: '/visa-types/:path*',
        permanent: true,
      },
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
  async rewrites() {
    return [
      { source: '/property', destination: '/category/property' },
      { source: '/insurance', destination: '/category/insurance' },
      { source: '/loans', destination: '/category/loans' },
      { source: '/immigration', destination: '/category/immigration' },
      { source: '/savings', destination: '/category/savings' },
      { source: '/tax', destination: '/category/tax' },
      { source: '/business', destination: '/category/business' },
      { source: '/estate', destination: '/category/estate' },
      { source: '/family-law', destination: '/category/family-law' },
      { source: '/energy', destination: '/category/energy' },
      { source: '/employment', destination: '/category/employment' },
      { source: '/vehicles', destination: '/category/vehicles' },
      { source: '/benefits', destination: '/category/benefits' },
    ];
  },
};

export default config;
