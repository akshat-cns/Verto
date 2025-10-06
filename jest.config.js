module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/tests/**'
    ],
    setupFiles: ['<rootDir>/jest.setup.js']
  };