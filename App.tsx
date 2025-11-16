import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Web3Provider } from './src/components/Web3Provider';
import { HomeScreen } from './src/screens/HomeScreen';
import { RNSExplorerScreen } from './src/screens/RNSExplorerScreen';
import { PortfolioScreen } from './src/screens/PortfolioScreen';
import { SendScreen } from './src/screens/SendScreen';
import { QRCodeScreen } from './src/screens/QRCodeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <Web3Provider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#FF6B00',
              tabBarInactiveTintColor: '#999',
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopColor: '#E0E0E0',
              },
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Tab.Screen
              name="Dashboard"
              component={HomeScreen}
              options={{
                tabBarLabel: 'Dashboard',
                tabBarIcon: ({ color, size }) => (
                  <Text style={{ color, fontSize: size }}>🏠</Text>
                ),
              }}
            />
            <Tab.Screen
              name="RNS"
              component={RNSExplorerScreen}
              options={{
                tabBarLabel: 'RNS',
                tabBarIcon: ({ color, size }) => (
                  <Text style={{ color, fontSize: size }}>🔍</Text>
                ),
              }}
            />
            <Tab.Screen
              name="Portfolio"
              component={PortfolioScreen}
              options={{
                tabBarLabel: 'Portfolio',
                tabBarIcon: ({ color, size }) => (
                  <Text style={{ color, fontSize: size }}>📊</Text>
                ),
              }}
            />
            <Tab.Screen
              name="Send"
              component={SendScreen}
              options={{
                tabBarLabel: 'Send',
                tabBarIcon: ({ color, size }) => (
                  <Text style={{ color, fontSize: size }}>💸</Text>
                ),
              }}
            />
            <Tab.Screen
              name="QR"
              component={QRCodeScreen}
              options={{
                tabBarLabel: 'QR',
                tabBarIcon: ({ color, size }) => (
                  <Text style={{ color, fontSize: size }}>📱</Text>
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({ color, size }) => (
                  <Text style={{ color, fontSize: size }}>⚙️</Text>
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </Web3Provider>
    </SafeAreaProvider>
  );
}

export default App;