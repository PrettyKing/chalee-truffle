import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  goerli,
  sepolia,
  polygonMumbai,
  bsc,
  bscTestnet,
  localhost,
} from 'wagmi/chains';

// 根据环境变量决定是否包含测试网
const includeTestnets = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true';

// 配置支持的链
const supportedChains = [
  mainnet,
  polygon,
  bsc,
  ...(includeTestnets ? [goerli, sepolia, polygonMumbai, bscTestnet, localhost] : []),
];

// Wagmi 配置
export const config = getDefaultConfig({
  appName: 'Red Packet DApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: supportedChains as any,
  ssr: true, // 如果你的应用是服务端渲染
});

// 导出链信息供其他组件使用
export const chains = supportedChains;

// 网络配置信息
export const networkConfig = {
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
  [localhost.id]: {
    name: 'Localhost',
    color: '#FF0000',
    explorerUrl: 'http://localhost:7545',
  },
};