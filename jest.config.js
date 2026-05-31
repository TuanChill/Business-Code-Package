/** @type {import('ts-jest').JestConfigWithTsJest} */

const businessCodesMap = {
  '^@tchil/business-codes/nestjs$': '<rootDir>/src/nestjs/index.ts',
  '^@tchil/business-codes/nextjs$': '<rootDir>/src/nextjs/index.ts',
  '^@tchil/business-codes/i18n/react$': '<rootDir>/src/i18n/react/index.ts',
  '^@tchil/business-codes/i18n$': '<rootDir>/src/i18n/index.ts',
  '^@tchil/business-codes$': '<rootDir>/src/index.ts',
};

module.exports = {
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  projects: [
    {
      displayName: 'library',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/src'],
      testMatch: ['**/*.spec.ts'],
      moduleNameMapper: businessCodesMap,
    },
    {
      displayName: 'nestjs-examples',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/examples/nestjs/src', '<rootDir>/examples/nestjs/test'],
      testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
      moduleNameMapper: businessCodesMap,
    },
    {
      displayName: 'nextjs-routes',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/examples/nextjs/test'],
      testMatch: ['**/routes.spec.ts'],
      moduleNameMapper: businessCodesMap,
    },
    {
      displayName: 'nextjs-react',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/examples/nextjs/test'],
      testMatch: ['**/*.spec.tsx'],
      moduleNameMapper: businessCodesMap,
      setupFilesAfterEnv: ['@testing-library/jest-dom'],
    },
  ],
};
