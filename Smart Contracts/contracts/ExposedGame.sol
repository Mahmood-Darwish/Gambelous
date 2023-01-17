// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

/* imports */
import "./Game.sol";

/**@title An exposed version of Game.sol for testing
 * @author Mahmood Darwish
 * @dev All the functions in this version are public for testing
 * @notice Card mapping is as follows, 0-12 is Hearts (starting with 2 and ending with ace) 13-25 is Spades, 26-38 is Dimonds, and 39-51 is Clubs
 */
contract ExposedGame is Game {
    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) Game(vrfCoordinatorV2, subscriptionId, gasLane, callbackGasLimit) {}

    function _fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) public {
        fulfillRandomWords(requestId, randomWords);
    }

    function _shuffleDeck(
        uint256[] memory random_words
    ) public pure returns (uint8[52] memory) {
        return shuffleDeck(random_words);
    }

    function _blackOrRed(
        uint256[] memory random_words,
        address player,
        uint8 index_chosen,
        uint8 player_guess,
        uint256 bet_amount,
        uint256 requestId
    ) public {
        blackOrRed(
            random_words,
            player,
            index_chosen,
            player_guess,
            bet_amount,
            requestId
        );
    }

    function _suit(
        uint256[] memory random_words,
        address player,
        uint8 index_chosen,
        uint8 player_guess,
        uint256 bet_amount,
        uint256 requestId
    ) public {
        suit(
            random_words,
            player,
            index_chosen,
            player_guess,
            bet_amount,
            requestId
        );
    }

    function _card(
        uint256[] memory random_words,
        address player,
        uint8 index_chosen,
        uint8 player_guess,
        uint256 bet_amount,
        uint256 requestId
    ) public {
        card(
            random_words,
            player,
            index_chosen,
            player_guess,
            bet_amount,
            requestId
        );
    }
}
