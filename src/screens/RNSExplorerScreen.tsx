import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRNS } from '../hooks/useRNS';
import { useAccount } from 'wagmi';

export const RNSExplorerScreen: React.FC = () => {
  const { address } = useAccount();
  const { 
    checkAvailability, 
    registerDomain, 
    resolveRNSToAddress,
    getUserDomains,
    renewDomain,
    setResolver
  } = useRNS();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [userDomains, setUserDomains] = useState<string[]>([]);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);

  React.useEffect(() => {
    loadUserDomains();
  }, [address]);

  const loadUserDomains = async () => {
    if (address) {
      const domains = await getUserDomains(address);
      setUserDomains(domains);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    setLoading(true);
    try {
      // Check availability
      const available = await checkAvailability(searchQuery);
      setIsAvailable(available);
      
      // If not available, resolve to address
      if (!available) {
        const addr = await resolveRNSToAddress(searchQuery);
        setResolvedAddress(addr);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search domain');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!searchQuery || !isAvailable) return;
    
    setLoading(true);
    try {
      await registerDomain(searchQuery);
      Alert.alert('Success', 'Domain registered successfully!');
      await loadUserDomains();
      setSearchQuery('');
      setIsAvailable(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to register domain');
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (domain: string) => {
    try {
      await renewDomain(domain);
      Alert.alert('Success', 'Domain renewed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to renew domain');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchSection}>
        <Text style={styles.title}>RNS Explorer</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a .rsk domain"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        {isAvailable !== null && (
          <View style={styles.resultCard}>
            {isAvailable ? (
              <>
                <Text style={styles.availableText}>✓ {searchQuery}.rsk is available!</Text>
                <TouchableOpacity 
                  style={styles.registerButton}
                  onPress={handleRegister}
                >
                  <Text style={styles.registerButtonText}>Register Domain</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.unavailableText}>✗ {searchQuery}.rsk is taken</Text>
                {resolvedAddress && (
                  <Text style={styles.resolvedAddress}>
                    Resolves to: {resolvedAddress.substring(0, 10)}...
                  </Text>
                )}
              </>
            )}
          </View>
        )}
      </View>

      <View style={styles.domainsSection}>
        <Text style={styles.sectionTitle}>Your Domains</Text>
        
        {userDomains.length === 0 ? (
          <Text style={styles.noDomains}>No domains registered</Text>
        ) : (
          userDomains.map((domain, index) => (
            <View key={index} style={styles.domainCard}>
              <View>
                <Text style={styles.domainName}>{domain}</Text>
                <Text style={styles.domainStatus}>Active</Text>
              </View>
              <View style={styles.domainActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleRenew(domain)}
                >
                  <Text style={styles.actionButtonText}>Renew</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setResolver(domain, address!)}
                >
                  <Text style={styles.actionButtonText}>Set Resolver</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  resultCard: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginTop: 10,
  },
  availableText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  unavailableText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  resolvedAddress: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  registerButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  domainsSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  noDomains: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
  },
  domainCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 10,
  },
  domainName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  domainStatus: {
    fontSize: 12,
    color: '#34C759',
    marginTop: 4,
  },
  domainActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B00',
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#FF6B00',
    fontSize: 12,
    fontWeight: '600',
  },
});
