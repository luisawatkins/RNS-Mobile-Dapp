import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAccount, useBalance } from 'wagmi';
import { parseEther } from 'viem';
import { useRNS } from '../hooks/useRNS';
import { RNSService } from '../services/rnsService';
import { useSendTransaction } from '../hooks/useSendTransaction';

export const SendScreen: React.FC = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { resolveRNSToAddress } = useRNS();
  const { sendTransaction, estimateGas, loading } = useSendTransaction();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const handleRecipientChange = async (value: string) => {
    setRecipient(value);
    setResolvedAddress(null);

    // Check if it's an RNS name
    if (value.endsWith('.rsk')) {
      try {
        const address = await resolveRNSToAddress(value);
        if (address) {
          setResolvedAddress(address);
        }
      } catch (error) {
        console.error('Failed to resolve RNS name:', error);
      }
    } else {
      const checksummed = RNSService.validateAddress(value);
      if (checksummed) {
        setResolvedAddress(checksummed);
      }
    }
  };

  const handleEstimateGas = async () => {
    if (!resolvedAddress || !amount) {
      Alert.alert('Error', 'Please enter recipient and amount');
      return;
    }

    try {
      const estimate = await estimateGas(
        resolvedAddress,
        parseEther(amount)
      );
      setGasEstimate(estimate);
      setIsPreview(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to estimate gas');
    }
  };

  const handleSend = async () => {
    if (!resolvedAddress || !amount) {
      Alert.alert('Error', 'Please enter recipient and amount');
      return;
    }

    try {
      const txHash = await sendTransaction(
        resolvedAddress,
        parseEther(amount)
      );
      
      Alert.alert(
        'Success',
        `Transaction sent!\nHash: ${txHash.substring(0, 10)}...`,
        [
          {
            text: 'OK',
            onPress: () => {
              setRecipient('');
              setAmount('');
              setResolvedAddress(null);
              setGasEstimate(null);
              setIsPreview(false);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Transaction failed');
    }
  };

  const maxAmount = balance ? balance.formatted : '0';
  const insufficientFunds = parseFloat(amount) > parseFloat(maxAmount);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Send Transaction</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>
            {balance?.formatted || '0'} {balance?.symbol || 'RBTC'}
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recipient</Text>
          <TextInput
            style={styles.input}
            placeholder="RNS name (alice.rsk) or address (0x...)"
            value={recipient}
            onChangeText={handleRecipientChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {resolvedAddress && (
            <View style={styles.resolvedCard}>
              <Text style={styles.resolvedLabel}>Resolved to:</Text>
              <Text style={styles.resolvedAddress}>
                {resolvedAddress.substring(0, 10)}...{resolvedAddress.substring(38)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Amount</Text>
            <TouchableOpacity
              onPress={() => setAmount(maxAmount)}
            >
              <Text style={styles.maxButton}>MAX</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.input,
              insufficientFunds && styles.inputError
            ]}
            placeholder="0.0"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          {insufficientFunds && (
            <Text style={styles.errorText}>Insufficient funds</Text>
          )}
        </View>

        {!isPreview ? (
          <TouchableOpacity
            style={[
              styles.button,
              styles.estimateButton,
              (!resolvedAddress || !amount || insufficientFunds) && styles.buttonDisabled
            ]}
            onPress={handleEstimateGas}
            disabled={!resolvedAddress || !amount || insufficientFunds || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Preview Transaction</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.previewSection}>
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>Transaction Preview</Text>
              
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>From:</Text>
                <Text style={styles.previewValue}>
                  {address?.substring(0, 6)}...{address?.substring(38)}
                </Text>
              </View>

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>To:</Text>
                <Text style={styles.previewValue}>
                  {recipient.endsWith('.rsk') ? recipient : 
                    `${resolvedAddress?.substring(0, 6)}...${resolvedAddress?.substring(38)}`}
                </Text>
              </View>

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Amount:</Text>
                <Text style={styles.previewValue}>
                  {amount} {balance?.symbol || 'RBTC'}
                </Text>
              </View>

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Estimated Gas:</Text>
                <Text style={styles.previewValue}>
                  {gasEstimate || '0.0001'} RBTC
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Total:</Text>
                <Text style={styles.previewValueBold}>
                  {(parseFloat(amount) + parseFloat(gasEstimate || '0.0001')).toFixed(6)} RBTC
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsPreview(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.sendButton]}
                onPress={handleSend}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Confirm & Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Recipients</Text>
        {['alice.rsk', 'bob.rsk', '0x742d...5612'].map((recent, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentCard}
            onPress={() => setRecipient(recent)}
          >
            <View style={styles.recentIcon}>
              <Text>{recent.substring(0, 2).toUpperCase()}</Text>
            </View>
            <Text style={styles.recentAddress}>{recent}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maxButton: {
    color: '#FF6B00',
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  resolvedCard: {
    backgroundColor: '#E8F4FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  resolvedLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  resolvedAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  estimateButton: {
    backgroundColor: '#FF6B00',
  },
  sendButton: {
    backgroundColor: '#34C759',
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flex: 1,
    marginRight: 8,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  previewSection: {
    marginTop: 20,
  },
  previewCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
  },
  previewValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  previewValueBold: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  recentSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentAddress: {
    fontSize: 14,
    color: '#1A1A1A',
  },
});
