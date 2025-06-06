import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  goerli,
  sepolia,
  polygonMumbai,
  bsc,
  bscTestnet,
} from 'wagmi/chains';
import { defineChain } from 'viem';

// 本地开发网络配置
const localhost = defineChain({
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
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
});

// 根据环境变量决定是否包含测试网
const includeTestnets = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true';

// 配置支持的链
const supportedChains = [
  localhost, // 添加本地网络
  mainnet,
  polygon,
  bsc,
  ...(includeTestnets ? [goerli, sepolia, polygonMumbai, bscTestnet] : []),
];

// Wagmi 配置
export const config = getDefaultConfig({
  appName: 'Red Packet DApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: supportedChains as any,
  ssr: true,
});

// 导出链信息供其他组件使用
export const chains = supportedChains;

// 网络配置信息
export const networkConfig = {
  [localhost.id]: {
    name: 'Localhost',
    color: '#f39c12',
    explorerUrl: '',
  },
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    color: '#627EEA',
    explorerUrl: 'https://etherscan.io',
  },
  [polygon.id]: {
    name: 'Polygon',
    color: '#8247E5',
    explorerUrl: 'https://polygonscan.com',
  },
  [bsc.id]: {
    name: 'BSC',
    color: '#F3BA2F',
    explorerUrl: 'https://bscscan.com',
  },
  [goerli.id]: {
    name: 'Goerli Testnet',
    color: '#627EEA',
    explorerUrl: 'https://goerli.etherscan.io',
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    color: '#627EEA',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
  [polygonMumbai.id]: {
    name: 'Mumbai Testnet',
    color: '#8247E5',
    explorerUrl: 'https://mumbai.polygonscan.com',
  },
  [bscTestnet.id]: {
    name: 'BSC Testnet',
    color: '#F3BA2F',
    explorerUrl: 'https://testnet.bscscan.com',
  },
};
