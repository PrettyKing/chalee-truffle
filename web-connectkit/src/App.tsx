import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 根据环境导入配置
import { config as localConfig } from "./wagmi.local";
import { config as prodConfig } from "./wagmi.prod";

import RedPacketApp from "./components/RedPacketApp";
import StyleTest from "./components/StyleTest";

const queryClient = new QueryClient();

// 根据环境选择配置
const config = import.meta.env.PROD ? prodConfig : localConfig;

// 临时启用样式测试模式 - 设为 false 恢复正常应用
const ENABLE_STYLE_TEST = true;

function App() {
  // 如果启用测试模式，直接显示样式测试
  if (ENABLE_STYLE_TEST) {
    return <StyleTest />;
  }

  // 正常应用
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
