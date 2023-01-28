import Head from "next/head"
import { Inter } from "@next/font/google"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import Menu from "../components/Menu"
import Table from "../components/Table"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"

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

const initializeState = (key: string, defaultValue: any) => {
    if (
        sessionStorage.getItem(key) !== null &&
        sessionStorage.getItem(key) !== ""
    ) {
        return JSON.parse(sessionStorage.getItem(key) as string)
    }
    sessionStorage.setItem(key, JSON.stringify(defaultValue))
    return defaultValue
}

export default function Home() {
    const [playing, setPlaying] = useState<GameState>(
        parseInt(initializeState("playingState", GameState.NotPlaying))
    )
    const [gameType, setGameType] = useState<GameType>(
        parseInt(initializeState("gameTypeState", GameType.None))
    )
    const [bet, setBet] = useState<number>(
        parseInt(initializeState("betState", 0))
    )
    const [guess, setGuess] = useState<number>(
        parseInt(initializeState("guessState", 0))
    )
    const [chosenCardIndex, setChosenCardIndex] = useState<number>(
        parseInt(initializeState("chosenCardIndexState", -1))
    )

    useEffect(() => {
        setPlaying(
            parseInt(initializeState("playingState", GameState.NotPlaying))
        )
        setGameType(parseInt(initializeState("gameTypeState", GameType.None)))
        setBet(parseInt(initializeState("betState", 0)))
        setGuess(parseInt(initializeState("guessState", 0)))
        setChosenCardIndex(
            parseInt(initializeState("chosenCardIndexState", -1))
        )
    }, [])

    useEffect(() => {
        window.sessionStorage.setItem("playingState", JSON.stringify(playing))
        window.sessionStorage.setItem("gameTypeState", JSON.stringify(gameType))
        window.sessionStorage.setItem("betState", JSON.stringify(bet))
        window.sessionStorage.setItem("guessState", JSON.stringify(guess))
        window.sessionStorage.setItem(
            "chosenCardIndexState",
            JSON.stringify(chosenCardIndex)
        )
    }, [playing, gameType, bet, guess, chosenCardIndex])

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
        </div>
    )
}
