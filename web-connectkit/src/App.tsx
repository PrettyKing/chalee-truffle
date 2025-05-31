import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { localhost, mainnet, sepolia, polygon, optimism, arbitrum } from "wagmi/chains";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import RedPacketApp from "./components/RedPacketApp";

const queryClient = new QueryClient();

// 根据环境选择链
const isLocal = import.meta.env.MODE === 'local';
const chains = isLocal 
  ? [localhost, mainnet, sepolia]
  : [mainnet, polygon, optimism, arbitrum, sepolia];

// 配置链和提供者
const { publicClient } = configureChains(
  // @ts-ignore
  chains,
  [
    ...(isLocal ? [
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id === localhost.id) {
            return {
              http: 'http://localhost:7545',
            };
          }
          return null;
        },
      })
    ] : []),
    ...(import.meta.env.VITE_REACT_APP_ALCHEMY_ID 
      ? [alchemyProvider({ apiKey: import.meta.env.VITE_REACT_APP_ALCHEMY_ID })]
      : []
    ),
    publicProvider(),
  ]
);

// 配置钱包连接器
const { connectors } = getDefaultWallets({
  appName: "红包DApp",
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID || "YOUR_PROJECT_ID",
  chains,
});

// 创建 wagmi 配置
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <div className="App">
            <RedPacketApp />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
