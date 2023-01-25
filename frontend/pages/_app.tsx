import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { WagmiConfig, createClient, configureChains, goerli } from "wagmi"
import { hardhat } from "wagmi/chains"

import { publicProvider } from "wagmi/providers/public"

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import dynamic from "next/dynamic"

const { chains, provider, webSocketProvider } = configureChains(
    [goerli, hardhat],
    [publicProvider()]
)

// Set up client
const client = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: "wagmi",
            },
        }),
        new WalletConnectConnector({
            chains,
            options: {
                qrcode: true,
            },
        }),
        new InjectedConnector({
            chains,
            options: {
                name: "Injected",
                shimDisconnect: true,
            },
        }),
    ],
    provider,
    webSocketProvider,
})

function App({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig client={client}>
            <Component {...pageProps} />
        </WagmiConfig>
    )
}

export default dynamic(() => Promise.resolve(App), {
    ssr: false,
})
