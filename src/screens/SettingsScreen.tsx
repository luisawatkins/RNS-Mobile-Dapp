import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsScreen: React.FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const handleNetworkSwitch = (chainId: number) => {
    if (switchNetwork) {
      switchNetwork(chainId);
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached data including RNS resolutions and transaction history. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your data has been exported to your device');
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => disconnect(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Wallet Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet</Text>
        
        <View style={styles.settingCard}>
          <View>
            <Text style={styles.settingLabel}>Connected Address</Text>
            <Text style={styles.settingValue}>
              {address ? `${address.substring(0, 10)}...${address.substring(34)}` : 'Not connected'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.settingCard} onPress={handleDisconnect}>
          <Text style={styles.settingLabel}>Disconnect Wallet</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Network Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network</Text>
        
        <View style={styles.settingCard}>
          <View>
            <Text style={styles.settingLabel}>Current Network</Text>
            <Text style={styles.settingValue}>{chain?.name || 'Rootstock'}</Text>
          </View>
        </View>

        {chains?.map((network) => (
          <TouchableOpacity
            key={network.id}
            style={[
              styles.settingCard,
              chain?.id === network.id && styles.activeNetwork
            ]}
            onPress={() => handleNetworkSwitch(network.id)}
          >
            <View>
              <Text style={styles.settingLabel}>{network.name}</Text>
              <Text style={styles.settingSubtext}>Chain ID: {network.id}</Text>
            </View>
            {chain?.id === network.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#E0E0E0', true: '#FF6B00' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#E0E0E0', true: '#FF6B00' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Biometric Authentication</Text>
          <Switch
            value={biometrics}
            onValueChange={setBiometrics}
            trackColor={{ false: '#E0E0E0', true: '#FF6B00' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity style={styles.settingCard}>
          <View>
            <Text style={styles.settingLabel}>Display Currency</Text>
            <Text style={styles.settingValue}>{currency}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Data Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.settingCard} onPress={handleClearCache}>
          <Text style={styles.settingLabel}>Clear Cache</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard} onPress={handleExportData}>
          <Text style={styles.settingLabel}>Export Data</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Security Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        <TouchableOpacity style={styles.settingCard}>
          <Text style={styles.settingLabel}>Change PIN</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Text style={styles.settingLabel}>Recovery Phrase</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Text style={styles.settingLabel}>Privacy Policy</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>

        <TouchableOpacity style={styles.settingCard}>
          <Text style={styles.settingLabel}>Terms of Service</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard}>
          <Text style={styles.settingLabel}>Support</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>RNS Portfolio App v1.0.0</Text>
        <Text style={styles.footerSubtext}>Built for Rootstock</Text>
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
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#999',
  },
  checkmark: {
    fontSize: 20,
    color: '#34C759',
    fontWeight: 'bold',
  },
  activeNetwork: {
    backgroundColor: '#F0FFF4',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});
