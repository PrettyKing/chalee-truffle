import 'connectkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';
import {
  ConnectKitProvider,
  getDefaultConfig,
} from 'connectkit';
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit';
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
import { injectedWallet, rainbowWallet, metaMaskWallet, coinbaseWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

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

// 支持的链
const chains = [
  mainnet, 
  polygon, 
  optimism, 
  arbitrum, 
  goerli, 
  sepolia,
  localhost,
];

// RainbowKit 钱包配置
const projectId = process.env.REACT_APP_PROJECT_ID || 'YOUR_PROJECT_ID';

const { wallets } = getDefaultWallets({
  appName: 'Chalee DApp - 现代化红包应用',
  projectId,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: '推荐',
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      metaMaskWallet({ projectId, chains }),
      coinbaseWallet({ chains, appName: 'Chalee DApp' }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
]);

// 配置链和传输（wagmi v2 风格）
const config = createConfig(
  getDefaultConfig({
    // 您的 dApp 信息
    appName: 'Chalee DApp - 现代化红包应用',
    appDescription: '基于以太坊的去中心化红包应用，采用现代化玻璃态设计',
    appUrl: 'https://chalee.family.co',
    appIcon: 'https://family.co/logo.png',
    
    // WalletConnect 项目ID
    walletConnectProjectId: projectId,
    
    // 支持的链
    chains,
    
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
        <RainbowKitProvider 
          chains={chains}
          theme={{
            // 自定义 RainbowKit 主题，与 web-html 样式保持一致
            blurs: {
              modalOverlay: 'blur(20px)',
            },
            colors: {
              accentColor: '#667eea',
              accentColorForeground: '#ffffff',
              actionButtonBorder: 'rgba(255, 255, 255, 0.2)',
              actionButtonBorderMobile: 'rgba(255, 255, 255, 0.2)',
              actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.1)',
              closeButton: '#ffffff',
              closeButtonBackground: 'rgba(255, 255, 255, 0.1)',
              connectButtonBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              connectButtonBackgroundError: '#ff6b6b',
              connectButtonInnerBackground: 'rgba(255, 255, 255, 0.1)',
              connectButtonText: '#ffffff',
              connectButtonTextError: '#ffffff',
              connectionIndicator: '#51cf66',
              downloadBottomCardBackground: 'rgba(255, 255, 255, 0.1)',
              downloadTopCardBackground: 'rgba(255, 255, 255, 0.1)',
              error: '#ff6b6b',
              generalBorder: 'rgba(255, 255, 255, 0.2)',
              generalBorderDim: 'rgba(255, 255, 255, 0.1)',
              menuItemBackground: 'rgba(255, 255, 255, 0.05)',
              modalBackdrop: 'rgba(0, 0, 0, 0.5)',
              modalBackground: 'rgba(255, 255, 255, 0.1)',
              modalBorder: 'rgba(255, 255, 255, 0.2)',
              modalText: '#ffffff',
              modalTextDim: 'rgba(255, 255, 255, 0.7)',
              modalTextSecondary: 'rgba(255, 255, 255, 0.8)',
              profileAction: 'rgba(255, 255, 255, 0.1)',
              profileActionHover: 'rgba(255, 255, 255, 0.2)',
              profileForeground: 'rgba(255, 255, 255, 0.1)',
              selectedOptionBorder: '#667eea',
              standby: '#ffd43b',
            },
            fonts: {
              body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            },
            radii: {
              actionButton: '12px',
              connectButton: '12px',
              menuButton: '12px',
              modal: '20px',
              modalMobile: '20px',
            },
            shadows: {
              connectButton: '0 4px 15px rgba(102, 126, 234, 0.4)',
              dialog: '0 8px 32px rgba(0, 0, 0, 0.3)',
              profileDetailsAction: '0 2px 10px rgba(0, 0, 0, 0.1)',
              selectedOption: '0 4px 15px rgba(102, 126, 234, 0.2)',
              selectedWallet: '0 4px 15px rgba(102, 126, 234, 0.2)',
              walletLogo: '0 2px 10px rgba(0, 0, 0, 0.1)',
            },
          }}
          modalSize="compact"
          showRecentTransactions={true}
        >
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
                '--ck-modal-backdrop-filter': 'blur(20px)',
                '--ck-body-background': 'rgba(255, 255, 255, 0.1)',
                '--ck-body-background-secondary': 'rgba(255, 255, 255, 0.05)',
                '--ck-body-background-tertiary': 'rgba(255, 255, 255, 0.02)',
                '--ck-tertiary-border-radius': '12px',
                '--ck-tertiary-box-shadow': '0 4px 15px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            <RedPacketApp />
          </ConnectKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;