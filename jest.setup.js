require('@testing-library/jest-dom')

// Polyfills for Node.js environment
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock import.meta.env for Vite
if (typeof global.importMeta === 'undefined') {
  global.importMeta = {
    env: {
      DEV: false,
      PROD: true,
      MODE: 'test',
      VITE_APP_VERSION: undefined,
    },
  }
}

