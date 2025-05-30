import "@rainbow-me/rainbowkit/styles.css";
import {  RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {  WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import RedPacketApp from "./components/RedPacketApp";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          <RedPacketApp />
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
