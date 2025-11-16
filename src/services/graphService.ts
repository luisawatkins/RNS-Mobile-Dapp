import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';

// The Graph API endpoint - configure in .env file
const SUBGRAPH_URL = process.env.GRAPH_API_URL || 
  'https://api.thegraph.com/subgraphs/name/rootstock/rns';

const httpLink = createHttpLink({
  uri: SUBGRAPH_URL,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
// Query to get token balances for an address
const GET_TOKEN_BALANCES = gql`
  query GetTokenBalances($address: String!) {
    account(id: $address) {
      id
      balances {
        token {
          id
          symbol
          name
          decimals
        }
        amount
      }
    }
  }
`;
// Query to get recent transactions
const GET_RECENT_TRANSACTIONS = gql`
  query GetRecentTransactions($address: String!, $limit: Int!) {
    transactions(
      where: { from: $address }
      orderBy: timestamp
      orderDirection: desc
      first: $limit
    ) {
      id
      from
      to
      value
      timestamp
      blockNumber
    }
  }
`;
export interface TokenBalance {
  token: {
    id: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  amount: string;
}
export interface Transaction {
  id: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
}
export const graphService = {
  async getTokenBalances(address: string): Promise<TokenBalance[]> {
    try {
      const { data } = await client.query<any>({
        query: GET_TOKEN_BALANCES,
        variables: { address: address.toLowerCase() },
      });
      return data?.account?.balances || [];
    } catch (error) {
      console.error('Error fetching token balances:', error);
      return [];
    }
  },
  async getRecentTransactions(
    address: string,
    limit: number = 10
  ): Promise<Transaction[]> {
    try {
      const { data } = await client.query<any>({
        query: GET_RECENT_TRANSACTIONS,
        variables: { address: address.toLowerCase(), limit },
      });
      return data?.transactions || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },
};
