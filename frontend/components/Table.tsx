import ReactCardFlip from "react-card-flip"
import { cards, back } from "../public/index"
import { GameType, GameState } from "@/pages"
import { useEffect, useState } from "react"
import { StaticImageData } from "next/image"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ContractTransaction } from "ethers"
import { Moralis } from "moralis-v1"

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
    const [indexChosen, setIndexChosen] = useState<number>(-1)

    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()
    const gameAddress = chainId in addresses ? addresses[chainId][0] : null

    const { runContractFunction: play } = useWeb3Contract({
        abi: abi,
        contractAddress: gameAddress!,
        functionName: "play",
        params: {
            game: gameType,
            indexChosen: indexChosen,
            playerGuess: guess,
        },
        msgValue: Moralis.Units.Token(bet, 18),
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

    const handleSuccess = async function (tx: ContractTransaction) {
        console.log(await tx.wait(1))
    }

    const handleGame = async () => {
        await play({
            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
            onError: (error) => console.log(error),
        })
        // shuffle cards based on event
        shuffle(playingCards)
        setPlaying(GameState.NotPlaying)
    }

    useEffect(() => {
        handleGame()
    }, [indexChosen])

    return (
        <div className="card-table">
            {playingCards.map((card, index) => {
                return (
                    <button
                        onClick={async () => {
                            setPlaying(GameState.Loading)
                            setIndexChosen(index)
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
