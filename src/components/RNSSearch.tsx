import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRNS } from '../hooks/useRNS';

export const RNSSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const { resolveDomain, loading, error } = useRNS();
    const handleSearch = async () => {
      if (!searchTerm.trim()) return;
      
      const address = await resolveDomain(searchTerm);
      setResult(address);
    };
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Resolve RNS Domain</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter domain (e.g., alice.rsk)"
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
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
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Address:</Text>
            <Text style={styles.resultText}>{result}</Text>
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
    label: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 12,
    },
    searchContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    input: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 10,
      paddingHorizontal: 16,
      fontSize: 16,
      backgroundColor: '#F9F9F9',
    },
    searchButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 20,
      borderRadius: 10,
      justifyContent: 'center',
    },
    searchButtonDisabled: {
      opacity: 0.6,
    },
    searchButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 16,
    },
    errorText: {
      color: '#FF3B30',
      marginTop: 10,
      fontSize: 14,
    },
    resultContainer: {
      marginTop: 16,
      padding: 12,
      backgroundColor: '#F0F9FF',
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#007AFF',
    },
    resultLabel: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
    },
    resultText: {
      fontSize: 14,
      fontFamily: 'monospace',
      color: '#1A1A1A',
    },
  });