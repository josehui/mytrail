const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withPlugins(
  [
    withPWA,
    {
      dest: 'public',
      register: true,
      skipWaiting: true,
    },
  ],
  [
    withBundleAnalyzer,
    {
      reactStrictMode: false,
      eslint: {
        ignoreDuringBuilds: true,
      },
    },
  ]
);
