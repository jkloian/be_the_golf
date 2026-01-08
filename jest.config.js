module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/app/javascript'],
  testMatch: ['**/__tests__/**/*.{spec,test}.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/helpers/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/javascript/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', {
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'app/javascript/**/*.{ts,tsx}',
    '!app/javascript/**/*.d.ts',
    '!app/javascript/**/__tests__/**',
    '!app/javascript/**/*.test.{ts,tsx}',
    '!app/javascript/**/*.spec.{ts,tsx}',
    '!app/javascript/entrypoints/**',
    '!app/javascript/styles/**',
    '!app/javascript/locales/**',
    '!app/javascript/modules/animations/**',
    '!app/javascript/components/pages/DevProcessingPage.tsx',
    '!app/javascript/components/pages/DevResultsPage.tsx',
    '!app/javascript/shared/types/**',
    '!app/javascript/modules/i18n/config.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './app/javascript/components/': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
}

