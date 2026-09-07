import nextConfig from 'eslint-config-next';

const config = [
  {
    ignores: ['.firebase/**', '.next/**', 'node_modules/**'],
  },
  ...nextConfig,
];

export default config;
