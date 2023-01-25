import ReactCardFlip from "react-card-flip"
import { cards, back } from "../public/index"
import { GameType, GameState } from "@/pages"
import { useEffect, useState } from "react"
import { StaticImageData } from "next/image"
import { abi, contractAddresses } from "../constants"
import {
    useAccount,
    useConnect,
    useContract,
    useContractEvent,
    useContractRead,
    useDisconnect,
    useNetwork,
    useProvider,
    useSigner,
} from "wagmi"
import { utils } from "ethers"

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
    const [gameId, setGameId] = useState<string>("")

    const addresses: contractAddressesInterface = contractAddresses
    const { chain, chains } = useNetwork()
    const chainId = chain?.id != undefined ? chain.id.toString() : ""
    const gameAddress =
        chainId in addresses
            ? (addresses[chainId][0] as `0x${string}`)
            : ("0x" as `0x${string}`)

    const { data: signer, isError, isLoading } = useSigner()
    const game = useContract({
        address: gameAddress,
        abi: abi,
        signerOrProvider: signer,
    })

    useContractEvent({
        address: gameAddress,
        abi: abi,
        eventName: "GameId",
        async listener(player, requestId) {
            if (player?.toString() == (await signer?.getAddress())) {
                setGameId(requestId as string)
                console.log(requestId)
            }
            console.log(
                typeof player,
                requestId?.toString(),
                typeof (await signer?.getAddress())
            )
        },
    })

    const shuffle = (deck: number[]) => {
        const temp: Array<[number, StaticImageData]> = []
        for (let i = 0; i < deck.length; i++) {
            for (let j = 0; j < deck.length; j++) {
                if (playingCards[j][0] == deck[i]) {
                    temp.push(playingCards[j])
                    break
                }
            }
        }
        setPlayingCards(temp)
    }

    useContractEvent({
        address: gameAddress,
        abi: abi,
        eventName: "GameResult",
        async listener(requestId, result, deck) {
            if (requestId?.toString() == gameId) {
                shuffle(deck as number[])
                setGameId("")
                setPlaying(GameState.NotPlaying)
            }
            console.log(requestId?.toString(), gameId)
            console.log(result)
        },
    })

    const playGame = async () => {
        console.log(game)
        console.log(gameAddress)
        setPlaying(GameState.Loading)
        game!.play(gameType, indexChosen, guess, {
            value: utils.parseEther(bet.toString()),
        })
    }

    useEffect(() => {
        if (indexChosen != -1) {
            playGame()
        }
    }, [indexChosen])

    return (
        <div className="card-table">
            {playingCards.map((card, index) => {
                return (
                    <button
                        onClick={async () => {
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
