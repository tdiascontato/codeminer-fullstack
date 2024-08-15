// codeminer/frontend_codeminer/jest.config.js
module.exports = {
  roots: [ '<rootDir>/src/app/components/tests', '<rootDir>/src/app/dashboard/tests'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '^.+\\.(css|less|scss|sass)$': 'jest-transform-css',
  },
  moduleNameMapper: {
    '^@/app/components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@/app/stylus/(.*)$': '<rootDir>/src/app/stylus/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^next/router$': '<rootDir>/__mocks__/next/router.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!some-module-to-transform).+\\.js$',  // Se precisar transformar algum módulo específico
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
