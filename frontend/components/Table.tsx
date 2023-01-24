import ReactCardFlip from "react-card-flip"
import { cards, back } from "../public/index"
import { GameType, GameState } from "@/pages"
import { useEffect, useState } from "react"
import { StaticImageData } from "next/image"
import { abi, contractAddresses } from "../constants"
import {
    useAccount,
    useConnect,
    useContractRead,
    useDisconnect,
    useNetwork,
} from "wagmi"

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
    const gameAddress =
        chainId in addresses
            ? (addresses[chainId][0] as `0x${string}`)
            : ("0x" as `0x${string}`)

    const { data, isError, isLoading, refetch } = useContractRead({
        address: gameAddress,
        abi: abi,
        functionName: "getMinimumBet",
    })

    const handleGame = async () => {
        console.log(gameAddress)
        const { data: temp } = await refetch()
        console.log(temp, gameType, bet, guess, chains, gameAddress)
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
            <div>{playing}</div>
        </div>
    )
}
