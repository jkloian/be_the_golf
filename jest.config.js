export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/app/javascript'],
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/javascript/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'app/javascript/**/*.{ts,tsx}',
    '!app/javascript/**/*.d.ts',
    '!app/javascript/**/__tests__/**',
    '!app/javascript/**/*.test.{ts,tsx}',
    '!app/javascript/**/*.spec.{ts,tsx}',
  ],
}

