import { GameType, GameState } from "@/pages"
import { notifyType, useNotification } from "web3uikit"
import { blackOrRed, card, suit } from "@/public"
import { useState } from "react"

interface menuProps {
    playing: GameState
    setPlaying: Function
    setGameType: Function
    setBet: Function
    setGuess: Function
    chosenCardFront: null | HTMLImageElement
    chosenCardBack: null | HTMLImageElement
    setChosenCardFront: Function
    setChosenCardBack: Function
}

export default function Menu(props: menuProps) {
    const {
        playing,
        setPlaying,
        setGameType,
        setBet,
        setGuess,
        chosenCardFront,
        chosenCardBack,
        setChosenCardFront,
        setChosenCardBack,
    } = props

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
            position: "topR",
        })
    }

    const validateInput = (
        gameType: string,
        guess: string,
        value: string
    ): boolean => {
        if (gameType === "") {
            return false
        }
        try {
            if (parseInt(guess) < 0 || parseInt(guess) > 51) {
                return false
            }
            if (parseFloat(value) < 0.001) {
                return false
            }
        } catch {
            return false
        }
        return true
    }

    const parseGameType = (gameType: string): GameType => {
        if (gameType === "blackOrRed") {
            return GameType.BlackOrRed
        }
        if (gameType === "suit") {
            return GameType.Suit
        }
        if (gameType === "card") {
            return GameType.Card
        }
        return GameType.None
    }

    const parseGuess = (guess: string, gameType: string): string => {
        if (gameType == "blackOrRed") {
            if (guess == "Red") {
                return "0"
            }
            return "13"
        }
        if (gameType == "suit") {
            if (guess == "Hearts") {
                return "0"
            }
            if (guess == "Spades") {
                return "13"
            }
            if (guess == "Dimonds") {
                return "26"
            }
            if (guess == "Clubs") {
                return "39"
            }
        }
        return card.findIndex((x) => x === guess).toString()
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        if (chosenCardFront != null) {
            chosenCardFront.classList.remove("chosen-card")
        }
        if (chosenCardBack != null) {
            chosenCardBack.classList.remove("chosen-card")
        }
        setChosenCardFront(null)
        setChosenCardBack(null)
        const gameType: string = (event.currentTarget[0] as HTMLSelectElement)
            .value
        const guess: string = parseGuess(
            (event.currentTarget[1] as HTMLSelectElement).value,
            gameType
        )
        const value: string = (event.currentTarget[2] as HTMLInputElement).value
        if (!validateInput(gameType, guess, value)) {
            handleNewNotification(
                "error",
                "Incorrect Input",
                "One of the fields entered in the form is incorrect. Please recheck."
            )
            return
        }
        setPlaying(GameState.Playing)
        setBet(parseFloat(value))
        setGuess(parseInt(guess))
        setGameType(parseGameType(gameType))
        handleNewNotification("success", "Game Started", "Please pick a card!")
    }

    const [selected, setSelected] = useState("blackOrRed")
    const changeSelectOptionHandler = (event: any) => {
        setSelected(event.target.value)
    }
    let type = blackOrRed
    if (selected === "blackOrRed") {
        type = blackOrRed
    } else if (selected === "suit") {
        type = suit
    } else if (selected === "card") {
        type = card
    }
    const options = type?.map((el) => <option key={el}>{el}</option>)

    return (
        <form onSubmit={handleSubmit}>
            <label>Choose a game:</label>
            <select
                disabled={playing != GameState.NotPlaying}
                onChange={changeSelectOptionHandler}
            >
                <option value="blackOrRed"> Black or Red </option>
                <option value="suit"> Suit </option>
                <option value="card"> Card </option>
            </select>
            <label>Enter your guess:</label>
            <select disabled={playing != GameState.NotPlaying}>
                {options}
            </select>
            <label>
                Enter amount to bet in ETH (Minimum bet is 0.001 ETH):
            </label>
            <input
                type="text"
                placeholder="0.001 ETH"
                pattern="\d*(\.\d+)?"
                disabled={playing != GameState.NotPlaying}
                required
            />
            <button
                style={{ marginLeft: "5px", marginRight: "5px" }}
                type="submit"
                disabled={playing != GameState.NotPlaying}
            >
                Start Game
            </button>
            <button
                style={{ marginLeft: "5px", marginRight: "5px" }}
                disabled={playing != GameState.Playing}
                onClick={(event) => {
                    event.preventDefault()
                    setPlaying(GameState.NotPlaying)
                    handleNewNotification(
                        "info",
                        "Game Cancelled",
                        "You've cancelled the game!"
                    )
                }}
            >
                Cancel Game
            </button>
        </form>
    )
}
