import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  // transform: {
  //   '.(ts|tsx)$': require.resolve('ts-jest/dist'),
  //   '.(js|jsx)$': require.resolve('babel-jest'), // jest's default
  // },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
  testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}'],
  testURL: 'http://localhost',
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
};

export default config;
