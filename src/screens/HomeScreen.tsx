import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { usePortfolio } from '../hooks/usePortfolio';
import { useRNS } from '../hooks/useRNS';
import { PortfolioCard } from '../components/PortfolioCard';
import { RNSSearch } from '../components/RNSSearch';
import { TransactionList } from '../components/TransactionList';

export const HomeScreen: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { connect, connectors } = useConnect();
    const { balances, transactions, nativeBalance, loading, refresh } = usePortfolio();
    const { lookupAddress } = useRNS();
    const [rnsName, setRnsName] = useState<string | null>(null);
    
    React.useEffect(() => {
      const fetchRNSName = async () => {
        if (address) {
          const name = await lookupAddress(address);
          setRnsName(name);
        }
      };
      fetchRNSName();
    }, [address]);
    
    if (!isConnected) {
      return (
        <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Welcome to RNS Portfolio</Text>
            <Text style={styles.subtitle}>
              Connect your wallet to get started
            </Text>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => connect({ connector: connectors[0] })}
            >
              <Text style={styles.connectButtonText}>Connect Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.addressLabel}>Connected</Text>
            <Text style={styles.address}>
              {rnsName || `${address?.substring(0, 6)}...${address?.substring(38)}`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={() => disconnect()}
          >
            <Text style={styles.disconnectText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
        <RNSSearch />
        <PortfolioCard
          nativeBalance={nativeBalance}
          balances={balances}
        />
        <TransactionList transactions={transactions} />
      </ScrollView>
    );
  };
  const styles = StyleSheet.create({
    connectButton: {
      backgroundColor: '#FF6B00',
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 12,
      marginTop: 20,
    },
    connectButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    welcomeContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1A1A1A',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 30,
      textAlign: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    addressLabel: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
    },
    address: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1A1A1A',
    },
    disconnectButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#FF3B30',
      borderRadius: 8,
    },
    disconnectText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
  });