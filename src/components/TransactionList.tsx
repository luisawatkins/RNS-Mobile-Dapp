import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Transaction } from '../services/graphService';

interface TransactionListProps {
    transactions: Transaction[];
  }
  export const TransactionList: React.FC<TransactionListProps> = ({
    transactions,
  }) => {
    const openExplorer = (txHash: string) => {
      const url = `https://explorer.testnet.rsk.co/tx/${txHash}`;
      Linking.openURL(url);
    };
    if (transactions.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Recent Transactions</Text>
          <Text style={styles.emptyText}>No transactions yet</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Transactions</Text>
        {transactions.map((tx) => (
          <TouchableOpacity
            key={tx.id}
            style={styles.txItem}
            onPress={() => openExplorer(tx.id)}
          >
            <View style={styles.txInfo}>
              <Text style={styles.txHash}>
                {tx.id.substring(0, 10)}...{tx.id.substring(62)}
              </Text>
              <Text style={styles.txTime}>
                {new Date(tx.timestamp * 1000).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.txValue}>
              {parseFloat(tx.value).toFixed(6)} tRBTC
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      marginTop: 10,
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 14,
      color: '#999',
      textAlign: 'center',
      paddingVertical: 20,
    },
    txItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#F9F9F9',
      borderRadius: 10,
      marginBottom: 8,
    },
    txInfo: {
      flex: 1,
    },
    txHash: {
      fontSize: 14,
      fontFamily: 'monospace',
      color: '#1A1A1A',
      marginBottom: 4,
    },
    txTime: {
      fontSize: 12,
      color: '#666',
    },
    txValue: {
      fontSize: 14,
      fontWeight: '600',
      color: '#007AFF',
    },
  });