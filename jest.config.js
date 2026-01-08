module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|@reown|wagmi|@wagmi|viem|@rsksmart|@react-navigation|@tanstack|react-native-chart-kit|react-native-qrcode-svg)/)',
    ],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
  };