import ReactCardFlip from "react-card-flip"
import { cards, back } from "../public/index"
import { GameType, GameState } from "@/pages"
import { useEffect, useState } from "react"
import { StaticImageData } from "next/image"
import { abi, contractAddresses } from "../constants"
import { ContractTransaction } from "ethers"
import { ethers } from "ethers"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"

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
    const { chain, chains } = useNetwork()
    const chainId = chain?.id != undefined ? chain.id.toString() : ""
    const gameAddress = chainId in addresses ? addresses[chainId][0] : null

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
        console.log("Success")
        console.log("Player address: " + (await tx.wait(1)).events[1].topics[1])
        const requestId = ethers.utils.defaultAbiCoder.decode(
            ["uint256"],
            (await tx.wait(1)).events[1].data
        )
        console.log("RequestId: " + requestId)
    }

    const handleError = async function (error: Error) {
        console.log(error)
    }

    const handleGame = async () => {
        /*console.log(gameAddress)

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const value = await play({
            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
            onError: (error) => handleError(error),
        })
        // shuffle cards based on event
        shuffle(playingCards)
        */
        console.log(gameType, bet, guess)
        setPlaying(GameState.NotPlaying)
    }

    useEffect(() => {
        if (indexChosen != -1) {
            handleGame()
        }
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
