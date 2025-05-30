
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    goerli,
    sepolia,
} from "wagmi/chains";

const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, goerli, sepolia],
    [
        alchemyProvider({ apiKey: import.meta.env.VITE_REACT_APP_ALCHEMY_ID }),
        publicProvider(),
    ]
);

const { connectors } = getDefaultWallets({
    appName: "红包DApp",
    projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID || "YOUR_PROJECT_ID",
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});
