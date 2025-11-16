import React from 'react';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../config/walletConfig';

const queryClient = new QueryClient();

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
};