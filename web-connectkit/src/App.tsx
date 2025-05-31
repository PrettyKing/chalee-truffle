import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 根据环境自动导入配置
import { config as localConfig } from "./wagmi.local";
import { config as prodConfig } from "./wagmi.prod";

import RedPacketApp from "./components/RedPacketApp";

const queryClient = new QueryClient();

// 根据环境选择配置
const config = import.meta.env.MODE === 'local' ? localConfig : prodConfig;

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="App">
            <RedPacketApp />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
