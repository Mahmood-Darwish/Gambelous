import { GameType, GameState } from "@/pages"
import { notifyType, useNotification } from "web3uikit"

interface menuProps {
    playing: GameState
    setPlaying: Function
    setGameType: Function
    setBet: Function
    setGuess: Function
}

export default function Menu(props: menuProps) {
    const { playing, setPlaying, setGameType, setBet, setGuess } = props

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        const gameType: string = event.target[0].value
        const guess: string = event.target[1].value
        const value: string = event.target[2].value
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

    return (
        <form onSubmit={handleSubmit}>
            <label>Choose a game:</label>
            <select name="games" disabled={playing != GameState.NotPlaying}>
                <option value="">--Please choose an option--</option>
                <option value="blackOrRed"> Black Or Red </option>
                <option value="suit"> Suit </option>
                <option value="card"> Card </option>
            </select>
            <label>Enter your guess:</label>
            <input
                type="text"
                placeholder="0"
                pattern="\d*"
                disabled={playing != GameState.NotPlaying}
                required
            />
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
            <button type="submit" disabled={playing != GameState.NotPlaying}>
                Start Game
            </button>
        </form>
    )
}
