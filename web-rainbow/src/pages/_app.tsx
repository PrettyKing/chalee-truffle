import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  getDefaultConfig,
  Theme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { mainnet, polygon, goerli, sepolia, polygonMumbai } from "wagmi/chains";

// 自定义主题
const customTheme: Theme = {
  ...lightTheme(),
  colors: {
    ...lightTheme().colors,
    accentColor: "#667eea",
    accentColorForeground: "white",
    actionButtonBorder: "rgba(255, 255, 255, 0.04)",
    actionButtonBorderMobile: "rgba(255, 255, 255, 0.08)",
    actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.08)",
    closeButton: "rgba(224, 232, 255, 0.6)",
    closeButtonBackground: "rgba(255, 255, 255, 0.08)",
    connectButtonBackground: "linear-gradient(135deg, #667eea, #764ba2)",
    connectButtonBackgroundError: "#FF494A",
    connectButtonInnerBackground: "linear-gradient(135deg, #667eea, #764ba2)",
    connectButtonText: "#FFFFFF",
    connectButtonTextError: "#FFFFFF",
    connectionIndicator: "#30E000",
    downloadBottomCardBackground:
      "linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #1A1B1F",
    downloadTopCardBackground:
      "linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #1A1B1F",
    error: "#FF494A",
    generalBorder: "rgba(255, 255, 255, 0.08)",
    generalBorderDim: "rgba(255, 255, 255, 0.05)",
    menuItemBackground: "rgba(224, 232, 255, 0.1)",
    modalBackdrop: "rgba(0, 0, 0, 0.3)",
    modalBackground: "#FFFFFF",
    modalBorder: "rgba(255, 255, 255, 0.08)",
    modalText: "#000000",
    modalTextDim: "rgba(60, 66, 66, 0.8)",
    modalTextSecondary: "rgba(51, 51, 51, 0.6)",
    profileAction: "#FFFFFF",
    profileActionHover: "rgba(255, 255, 255, 0.9)",
    profileForeground: "#FFFFFF",
    selectedOptionBorder: "rgba(224, 232, 255, 0.1)",
    standby: "#FFD641",
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei"',
  },
  radii: {
    actionButton: "8px",
    connectButton: "8px",
    menuButton: "8px",
    modal: "12px",
    modalMobile: "12px",
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
    profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
    selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.12)",
    walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)",
  },
};

// Wagmi 配置
const config = getDefaultConfig({
  appName: "Red Packet DApp",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id",
  chains: [
    mainnet,
    polygon,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [goerli, sepolia, polygonMumbai]
      : []),
  ],
  ssr: true,
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={customTheme}
          appInfo={{
            appName: "Red Packet DApp",
            learnMoreUrl: "https://github.com/PrettyKing/chalee-truffle",
          }}
          modalSize="compact"
          initialChain={
            process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
              ? goerli
              : mainnet
          }
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
