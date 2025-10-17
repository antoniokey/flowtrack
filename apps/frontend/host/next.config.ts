import type { NextConfig } from 'next';

import NextFederationPlugin from '@module-federation/nextjs-mf';

const nextConfig: NextConfig = {
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          landing: `landing@http://localhost:3002/_next/static/chunks/remoteEntry.js`,
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
        },
        extraOptions: {},
      }),
    );
    return config;
  },
};

export default nextConfig;
