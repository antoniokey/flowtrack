import type { NextConfig } from 'next';

import ModuleFederationPlugin from '@module-federation/nextjs-mf';

const nextConfig: NextConfig = {
  webpack(config) {
    config.plugins.push(
      new ModuleFederationPlugin({
        name: 'dashboard',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './DashboardPage': './src/pages/index.tsx',
        },
        shared: {
          react: { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
        },
        extraOptions: {},
      }),
    );

    return config;
  }
};

export default nextConfig;
