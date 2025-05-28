import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { Chain, configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  sepolia,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RedPacketApp from './components/RedPacketApp';


// 本地开发
const localChain:Chain = {
  id: 1337,
  name: 'Localhost',
  rpcUrls: {
    default: { http: ['http://localhost:7545'] },
    public: { http: ['http://localhost:7545'] },
  },
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorers: {
    default: { name: 'Localhost', url: 'http://localhost:7545' },
  },
  testnet: true,
  network: 'localhost',
};


const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, goerli, sepolia, localChain],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_REACT_APP_ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: '红包DApp',
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          <RedPacketApp />
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;