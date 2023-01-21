import ReactCardFlip from "react-card-flip"
import { cards, back } from "../public/index"

export default function Table() {
    return (
        <div className="card-table">
            {cards.map((card) => {
                return (
                    <ReactCardFlip isFlipped={false} flipDirection="horizontal">
                        <img src={card.src} height="130px" />

                        <img src={back.src} height="130px" />
                    </ReactCardFlip>
                )
            })}
        </div>
    )
}
