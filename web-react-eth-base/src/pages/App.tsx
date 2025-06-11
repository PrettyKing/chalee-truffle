import './rainbowkit.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia, mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { useState } from 'react';
import { ContractsLog } from './ContractsLog';
import { Transaction } from './Transaction';
import { DataHistory } from './DataHistory';

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [sepolia, mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
const App = () => {
  const [activeTab, setActiveTab] = useState('transaction');

  const renderContent = () => {
    switch (activeTab) {
      case 'transaction':
        return <Transaction />;
      case 'contractsLog':
        return <ContractsLog />;
      case 'dataHistory':
        return <DataHistory />;
      default:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-4">Welcome to the React Ethereum Base App</h1>
            <p className="text-gray-700">
              This is a simple starting point for building Ethereum-based applications with React.
            </p>
          </div>
        );
    }
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="bg-gray-50">
            <main className="py-8">{renderContent()}</main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
export default App;
