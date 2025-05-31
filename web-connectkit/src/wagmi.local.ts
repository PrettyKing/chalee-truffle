import { createConfig } from 'wagmi'
import { localhost, mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { http } from 'viem'

export const config = createConfig({
  chains: [localhost, mainnet, sepolia] as const,
  connectors: [
    injected(),
  ],
  transports: {
    [localhost.id]: http('http://localhost:7545'),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
