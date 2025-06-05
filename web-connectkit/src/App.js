import 'connectkit/styles.css';
import {
  ConnectKitProvider,
  getDefaultConfig,
} from 'connectkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  sepolia,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RedPacketApp from './components/RedPacketApp';

// 自定义 localhost 配置，使用端口 7545
const localhost = {
  id: 1337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:7545'],
    },
    public: {
      http: ['http://127.0.0.1:7545'],
    },
  },
};

const config = createConfig(
  getDefaultConfig({
    // 您的 dApp 信息
    appName: 'Chalee DApp - 红包应用',
    appDescription: '基于以太坊的去中心化红包应用',
    appUrl: 'https://family.co',
    appIcon: 'https://family.co/logo.png',
    
    // WalletConnect 项目ID
    walletConnectProjectId: process.env.REACT_APP_PROJECT_ID || 'YOUR_PROJECT_ID',
    
    // 链配置
    chains: [
      mainnet, 
      polygon, 
      optimism, 
      arbitrum, 
      goerli, 
      sepolia,
      localhost,
    ],
    
    // Transports 配置 (替代 providers)
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [optimism.id]: http(),
      [arbitrum.id]: http(),
      [goerli.id]: http(),
      [sepolia.id]: http(),
      [localhost.id]: http(),
    },
  })
);

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="auto"
          mode="light"
          options={{
            initialChainId: 0,
            // 主题自定义
            customTheme: {
              '--ck-connectbutton-font-size': '16px',
              '--ck-connectbutton-border-radius': '12px',
              '--ck-connectbutton-color': '#373737',
              '--ck-connectbutton-background': '#ffffff',
              '--ck-connectbutton-box-shadow': '0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 6px -1px rgba(0, 0, 0, 0.10)',
            }
          }}
        >
          <RedPacketApp />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;