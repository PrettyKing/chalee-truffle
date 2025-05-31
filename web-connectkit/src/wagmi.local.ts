import { createConfig } from 'wagmi'
import { localhost, mainnet, sepolia } from 'wagmi/chains'
import { http } from 'viem'
import { InjectedConnector } from 'wagmi/connectors/injected'

export const config = createConfig({
  chains: [localhost, mainnet, sepolia] as const,
  connectors: [
    new InjectedConnector({
      chains: [localhost, mainnet, sepolia],
    }),
  ],
  transports: {
    [localhost.id]: http('http://localhost:7545'),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
