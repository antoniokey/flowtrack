import type { NextConfig } from 'next';

import NextFederationPlugin from '@module-federation/nextjs-mf';

const nextConfig: NextConfig = {
  transpilePackages: ['@flowtack/router'],
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          landing: `landing@http://localhost:3002/_next/static/chunks/remoteEntry.js`,
          dashboard: 'dashboard@http://localhost:3003/_next/static/chunks/remoteEntry.js',
        },
        extraOptions: {},
      }),
    );
    return config;
  },
};

export default nextConfig;
