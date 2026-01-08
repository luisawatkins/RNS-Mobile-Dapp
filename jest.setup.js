import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
  );
  // Mock WalletConnect
  jest.mock('@walletconnect/react-native-compat', () => ({}));

// Mock globals
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

if (typeof window !== 'undefined') {
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    window.dispatchEvent = jest.fn();
    
    if (!window.crypto) {
        window.crypto = {
            getRandomValues: (buffer) => {
                return require('crypto').randomFillSync(buffer);
            }
        };
    }
} else {
    global.window = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        crypto: {
            getRandomValues: (buffer) => {
                return require('crypto').randomFillSync(buffer);
            }
        }
    };
}