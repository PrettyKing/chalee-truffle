import { createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'
import { defineChain, http } from 'viem'

const ganache = defineChain({
    id: 1337, // Ganache 默认链 ID
    name: 'Ganache',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['http://localhost:7545'], // Ganache 默认 RPC 地址
        },
        public: {
            http: ['http://localhost:7545'], // Ganache 默认 RPC 地址
        },
    },
    blockExplorers: {
        default: { name: 'Ganache', url: 'http://localhost:7545' },
    },
    testnet: true, // Ganache 是一个测试网络
    network: '1337', // Ganache 的网络 ID
})
export const config = createConfig({
    chains: [mainnet, sepolia, ganache],
    connectors: [
        injected(),
        metaMask(),
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        // @ts-ignore
        [localhost.id]: http('http://localhost:7545'),
    },
})