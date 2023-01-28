import ReactCardFlip from "react-card-flip"
import { cards, back, defaultArray } from "../public/index"
import { GameType, GameState } from "@/pages"
import { useEffect, useState } from "react"
import { abi, contractAddresses } from "../constants"
import { useContract, useContractEvent, useNetwork, useSigner } from "wagmi"
import { utils } from "ethers"
import { notifyType, useNotification } from "web3uikit"

interface tableProps {
    playing: GameState
    setPlaying: Function
    gameType: GameType
    bet: number
    guess: number
    chosenCardIndex: number
    setChosenCardIndex: Function
}

interface contractAddressesInterface {
    [key: string]: string[]
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

export default function Table(props: tableProps) {
    const {
        playing,
        setPlaying,
        gameType,
        bet,
        guess,
        chosenCardIndex,
        setChosenCardIndex,
    } = props
    const [playingCards, setPlayingCards] = useState<Array<number>>(
        initializeState("playingCardsState", defaultArray)
    )
    const [gameId, setGameId] = useState<string>(
        initializeState("gameIdState", "0x")
    )

    useEffect(() => {
        setGameId(initializeState("gameIdState", ""))
        setPlayingCards(initializeState("playingCardsState", defaultArray))
    }, [])

    useEffect(() => {
        window.sessionStorage.setItem("gameIdState", JSON.stringify(gameId))
        window.sessionStorage.setItem(
            "playingCardsState",
            JSON.stringify(playingCards)
        )
    }, [gameId, playingCards])

    const dispatch = useNotification()

    const handleNewNotification = (
        type: notifyType,
        title: string,
        message: string
    ) => {
        dispatch({
            type,
            message: message,
            title: title,
            position: "bottomR",
        })
    }

    const addresses: contractAddressesInterface = contractAddresses
    const { chain } = useNetwork()
    const chainId = chain?.id !== undefined ? chain.id.toString() : ""
    const gameAddress =
        chainId in addresses
            ? (addresses[chainId][0] as `0x${string}`)
            : ("0x" as `0x${string}`)

    const { data: signer } = useSigner()
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
            if (player?.toString() === (await signer?.getAddress())) {
                setGameId(requestId as string)
                handleNewNotification(
                    "info",
                    "Game ID Received",
                    `The game has been received by the smart contract. Your game ID is ${requestId?.toString()}.`
                )
                return
            }
            console.log(player?.toString(), requestId?.toString())
        },
    })

    useContractEvent({
        address: gameAddress,
        abi: abi,
        eventName: "GameResult",
        async listener(requestId, result, deck) {
            if (requestId?.toString() === gameId.toString()) {
                handleNewNotification(
                    (result as boolean) ? "success" : "error",
                    (result as boolean) ? "You've won" : "You've lost",
                    `The result of the game has come back. ${
                        (result as boolean) ? "You've won" : "You've lost"
                    }!`
                )
                setGameId("0x")
                setPlayingCards(deck as number[])
                setPlaying(GameState.NotPlaying)
                return
            }
            console.log(requestId?.toString(), result?.toString())
        },
    })

    const playGame = async (indexChosen: number) => {
        setPlaying(GameState.Loading)
        try {
            game!
                .play(gameType, indexChosen, guess, {
                    value: utils.parseEther(bet.toString()),
                })
                .then((_: any) => {})
                .catch((e: any) => {
                    handleNewNotification(
                        "error",
                        "Can't start game",
                        `Error message: ${
                            e.code === "ACTION_REJECTED"
                                ? "user rejected transaction."
                                : e
                        }`
                    )
                    setPlaying(GameState.NotPlaying)
                })
        } catch (e) {
            handleNewNotification(
                "error",
                "Can't start game",
                `Error message: ${e}`
            )
            setPlaying(GameState.NotPlaying)
        }
    }

    return (
        <div className="grid">
            {playingCards.map((cardIndex, index) => {
                return (
                    <button
                        onClick={async () => {
                            setChosenCardIndex(index)
                            playGame(index)
                        }}
                        disabled={playing !== GameState.Playing}
                        id={"image-button"}
                    >
                        <ReactCardFlip
                            isFlipped={playing !== GameState.NotPlaying}
                            flipDirection="horizontal"
                        >
                            <img
                                className={
                                    chosenCardIndex === index
                                        ? "chosen-card"
                                        : ""
                                }
                                src={cards[cardIndex].src}
                                height="140px"
                            />

                            <img
                                className={
                                    chosenCardIndex === index
                                        ? "chosen-card"
                                        : ""
                                }
                                src={back.src}
                                height="140px"
                            />
                        </ReactCardFlip>
                    </button>
                )
            })}
        </div>
    )
}
