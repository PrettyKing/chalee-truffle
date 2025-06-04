import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  sepolia,
  localhost,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RedPacketApp from './components/RedPacketApp';

const config = getDefaultConfig({
  appName: 'Chalee DApp - 红包应用',
  projectId: process.env.REACT_APP_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [
    mainnet, 
    polygon, 
    optimism, 
    arbitrum, 
    goerli, 
    sepolia,
    localhost,
  ],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <RedPacketApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;