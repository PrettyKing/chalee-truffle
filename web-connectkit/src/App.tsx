import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 根据环境导入配置
import { config as localConfig } from "./wagmi.local";
import { config as prodConfig } from "./wagmi.prod";

import RedPacketApp from "./components/RedPacketApp";

const queryClient = new QueryClient();

// 根据环境选择配置
const config = import.meta.env.PROD ? prodConfig : localConfig;

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
