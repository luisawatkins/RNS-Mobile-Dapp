import { ethers } from 'ethers';

export class RNSService {
    private provider: ethers.providers.JsonRpcProvider;
    private registry: ethers.Contract;
    private resolverAbi = [
      'function addr(bytes32 node) view returns (address)'
    ];
    private registryAbi = [
      'function resolver(bytes32 node) view returns (address)',
      'function owner(bytes32 node) view returns (address)'
    ];
    private zero = '0x0000000000000000000000000000000000000000';
    private registryAddress: string;
    
    constructor(providerUrl: string) {
      this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
      const envRegistry = process.env.RNS_REGISTRY_ADDRESS;
      this.registryAddress = envRegistry || '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5';
      this.registry = new ethers.Contract(this.registryAddress, this.registryAbi, this.provider);
    }
    private namehash(name: string): string {
      let node = '0x' + '00'.repeat(32);
      if (name) {
        const parts = name.toLowerCase().split('.');
        for (let i = parts.length - 1; i >= 0; i--) {
          const labelHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(parts[i]));
          node = ethers.utils.keccak256(ethers.utils.concat([node, labelHash]));
        }
      }
      return node;
    }
    /**
     * Resolve an RNS domain to an address
     */
    async resolveDomain(domain: string): Promise<string | null> {
      try {
        const full = domain.endsWith('.rsk') ? domain : `${domain}.rsk`;
        const node = this.namehash(full);
        const resolverAddr: string = await this.registry.resolver(node);
        if (!resolverAddr || resolverAddr.toLowerCase() === this.zero) return null;
        const resolver = new ethers.Contract(resolverAddr, this.resolverAbi, this.provider);
        const addr: string = await resolver.addr(node);
        return addr && addr.toLowerCase() !== this.zero ? addr : null;
      } catch (error) {
        console.error('Error resolving domain:', error);
        return null;
      }
    }
    /**
     * Reverse lookup: get domain from address
     */
    async reverseLookup(address: string): Promise<string | null> {
      try {
        return null;
      } catch (error) {
        console.error('Error in reverse lookup:', error);
        return null;
      }
    }
    /**
     * Check if a domain is available for registration
     */
    async checkAvailability(domain: string): Promise<boolean> {
      try {
        return false;
      } catch (error) {
        console.error('Error checking availability:', error);
        return false;
      }
    }
    /**
     * Get the owner of a domain
     */
    async getOwner(domain: string): Promise<string | null> {
      try {
        const full = domain.endsWith('.rsk') ? domain : `${domain}.rsk`;
        const node = this.namehash(full);
        const owner: string = await this.registry.owner(node);
        return owner && owner.toLowerCase() !== this.zero ? owner : null;
      } catch (error) {
        console.error('Error getting owner:', error);
        return null;
      }
    }

    /**
     * Register a new domain
     */
    async registerDomain(domain: string, duration: number = 1): Promise<string> {
      try {
        const fullDomain = domain.endsWith('.rsk') ? domain : `${domain}.rsk`;
        // In production, this would interact with the RNS registrar contract
        console.log(`Registering domain ${fullDomain} for ${duration} year(s)`);
        return `0x${Math.random().toString(16).substring(2, 66)}`; // Mock tx hash
      } catch (error) {
        console.error('Error registering domain:', error);
        throw error;
      }
    }

    /**
     * Set resolver for a domain
     */
    async setResolver(domain: string, resolverAddress: string): Promise<string> {
      try {
        const fullDomain = domain.endsWith('.rsk') ? domain : `${domain}.rsk`;
        // In production, this would interact with the RNS registry contract
        console.log(`Setting resolver for ${fullDomain} to ${resolverAddress}`);
        return `0x${Math.random().toString(16).substring(2, 66)}`; // Mock tx hash
      } catch (error) {
        console.error('Error setting resolver:', error);
        throw error;
      }
    }

    /**
     * Renew a domain
     */
    async renewDomain(domain: string, duration: number = 1): Promise<string> {
      try {
        const fullDomain = domain.endsWith('.rsk') ? domain : `${domain}.rsk`;
        // In production, this would interact with the RNS renewal contract
        console.log(`Renewing domain ${fullDomain} for ${duration} year(s)`);
        return `0x${Math.random().toString(16).substring(2, 66)}`; // Mock tx hash
      } catch (error) {
        console.error('Error renewing domain:', error);
        throw error;
      }
    }

    /**
     * Get domains owned by an address
     */
    async getUserDomains(address: string): Promise<string[]> {
      try {
        // In production, this would query The Graph or RNS contracts
        // Mock implementation returns sample domains
        return ['user.rsk', 'wallet.rsk', 'portfolio.rsk'];
      } catch (error) {
        console.error('Error getting user domains:', error);
        return [];
      }
    }

    /**
     * Batch resolve multiple domains
     */
    async batchResolve(domains: string[]): Promise<Map<string, string | null>> {
      const results = new Map<string, string | null>();
      
      await Promise.all(
        domains.map(async (domain) => {
          const address = await this.resolveDomain(domain);
          results.set(domain, address);
        })
      );
      
      return results;
    }

    /**
     * Get domain metadata
     */
    async getDomainMetadata(domain: string): Promise<any> {
      try {
        const fullDomain = domain.endsWith('.rsk') ? domain : `${domain}.rsk`;
        // In production, query from RNS contracts
        return {
          domain: fullDomain,
          owner: await this.getOwner(fullDomain),
          resolver: await this.resolveDomain(fullDomain),
          expiry: Date.now() + 365 * 24 * 60 * 60 * 1000, // Mock: 1 year from now
          registeredAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // Mock: 30 days ago
        };
      } catch (error) {
        console.error('Error getting domain metadata:', error);
        return null;
      }
    }
  }
  