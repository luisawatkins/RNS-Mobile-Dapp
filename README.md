# RNS Portfolio App

A cross-platform React Native mobile application for managing Rootstock Name Service (RNS) domains and tracking cryptocurrency portfolios. This app simplifies blockchain interaction with human-readable names and comprehensive portfolio management.

##  Features

### Core Features
- **RNS Domain Management**: Search, register, and manage .rsk domains
- **Portfolio Tracking**: Monitor balances across multiple addresses with USD values
- **Transaction Sending**: Send transactions using RNS names instead of hex addresses
- **QR Code Support**: Generate and scan QR codes for addresses and RNS names
- **Multi-Address Management**: Track multiple wallets in one place
- **Real-time Updates**: Live balance updates via The Graph subscriptions

### Technical Features
- **WalletConnect v2 Integration**: Secure wallet connection
- **The Graph Integration**: Efficient blockchain data indexing
- **Caching System**: Fast lookups with TTL-based cache
- **Batch Operations**: Efficient bulk RNS resolution
- **Gas Estimation**: Accurate transaction cost predictions
- **Dark Mode Support**: User-friendly interface options

##  Architecture

### Component Breakdown

#### Mobile Application
- **6 Main Screens**:
  - Dashboard: Portfolio overview, balance in USD, quick actions
  - RNS Explorer: Search, register, manage domains
  - Portfolio: Asset tracking, transaction history, charts
  - Send: RNS name input, gas estimation, preview
  - Settings: Wallet connection, preferences, network switching
  - QR Code: Generate and scan for addresses

#### RNS Integration
- `resolveRNSToAddress`: Convert RNS names to addresses
- `resolveAddressToRNS`: Reverse lookup
- `checkDomainAvailability`: Check if domain is available
- `registerDomain`: Register new domains
- `setResolver`: Configure domain resolver
- `renewDomain`: Extend domain registration
- `batchResolve`: Bulk domain resolution
- Caching layer with TTL
- Error handling and retry logic

#### The Graph Integration
- `getUserTokenBalances`: Fetch token balances
- `getTransactionHistory`: Query transaction data
- `getRNSDomains`: Get user's domains
- `getTokenTransfers`: Track token movements
- `getDomainActivity`: Monitor domain events
- Apollo Client with caching
- Real-time subscriptions
- Pagination support

#### Blockchain Layer
- `connectWallet`: WalletConnect v2 integration
- `getBalance`: RBTC and ERC20 balances
- `sendTransaction`: Transaction with nonce management
- `estimateGas`: Gas cost calculation
- `signMessage`: Message signing
- `switchNetwork`: Network switching
- Transaction queue management
- Retry logic
- Gas monitoring

#### State Management
- Redux store for:
  - Authentication state
  - Wallet information
  - RNS cache
  - Portfolio data
  - Transaction history
- AsyncStorage for:
  - User preferences
  - Cached resolutions with TTL
  - Recent recipients
  - Domain metadata
- State synchronization
- Auto-refresh mechanisms

#### UI Components
- Custom buttons and inputs
- Card components
- List views
- Modal dialogs
- QR generator/scanner
- Loading states
- Rootstock design system
- Accessibility features
- Dark mode support
- Responsive layouts

## Getting Started

### Prerequisites
- Node.js >= 20
- Java JDK 17 (for Android)
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/luisawatkins/RNS-Mobile-Dapp.git
cd RNS-Mobile-Dapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your values
```

4. Install iOS dependencies (requires Xcode):
```bash
cd ios && pod install
```

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Metro Bundler
```bash
npm start
```

##  Dependencies

### Core Dependencies
- `react-native`: 0.82.1
- `ethers`: 5.7.2
- `wagmi`: 2.x
- `viem`: Latest
- `@rsksmart/rns`: 1.9.0

### Wallet & Web3
- `@walletconnect/react-native-compat`
- `@reown/appkit-wagmi-react-native`
- `react-native-get-random-values`

### UI Components
- `react-native-svg`
- `react-native-modal`
- `react-native-qrcode-svg`
- `react-native-chart-kit`
- `react-native-safe-area-context`

### Navigation
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`

### Data Management
- `@tanstack/react-query`
- `@react-native-async-storage/async-storage`
- `@react-native-community/netinfo`

##  Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
ROOTSTOCK_RPC_URL=https://public-node.testnet.rsk.co
ROOTSTOCK_MAINNET_RPC_URL=https://public-node.rsk.co
GRAPH_API_URL=your_graph_api_url
WALLETCONNECT_PROJECT_ID=your_project_id
```

### Network Configuration
The app supports multiple Rootstock networks:
- Rootstock Mainnet (Chain ID: 30)
- Rootstock Testnet (Chain ID: 31)

##  App Structure

```
src/
├── screens/          # Main app screens
│   ├── HomeScreen.tsx
│   ├── RNSExplorerScreen.tsx
│   ├── PortfolioScreen.tsx
│   ├── SendScreen.tsx
│   ├── QRCodeScreen.tsx
│   └── SettingsScreen.tsx
├── components/       # Reusable components
│   ├── PortfolioCard.tsx
│   ├── TransactionList.tsx
│   ├── RNSSearch.tsx
│   └── Web3Provider.tsx
├── hooks/           # Custom React hooks
│   ├── useRNS.ts
│   ├── usePortfolio.ts
│   └── useSendTransaction.ts
├── services/        # Business logic
│   ├── rnsService.ts
│   └── graphService.ts
├── config/          # Configuration
│   └── walletConfig.ts
├── types/           # TypeScript types
└── utils/           # Utility functions
```

##  Performance

- **Caching**: Aggressive caching of RNS resolutions with TTL
- **Batch Operations**: Bulk queries for efficiency
- **Lazy Loading**: On-demand data fetching
- **Optimistic Updates**: Immediate UI feedback
- **Background Refresh**: Automatic data updates

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


Built with ❤️ for the Rootstock ecosystem