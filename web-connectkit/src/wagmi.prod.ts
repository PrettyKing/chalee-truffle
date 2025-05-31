import { createConfig } from 'wagmi'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains'
import { http } from 'viem'

const chains = [mainnet, polygon, optimism, arbitrum, sepolia] as const

const { connectors } = getDefaultWallets({
  appName: "红包DApp",
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID || "YOUR_PROJECT_ID",
  // @ts-ignore
  chains,
})

export const config = createConfig({
  // @ts-ignore
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(
      import.meta.env.VITE_REACT_APP_ALCHEMY_ID
        ? `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_ID}`
        : undefined
    ),
    [polygon.id]: http(
      import.meta.env.VITE_REACT_APP_ALCHEMY_ID
        ? `https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_ID}`
        : undefined
    ),
    [optimism.id]: http(
      import.meta.env.VITE_REACT_APP_ALCHEMY_ID
        ? `https://opt-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_ID}`
        : undefined
    ),
    [arbitrum.id]: http(
      import.meta.env.VITE_REACT_APP_ALCHEMY_ID
        ? `https://arb-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_ID}`
        : undefined
    ),
    [sepolia.id]: http(
      import.meta.env.VITE_REACT_APP_ALCHEMY_ID
        ? `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_ID}`
        : undefined
    ),
  },
})
