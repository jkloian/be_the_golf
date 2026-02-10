import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintReact from '@eslint-react/eslint-plugin'

export default tseslint.config(
  {
    ignores: ['node_modules/', 'dist/', 'public/vite', '**/*.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // React rules only for JSX files
  {
    files: ['app/javascript/**/*.tsx'],
    ...eslintReact.configs['recommended-typescript'],
  },
  // TypeScript + language options for all TS/TSX
  {
    files: ['app/javascript/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  // Test files: relax some rules and allow mock "use*" names
  {
    files: ['app/javascript/**/*.test.{ts,tsx}', 'app/javascript/**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@eslint-react/no-unnecessary-use-prefix': 'off',
    },
  }
)

