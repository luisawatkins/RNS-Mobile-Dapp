import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TokenBalance } from '../services/graphService';
import { ethers } from 'ethers';

interface PortfolioCardProps {
    nativeBalance: string;
    balances: TokenBalance[];
  }
  export const PortfolioCard: React.FC<PortfolioCardProps> = ({
    nativeBalance,
    balances,
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Portfolio</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.tokenSymbol}>tRBTC</Text>
          <Text style={styles.balance}>{parseFloat(nativeBalance).toFixed(6)}</Text>
          <Text style={styles.label}>Native Balance</Text>
        </View>
        {balances.length > 0 && (
          <View style={styles.tokenList}>
            <Text style={styles.sectionTitle}>Token Balances</Text>
            {balances.map((item, index) => {
              const amount = ethers.utils.formatUnits(
                item.amount,
                item.token.decimals
              );
              return (
                <View key={index} style={styles.tokenItem}>
                  <View>
                    <Text style={styles.tokenName}>{item.token.name}</Text>
                    <Text style={styles.tokenSymbol}>{item.token.symbol}</Text>
                  </View>
                  <Text style={styles.tokenAmount}>
                    {parseFloat(amount).toFixed(4)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      marginTop: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 16,
    },
    balanceCard: {
      backgroundColor: '#007AFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    tokenSymbol: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 8,
    },
    balance: {
      color: '#FFFFFF',
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    label: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 14,
    },
    tokenList: {
      marginTop: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 12,
    },
    tokenItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#F9F9F9',
      borderRadius: 10,
      marginBottom: 8,
    },
    tokenName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#1A1A1A',
    },
    tokenAmount: {
      fontSize: 16,
      fontWeight: '600',
      color: '#007AFF',
    },
  });
  