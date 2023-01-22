import Head from "next/head"
import Image from "next/image"
import { Inter } from "@next/font/google"
import styles from "@/styles/Home.module.css"
import Header from "../components/Header"
import Table from "../components/Table"
import Menu from "../components/Menu"
import { Dispatch, SetStateAction, useState } from "react"
import { getUnpackedSettings } from "http2"

const inter = Inter({ subsets: ["latin"] })

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
    )
}
