import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: [
      '.firebase/**',
      '.next/**',
      'node_modules/**',
      '.agents/**',
      'dist/**',
      'out/**',
      'build/**',
      '*.tsbuildinfo',
    ],
  },
  ...compat.extends('next/core-web-vitals'),
];

export default config;
