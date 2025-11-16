import '@walletconnect/react-native-compat';
import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

// Define Rootstock Testnet
export const rootstockTestnet = defineChain({
  id: 31,
  name: 'Rootstock Testnet',
  network: 'rootstock-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Test Rootstock Bitcoin',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.rootstock.io/your_api_key'],
    },
    public: {
      http: ['https://public-node.testnet.rsk.co'],
    },
  },
  blockExplorers: {
    default: {
      name: 'RSK Testnet Explorer',
      url: 'https://explorer.testnet.rsk.co',
    },
  },
  testnet: true,
});

// Define Rootstock Mainnet
export const rootstockMainnet = defineChain({
  id: 30,
  name: 'Rootstock',
  network: 'rootstock',
  nativeCurrency: {
    decimals: 18,
    name: 'Rootstock Bitcoin',
    symbol: 'RBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://public-node.rsk.co'],
    },
    public: {
      http: ['https://public-node.rsk.co'],
    },
  },
  blockExplorers: {
    default: {
      name: 'RSK Explorer',
      url: 'https://explorer.rsk.co',
    },
  },
  testnet: false,
});

// Project metadata for WalletConnect
// Note: Get your project ID from https://cloud.walletconnect.com
const projectId = process.env.WALLETCONNECT_PROJECT_ID || '';
const metadata = {
  name: 'RNS Portfolio App',
  description: 'Manage your Rootstock domains and track your portfolio',
  url: 'https://rnsportfolio.app',
  icons: ['https://rnsportfolio.app/icon.png'],
  redirect: {
    native: 'rnsportfolioapp://',
    universal: 'https://rnsportfolio.app',
  },
};

// Create Wagmi config
export const wagmiConfig = createConfig({
  chains: [rootstockTestnet, rootstockMainnet],
  transports: {
    [rootstockTestnet.id]: http(),
    [rootstockMainnet.id]: http(),
  },
});