import Head from "next/head"
import { Inter } from "@next/font/google"
import styles from "@/styles/Home.module.css"
import Header from "../components/Header"
import Table from "../components/Table"
import Menu from "../components/Menu"
import { useMoralis } from "react-moralis"
import { useState } from "react"

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
    const [playing, setPlaying] = useState<GameState>(GameState.NotPlaying)
    const [gameType, setGameType] = useState<GameType>(GameType.None)
    const [bet, setBet] = useState<number>(0)
    const [guess, setGuess] = useState<number>(0)
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div>
            <Head>
                <title>Gambling Game</title>
                <meta
                    name="Gambling Game"
                    content="Smart contract gambling game"
                />
                <link rel="icon" href="/icon.png" />
            </Head>
            <Header />
            {isWeb3Enabled ? (
                <div>
                    {supportedChains.includes(
                        parseInt(chainId === null ? "" : chainId).toString()
                    ) ? (
                        <div>
                            <Table
                                playing={playing}
                                setPlaying={setPlaying}
                                gameType={gameType}
                                bet={bet}
                                guess={guess}
                            />
                            <Menu
                                playing={playing}
                                setPlaying={setPlaying}
                                setGameType={setGameType}
                                setBet={setBet}
                                setGuess={setGuess}
                            />
                        </div>
                    ) : (
                        <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
                    )}
                </div>
            ) : (
                <div>Please connect to a Wallet</div>
            )}
        </div>
    )
}
