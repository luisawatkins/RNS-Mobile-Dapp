import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { RNSSearch } from '../src/components/RNSSearch';

// Mock the useRNS hook
jest.mock('../src/hooks/useRNS', () => ({
    useRNS: () => ({
      resolveDomain: jest.fn().mockResolvedValue('0x1234...'),
      loading: false,
      error: null,
    }),
  }));
  describe('RNSSearch', () => {
    it('renders search input correctly', () => {
      const { getByPlaceholderText } = render(<RNSSearch />);
      expect(getByPlaceholderText('Enter domain (e.g., alice.rsk)')).toBeTruthy();
    });
    it('displays result after search', async () => {
      const { getByText, getByPlaceholderText } = render(<RNSSearch />);
      const input = getByPlaceholderText('Enter domain (e.g., alice.rsk)');
      const button = getByText('Search');
      fireEvent.changeText(input, 'alice.rsk');
      fireEvent.press(button);
      await waitFor(() => {
        expect(getByText('Address:')).toBeTruthy();
      });
    });
  });