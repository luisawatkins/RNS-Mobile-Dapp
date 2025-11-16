import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { graphService, TokenBalance, Transaction } from '../services/graphService';
import { ethers } from 'ethers';

export const usePortfolio = () => {
    const { address } = useAccount();
    const [balances, setBalances] = useState<TokenBalance[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [nativeBalance, setNativeBalance] = useState<string>('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchPortfolioData = async () => {
      if (!address) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch token balances from The Graph
        const tokenBalances = await graphService.getTokenBalances(address);
        setBalances(tokenBalances);
        // Fetch recent transactions
        const recentTxs = await graphService.getRecentTransactions(address);
        setTransactions(recentTxs);
        // Fetch native RBTC balance directly from RPC
        const provider = new ethers.providers.JsonRpcProvider(
          process.env.ROOTSTOCK_RPC_URL
        );
        const balance = await provider.getBalance(address);
        setNativeBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        console.error('Portfolio fetch error:', err);
        setError('Failed to fetch portfolio data');
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchPortfolioData();
    }, [address]);
    return {
      balances,
      transactions,
      nativeBalance,
      loading,
      error,
      refresh: fetchPortfolioData,
    };
  };
  