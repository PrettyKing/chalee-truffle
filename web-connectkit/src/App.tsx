import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 根据环境自动导入配置
const isProduction = import.meta.env.PROD;
const config = await (isProduction 
  ? import("./wagmi.prod").then(m => m.config)
  : import("./wagmi.local").then(m => m.config)
);

import RedPacketApp from "./components/RedPacketApp";

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
