import { useState } from 'react';
import { useSendTransaction as useWagmiSendTransaction } from 'wagmi';
import { ethers } from 'ethers';

export const useSendTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { sendTransactionAsync } = useWagmiSendTransaction();

  const sendTransaction = async (to: string, value: bigint) => {
    setLoading(true);
    try {
      const hash = await sendTransactionAsync({ to, value });
      setTxHash(hash);
      return hash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const waitForTransaction = async (hash: string) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.ROOTSTOCK_RPC_URL
      );
      const receipt = await provider.waitForTransaction(hash);
      return receipt;
    } catch (error) {
      console.error('Transaction wait failed:', error);
      throw error;
    }
  };

  return {
    sendTransaction,
    waitForTransaction,
    loading,
    txHash,
  };
};
