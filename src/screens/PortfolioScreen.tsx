import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAccount } from 'wagmi';

const { width } = Dimensions.get('window');

export const PortfolioScreen: React.FC = () => {
  const { address } = useAccount();
  const { 
    balances, 
    nativeBalance, 
    transactions, 
    loading, 
    refresh,
    totalValueUSD 
  } = usePortfolio();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | '1Y'>('1W');

  // Mock chart data - in production, this would come from The Graph
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [2000, 2100, 2050, 2200, 2180, 2300, 2450],
      strokeWidth: 2,
    }],
  };

  const calculateChange = () => {
    const lastValue = chartData.datasets[0].data[chartData.datasets[0].data.length - 1];
    const firstValue = chartData.datasets[0].data[0];
    const change = ((lastValue - firstValue) / firstValue) * 100;
    return change.toFixed(2);
  };

  const renderAssetItem = (asset: any, index: number) => {
    const changePercent = (Math.random() * 10 - 5).toFixed(2); // Mock change
    const isPositive = parseFloat(changePercent) > 0;

    return (
      <TouchableOpacity key={index} style={styles.assetCard}>
        <View style={styles.assetInfo}>
          <View style={styles.assetIcon}>
            <Text style={styles.assetSymbolIcon}>
              {asset.symbol?.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.assetName}>{asset.name || asset.symbol}</Text>
            <Text style={styles.assetBalance}>
              {parseFloat(asset.balance).toFixed(4)} {asset.symbol}
            </Text>
          </View>
        </View>
        <View style={styles.assetValue}>
          <Text style={styles.assetUSD}>
            ${asset.valueUSD?.toFixed(2) || '0.00'}
          </Text>
          <Text style={[
            styles.assetChange,
            isPositive ? styles.positive : styles.negative
          ]}>
            {isPositive ? '+' : ''}{changePercent}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Portfolio</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={styles.totalValue}>
            ${totalValueUSD?.toFixed(2) || '0.00'}
          </Text>
          <View style={styles.changeContainer}>
            <Text style={[
              styles.changeText,
              parseFloat(calculateChange()) > 0 ? styles.positive : styles.negative
            ]}>
              {parseFloat(calculateChange()) > 0 ? '↑' : '↓'} {calculateChange()}% This Week
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chartSection}>
        <View style={styles.periodSelector}>
          {(['1D', '1W', '1M', '1Y'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <LineChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#FF6B00',
            },
          }}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
        />
      </View>

      <View style={styles.assetsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assets</Text>
          <Text style={styles.sectionSubtitle}>
            {balances.length + 1} tokens
          </Text>
        </View>

        {/* Native RBTC */}
        <TouchableOpacity style={styles.assetCard}>
          <View style={styles.assetInfo}>
            <View style={[styles.assetIcon, styles.rbtcIcon]}>
              <Text style={styles.assetSymbolIcon}>RB</Text>
            </View>
            <View>
              <Text style={styles.assetName}>Rootstock Bitcoin</Text>
              <Text style={styles.assetBalance}>
                {parseFloat(nativeBalance).toFixed(6)} RBTC
              </Text>
            </View>
          </View>
          <View style={styles.assetValue}>
            <Text style={styles.assetUSD}>
              ${(parseFloat(nativeBalance) * 30000).toFixed(2)}
            </Text>
            <Text style={styles.positive}>+2.45%</Text>
          </View>
        </TouchableOpacity>

        {/* Token Balances */}
        {balances.map((asset, index) => renderAssetItem(asset, index))}
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {transactions.slice(0, 5).map((tx, index) => (
          <View key={index} style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Text>{tx.from === address ? '↑' : '↓'}</Text>
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityType}>
                {tx.from === address ? 'Sent' : 'Received'}
              </Text>
              <Text style={styles.activityTime}>
                {new Date(tx.timestamp * 1000).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.activityAmount}>
              {tx.value} {tx.symbol || 'RBTC'}
            </Text>
          </View>
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
  balanceContainer: {
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#FF3B30',
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  periodButtonActive: {
    backgroundColor: '#FF6B00',
  },
  periodText: {
    color: '#666',
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  assetsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  assetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rbtcIcon: {
    backgroundColor: '#FF6B00',
  },
  assetSymbolIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  assetBalance: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  assetValue: {
    alignItems: 'flex-end',
  },
  assetUSD: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  assetChange: {
    fontSize: 14,
    marginTop: 2,
  },
  activitySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
