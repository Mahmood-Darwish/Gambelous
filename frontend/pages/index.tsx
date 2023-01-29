import Head from "next/head"
import { Inter } from "@next/font/google"
import { useEffect } from "react"
import Header from "../components/Header"
import Menu from "../components/Menu"
import Table from "../components/Table"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { useSessionStorage } from "@/hooks/useSessionStorage"

const inter = Inter({ subsets: ["latin"] })

const supportedChains = ["31337", "5"]

export enum GameType {
    BlackOrRed,
    Suit,
    Card,
    None,
}

export enum GameState {
    Playing,
    NotPlaying,
    Loading,
}

export default function Home() {
    const [playing, setPlaying] = useSessionStorage<GameState>(
        "Gambelous_playingState",
        GameState.NotPlaying
    )
    const [gameType, setGameType] = useSessionStorage<GameType>(
        "Gambelous_gameTypeState",
        GameType.None
    )
    const [bet, setBet] = useSessionStorage<number>("Gambelous_betState", 0)
    const [guess, setGuess] = useSessionStorage<number>(
        "Gambelous_guessState",
        0
    )
    const [chosenCardIndex, setChosenCardIndex] = useSessionStorage<number>(
        "Gambelous_chosenCardIndexState",
        -1
    )

    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()
    const { chain, chains } = useNetwork()

    return (
        <div>
            <Head>
                <title>Gambelous</title>
                <meta name="Gambelous" content="Smart contract gambling game" />
                <link rel="icon" href="/icon.png" />
            </Head>
            <Header />
            {isConnected ? (
                <div>
                    {supportedChains.includes(
                        (chain?.id === undefined ? "" : chain?.id).toString()
                    ) ? (
                        <div>
                            <Table
                                playing={playing}
                                setPlaying={setPlaying}
                                gameType={gameType}
                                bet={bet}
                                guess={guess}
                                chosenCardIndex={chosenCardIndex}
                                setChosenCardIndex={setChosenCardIndex}
                            />
                            <Menu
                                playing={playing}
                                setPlaying={setPlaying}
                                setGameType={setGameType}
                                setBet={setBet}
                                setGuess={setGuess}
                                setChosenCardIndex={setChosenCardIndex}
                            />
                        </div>
                    ) : (
                        <div
                            style={{ marginLeft: "1.0rem" }}
                        >{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
                    )}
                </div>
            ) : (
                <div style={{ marginLeft: "1.0rem" }}>
                    <p>Please connect to a Wallet</p>
                </div>
            )}
            <footer className="footer">
                <a href="https://github.com/Mahmood-Darwish/Gambelous">
                    {" "}
                    GitHub{" "}
                </a>{" "}
                repo of the project.{" "}
            </footer>
        </div>
    )
}
