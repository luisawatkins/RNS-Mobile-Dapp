import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAccount } from 'wagmi';
import { useRNS } from '../hooks/useRNS';

export const QRCodeScreen: React.FC = () => {
  const { address } = useAccount();
  const { lookupAddress } = useRNS();
  const [rnsName, setRnsName] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [displayMode, setDisplayMode] = useState<'address' | 'rns'>('address');

  React.useEffect(() => {
    const fetchRNSName = async () => {
      if (address) {
        const name = await lookupAddress(address);
        setRnsName(name);
      }
    };
    fetchRNSName();
  }, [address]);

  const handleShare = async () => {
    const shareData = displayMode === 'rns' && rnsName ? rnsName : address;
    if (!shareData) return;

    try {
      await Share.share({
        message: `My Rootstock ${displayMode === 'rns' ? 'RNS name' : 'address'}: ${shareData}`,
        title: 'Share Address',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const handleCopy = () => {
    const copyData = displayMode === 'rns' && rnsName ? rnsName : address;
    if (!copyData) return;
    
    // In a real app, you would use Clipboard API here
    Alert.alert('Success', `${displayMode === 'rns' ? 'RNS name' : 'Address'} copied to clipboard!`);
  };

  const qrValue = displayMode === 'rns' && rnsName ? rnsName : address || '';

  if (!address) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Please connect your wallet first</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Receive</Text>
        <Text style={styles.subtitle}>
          Share your address or RNS name to receive funds
        </Text>
      </View>

      <View style={styles.qrSection}>
        {rnsName && (
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                displayMode === 'address' && styles.modeButtonActive
              ]}
              onPress={() => setDisplayMode('address')}
            >
              <Text style={[
                styles.modeText,
                displayMode === 'address' && styles.modeTextActive
              ]}>
                Address
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                displayMode === 'rns' && styles.modeButtonActive
              ]}
              onPress={() => setDisplayMode('rns')}
            >
              <Text style={[
                styles.modeText,
                displayMode === 'rns' && styles.modeTextActive
              ]}>
                RNS Name
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.qrContainer}>
          <QRCode
            value={qrValue}
            size={250}
            backgroundColor="white"
            color="#1A1A1A"
          />
        </View>

        <View style={styles.addressCard}>
          {displayMode === 'rns' && rnsName ? (
            <>
              <Text style={styles.addressLabel}>RNS Name</Text>
              <Text style={styles.addressValue}>{rnsName}</Text>
            </>
          ) : (
            <>
              <Text style={styles.addressLabel}>Wallet Address</Text>
              <Text style={styles.addressValue}>
                {address?.substring(0, 10)}...{address?.substring(34)}
              </Text>
            </>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.copyButton]}
            onPress={handleCopy}
          >
            <Text style={styles.actionButtonText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scanSection}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setShowScanner(true)}
        >
          <Text style={styles.scanIcon}>📷</Text>
          <View>
            <Text style={styles.scanTitle}>Scan QR Code</Text>
            <Text style={styles.scanSubtitle}>
              Scan someone else's QR code to send funds
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How it works</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Share your QR code or address to receive RBTC and tokens
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Use RNS names for easy-to-remember addresses
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Scan QR codes to quickly send to other addresses
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  qrSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  modeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  modeTextActive: {
    color: '#FF6B00',
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    width: '100%',
  },
  addressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  shareButton: {
    backgroundColor: '#FF6B00',
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scanSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B00',
    borderStyle: 'dashed',
  },
  scanIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  scanSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoBullet: {
    fontSize: 14,
    color: '#FF6B00',
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
