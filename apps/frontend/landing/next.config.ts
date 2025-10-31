import type { NextConfig } from 'next';

import NextFederationPlugin from '@module-federation/nextjs-mf';

const nextConfig: NextConfig = {
  transpilePackages: ['@flowtrack/ui'],
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'landing',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './LandingPage': './src/pages/index.tsx',
        },
        extraOptions: {},
      }),
    );
    return config;
  },
};

export default nextConfig;
