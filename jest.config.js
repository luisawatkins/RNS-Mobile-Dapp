module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|@reown|wagmi|viem|@rsksmart)/)',
    ],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
  };