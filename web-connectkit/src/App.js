import 'connectkit/styles.css';
import './index.css';
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

// 配置链和传输（wagmi v2 风格）
const config = createConfig(
  getDefaultConfig({
    // 您的 dApp 信息
    appName: 'Chalee DApp - 现代化红包应用',
    appDescription: '基于以太坊的去中心化红包应用，采用现代化玻璃态设计',
    appUrl: 'https://chalee.family.co',
    appIcon: 'https://family.co/logo.png',
    
    // WalletConnect 项目ID
    walletConnectProjectId: process.env.REACT_APP_PROJECT_ID || 'YOUR_PROJECT_ID',
    
    // 支持的链
    chains: [
      mainnet, 
      polygon, 
      optimism, 
      arbitrum, 
      goerli, 
      sepolia,
      localhost,
    ],
    
    // 传输配置
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [optimism.id]: http(),
      [arbitrum.id]: http(),
      [goerli.id]: http(),
      [sepolia.id]: http(),
      [localhost.id]: http(),
    },
    
    // 其他选项
    ssr: false, // 如果使用SSR，设置为true
  })
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="auto"
          mode="light"
          options={{
            initialChainId: 0,
            // 自定义主题样式，与web-html保持一致
            customTheme: {
              '--ck-connectbutton-font-size': '16px',
              '--ck-connectbutton-border-radius': '12px',
              '--ck-connectbutton-color': '#ffffff',
              '--ck-connectbutton-background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '--ck-connectbutton-box-shadow': '0 4px 15px rgba(102, 126, 234, 0.4)',
              '--ck-connectbutton-hover-background': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              '--ck-connectbutton-hover-box-shadow': '0 8px 25px rgba(79, 172, 254, 0.6)',
              '--ck-border-radius': '12px',
              '--ck-primary-button-border-radius': '12px',
              '--ck-font-family': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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