import { useState, useEffect } from 'react';
import { RNSService } from '../services/rnsService';

// Use environment variable or default to public testnet
const RPC_URL = process.env.ROOTSTOCK_RPC_URL || 'https://public-node.testnet.rsk.co';
export const useRNS = () => {
  const [rnsService, setRnsService] = useState<RNSService | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const service = new RNSService(RPC_URL);
    setRnsService(service);
  }, []);
  const resolveDomain = async (domain: string): Promise<string | null> => {
    if (!rnsService) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const address = await rnsService.resolveDomain(domain);
      return address;
    } catch (err) {
      setError('Failed to resolve domain');
      return null;
    } finally {
      setLoading(false);
    }
  };
  const lookupAddress = async (address: string): Promise<string | null> => {
    if (!rnsService) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const domain = await rnsService.reverseLookup(address);
      return domain;
    } catch (err) {
      setError('Failed to lookup address');
      return null;
    } finally {
      setLoading(false);
    }
  };
  const checkAvailability = async (domain: string): Promise<boolean> => {
    if (!rnsService) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const available = await rnsService.checkAvailability(domain);
      return available;
    } catch (err) {
      setError('Failed to check availability');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const registerDomain = async (domain: string, duration?: number): Promise<string> => {
    if (!rnsService) throw new Error('RNS service not initialized');
    
    setLoading(true);
    setError(null);
    
    try {
      const txHash = await rnsService.registerDomain(domain, duration);
      return txHash;
    } catch (err) {
      setError('Failed to register domain');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const setResolver = async (domain: string, resolverAddress: string): Promise<string> => {
    if (!rnsService) throw new Error('RNS service not initialized');
    
    setLoading(true);
    setError(null);
    
    try {
      const txHash = await rnsService.setResolver(domain, resolverAddress);
      return txHash;
    } catch (err) {
      setError('Failed to set resolver');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const renewDomain = async (domain: string, duration?: number): Promise<string> => {
    if (!rnsService) throw new Error('RNS service not initialized');
    
    setLoading(true);
    setError(null);
    
    try {
      const txHash = await rnsService.renewDomain(domain, duration);
      return txHash;
    } catch (err) {
      setError('Failed to renew domain');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getUserDomains = async (address: string): Promise<string[]> => {
    if (!rnsService) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const domains = await rnsService.getUserDomains(address);
      return domains;
    } catch (err) {
      setError('Failed to get user domains');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const batchResolve = async (domains: string[]): Promise<Map<string, string | null>> => {
    if (!rnsService) return new Map();
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await rnsService.batchResolve(domains);
      return results;
    } catch (err) {
      setError('Failed to batch resolve');
      return new Map();
    } finally {
      setLoading(false);
    }
  };
  
  const getDomainMetadata = async (domain: string): Promise<any> => {
    if (!rnsService) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const metadata = await rnsService.getDomainMetadata(domain);
      return metadata;
    } catch (err) {
      setError('Failed to get domain metadata');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    // Original methods
    resolveDomain,
    lookupAddress,
    
    // Aliased for compatibility
    resolveRNSToAddress: resolveDomain,
    
    // New methods
    checkAvailability,
    registerDomain,
    setResolver,
    renewDomain,
    getUserDomains,
    batchResolve,
    getDomainMetadata,
    
    // Status
    loading,
    error,
  };
};