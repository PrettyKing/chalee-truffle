import { createConfig } from 'wagmi'
import { localhost, mainnet, sepolia } from 'wagmi/chains'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { http } from 'viem'

const chains = [localhost, mainnet, sepolia] as const

const { connectors } = getDefaultWallets({
  appName: "红包DApp",
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID || "YOUR_PROJECT_ID",
  chains,
})

export const config = createConfig({
  chains,
  connectors,
  transports: {
    [localhost.id]: http('http://localhost:7545'),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
