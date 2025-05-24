module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/electron'], // Look for tests in the electron directory
  testMatch: [
    '**/tests/**/*.test.ts', // Pattern for test files
    '**/__tests__/**/*.test.ts', // Alternative pattern
  ],
  moduleNameMapper: {
    // If you have module aliases in tsconfig.json, map them here
    // Example: '^@/(.*)$': '<rootDir>/src/$1'
    // For electron main process code, we might need to map electron paths if using aliases
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Ensure this points to your main tsconfig
    },
  },
};
