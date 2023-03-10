import type { AppProps } from "next/app"
import { WagmiConfig, createClient, configureChains, goerli } from "wagmi"
import { hardhat } from "wagmi/chains"

import { publicProvider } from "wagmi/providers/public"
import "../css/styles.css"

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import dynamic from "next/dynamic"
import { NotificationProvider } from "web3uikit"

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
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </WagmiConfig>
    )
}

export default dynamic(() => Promise.resolve(App), {
    ssr: false,
})
