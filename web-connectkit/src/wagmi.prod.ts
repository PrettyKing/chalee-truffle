import { createConfig, http } from 'wagmi'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    sepolia,
} from 'wagmi/chains'

const { connectors } = getDefaultWallets({
    appName: "红包DApp",
    projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID || "YOUR_PROJECT_ID",
})

export const config = createConfig({
    chains: [mainnet, polygon, optimism, arbitrum, sepolia],
    connectors,
    transports: {
        [mainnet.id]: http(`https://eth-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_ID}`),
        [polygon.id]: http(`https://polygon-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_ID}`),
        [optimism.id]: http(`https://opt-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_ID}`),
        [arbitrum.id]: http(`https://arb-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_ID}`),
        [sepolia.id]: http(`https://eth-sepolia.alchemyapi.io/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_ID}`),
    },
})
