import { FlatCompat } from '@eslint/eslintrc'
 
const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})
 
const eslintConfig = [
  //replaces .eslintignore
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      //ignore generated prisma output (your warnings are coming from here)
      'lib/generated/**',
      'lib/generated/prisma/**',
    ],
  },

  ...compat.config({
    extends: ['next'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  }),
]