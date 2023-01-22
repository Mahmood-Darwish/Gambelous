import ReactCardFlip from "react-card-flip"
import { cards, back } from "../public/index"
import { GameType, GameState } from "@/pages"
import { useState } from "react"
import { StaticImageData } from "next/image"
import { useMoralis, useWeb3Contract } from "react-moralis"
import abi from "constants"
import contractAddresses from "constants"

interface tableProps {
    playing: GameState
    setPlaying: Function
    gameType: GameType
    bet: number
    guess: number
}

interface contractAddressesInterface {
    [key: string]: string[]
}

export default function Table(props: tableProps) {
    const { playing, setPlaying, gameType, bet, guess } = props

    const [playingCards, setPlayingCards] =
        useState<Array<[number, StaticImageData]>>(cards)

    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex } = useMoralis()
    const [indexChosen, setIndexChosen] = useState<number>(-1)
    const chainId: string = parseInt(chainIdHex!).toString()
    const gameAddress = chainId in addresses ? addresses[chainId][0] : null

    const { runContractFunction: play } = useWeb3Contract({
        abi: abi,
        contractAddress: gameAddress!,
        functionName: "play",
        params: { gameType, indexChosen, guess },
        msgValue: bet,
    })

    function shuffle(playingCards: [number, StaticImageData][]) {
        let currentIndex = playingCards.length,
            randomIndex

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--

            // And swap it with the current element.
            ;[playingCards[currentIndex], playingCards[randomIndex]] = [
                playingCards[randomIndex],
                playingCards[currentIndex],
            ]
        }

        return playingCards
    }

    return (
        <div className="card-table">
            {playingCards.map((card, index) => {
                return (
                    <button
                        onClick={async () => {
                            console.log(gameType, bet, guess, index)
                            setIndexChosen(index)
                            setPlaying(GameState.Loading)
                            // make request to smart contract
                            // shuffle cards based on event
                            shuffle(playingCards)
                            await new Promise((r) => setTimeout(r, 5000))
                            setPlaying(GameState.NotPlaying)
                        }}
                        disabled={playing != GameState.Playing}
                        id={index.toString()}
                    >
                        <ReactCardFlip
                            isFlipped={playing != GameState.NotPlaying}
                            flipDirection="horizontal"
                        >
                            <img src={card[1].src} height="130px" />

                            <img src={back.src} height="130px" />
                        </ReactCardFlip>
                    </button>
                )
            })}
        </div>
    )
}
