// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

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

    /**
     * @dev A public version of fulfillRandomWords for testing.
     */
    function _fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) public {
        fulfillRandomWords(requestId, randomWords);
    }

    /**
     * @dev A public version of generateNumbers for testing.
     */
    function _generateNumbers(
        uint256[] memory seeds
    ) public pure returns (uint8[52] memory) {
        return generateNumbers(seeds);
    }

    /**
     * @dev A public version of shuffleDeck for testing.
     */
    function _shuffleDeck(
        uint256[] memory randomWords
    ) public pure returns (uint8[52] memory) {
        return shuffleDeck(randomWords);
    }
}
