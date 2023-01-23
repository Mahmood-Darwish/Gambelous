// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

/* imports */
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

/* errors */
error Game__Transfer_Failed();
error Game__Not_Onwer();
error Game__Not_Enough_ETH();
error Game__Not_Enough_Balance();
error Game__VRF_RequestId_Not_Found();

/**@title A simple card game contract
 * @author Mahmood Darwish
 * @dev This implements the Chainlink VRF Version 2
 * @notice Card mapping is as follows, 0-12 is Hearts (starting with 2 and ending with ace) 13-25 is Spades, 26-38 is Dimonds, and 39-51 is Clubs
 */
contract Game is VRFConsumerBaseV2 {
    /* type declarations */
    struct GameRequest {
        GameTypes gameType;
        address player;
        uint8 indexChosen;
        uint8 playerGuess;
        uint256 betAmount;
    }

    enum GameTypes {
        BlackOrRed,
        Suit,
        Card
    }

    /* state variables */
    // VRF variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 2;

    // contract veriables
    address private immutable i_owner;
    uint256 private constant MINIMUM_BET = 1000000000000000; // 0.001 ETH
    mapping(uint256 => GameRequest) private s_requests;

    /* events */
    /**
     * @notice This event sends the result of a certain game.
     * @param requestId A unique ID to identify the game producing the event.
     * @param result The result whether the player won or not.
     * @param deck The distribution of the deck for this game.
     */
    event GameResult(uint256 indexed requestId, bool result, uint8[52] deck);
    /**
     * @notice This event sends an ID of a game to be tracked.
     * @param player The address of the player of a certain game.
     * @param requestId A unique ID to identify the game producing the event.
     */
    event GameId(address indexed player, uint256 requestId);

    /* modifiers */
    modifier onwerOnly() {
        if (msg.sender != i_owner) {
            revert Game__Not_Onwer();
        }
        _;
    }

    /**
     * @param vrfCoordinatorV2 Address of the Chainlink contract that will provide the VRF service.
     * @param subscriptionId The subscription ID that this contract uses for funding requests.
     * @param gasLane The key hash value of the maximum gas price for a VRF request in wei.
     * @param callbackGasLimit The limit for how much gas to use for the VRF's request to fulfillRandomWords().
     */
    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        i_owner = msg.sender;
    }

    receive() external payable {}

    /* external functions */
    /**
     * @notice The main function of the contract. Starts a game.
     * @notice Reverts in case the bet amount is less than the minimum.
     * @param game The type of the game to start.
     * @param indexChosen Which card the player chose from the deck.
     * @param playerGuess What card did the player expect it to be.
     * @return requestId An ID to uniquely identify the game.
     */
    function play(
        GameTypes game,
        uint8 indexChosen,
        uint8 playerGuess
    ) external payable returns (uint256) {
        if (msg.value < MINIMUM_BET) {
            revert Game__Not_Enough_ETH();
        }

        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requests[requestId] = GameRequest({
            gameType: game,
            player: msg.sender,
            indexChosen: indexChosen,
            playerGuess: playerGuess,
            betAmount: msg.value
        });

        emit GameId(msg.sender, requestId);
    }

    /**
     * @notice Allows the withdrawal of ETH from the contract.
     * @notice Can only be used by the deployer of the contract.
     * @param value The amount of ETH to withdraw in Wei.
     */
    function withdraw(uint256 value) external onwerOnly {
        if (value > address(this).balance) {
            revert Game__Not_Enough_Balance();
        }
        (bool success, ) = i_owner.call{value: value}("");
        if (!success) {
            revert Game__Transfer_Failed();
        }
    }

    /**
     * @return i_owner The address of the deployer.
     */
    function getOwner() external view returns (address) {
        return i_owner;
    }

    /**
     * @return i_gasLane The key hash value of the maximum gas price for a VRF request in wei.
     */
    function getGasLane() external view returns (bytes32) {
        return i_gasLane;
    }

    /**
     * @return i_callbackGasLimit The limit for how much gas to use for the VRF's request to fulfillRandomWords().
     */
    function getCallbackGasLimit() external view returns (uint32) {
        return i_callbackGasLimit;
    }

    /**
     * @return i_subscriptionId The subscription ID that this contract uses for funding requests.
     */
    function getSubscriptionId() external view returns (uint64) {
        return i_subscriptionId;
    }

    /**
     * @return MINIMUM_BET The minimum bet that needs to be placed to play a game.
     */
    function getMinimumBet() external pure returns (uint256) {
        return MINIMUM_BET;
    }

    /* internal functions */
    /**
     * @notice Create multiple small random numbers from big random numbers.
     * @dev This reduces the amount of numbers to be requested from the VRF service from 52 to 2.
     * @dev It slices a 256bit number into 32 8bit numbers.
     * @param seeds An array of 256bit random numbers.
     * @return result An array of 8bit random numbers.
     */
    function generateNumbers(
        uint256[] memory seeds
    ) internal pure returns (uint8[52] memory) {
        uint8[52] memory result;
        uint8 currentNumToCreate = 0;
        for (uint8 i = 0; i < seeds.length; i++) {
            // (256 / 8) is how many 8bit numbers you can get from a 256bit number
            for (uint8 j = 0; j < (256 / 8); j++) {
                result[currentNumToCreate] = uint8(seeds[i] % 256);
                seeds[i] /= 256;
                currentNumToCreate++;
                if (currentNumToCreate == 52) {
                    break;
                }
            }
        }
        return result;
    }

    /**
     * @notice Randomly shuffles an array.
     * @param seeds An array of 256bit random numbers.
     * @return deck An array representing a premutation from 0 to 51.
     */
    function shuffleDeck(
        uint256[] memory seeds
    ) internal pure returns (uint8[52] memory) {
        uint8[52] memory randomWords = generateNumbers(seeds);
        uint8[52] memory unshuffled;
        uint8[52] memory deck;

        for (uint8 i = 0; i < 52; i++) {
            unshuffled[i] = i;
        }

        uint8 cardIndex;

        for (uint8 i = 0; i < 52; i++) {
            cardIndex = uint8(randomWords[i] % (52 - i));
            deck[i] = unshuffled[cardIndex];
            unshuffled[cardIndex] = unshuffled[52 - i - 1];
        }
        return deck;
    }

    /**
     * @dev This function will be called by the VRF service.
     * @notice Plays a game based on the type requested by the player.
     * @notice Emits an event of type GameResult to announce the result of the game.
     * @param requestId The ID of the VRF request.
     * @param randomWords The random numbers retrieved from VRF service.
     */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        if (s_requests[requestId].betAmount == 0) {
            revert Game__VRF_RequestId_Not_Found();
        }
        uint8[52] memory deck = shuffleDeck(randomWords);
        bool result = false;
        GameTypes gameType = s_requests[requestId].gameType;
        address player = s_requests[requestId].player;
        uint8 indexChosen = s_requests[requestId].indexChosen;
        uint8 playerGuess = s_requests[requestId].playerGuess;
        uint256 betAmount = s_requests[requestId].betAmount;
        delete s_requests[requestId];

        // Why does solidity 0.8.7 have no switch statement?
        if (gameType == GameTypes.BlackOrRed) {
            if (isRed(deck[indexChosen]) == isRed(playerGuess)) {
                result = true;
                (bool success, ) = player.call{value: betAmount * 2}("");
                if (!success) {
                    revert Game__Transfer_Failed();
                }
            }
        }
        if (s_requests[requestId].gameType == GameTypes.Suit) {
            if (getSuit(deck[indexChosen]) == getSuit(playerGuess)) {
                result = true;
                (bool success, ) = player.call{value: betAmount * 4}("");
                if (!success) {
                    revert Game__Transfer_Failed();
                }
            }
        }
        if (s_requests[requestId].gameType == GameTypes.Card) {
            if (deck[indexChosen] == playerGuess) {
                result = true;
                (bool success, ) = player.call{value: betAmount * 52}("");
                if (!success) {
                    revert Game__Transfer_Failed();
                }
            }
        }
        emit GameResult(requestId, result, deck);
    }

    /* private functions */
    /**
     * @notice Checks whether a card is red or not.
     * @dev It relies on the mapping of the deck.
     * @param cardToCheck The card to be checked.
     * @return result True if the card is red, false if not.
     */
    function isRed(uint8 cardToCheck) private pure returns (bool) {
        return (cardToCheck <= 12 || (cardToCheck >= 26 && cardToCheck <= 38));
    }

    /**
     * @notice Checks what suit a card is.
     * @dev It relies on the mapping of the deck.
     * @param cardToCheck The card to be checked.
     * @return result Returns 0 if hearts, 1 if Spades, 2 if Dimonds, and 3 if Clubs.
     */
    function getSuit(uint8 cardToCheck) private pure returns (uint8) {
        // Again, why does solidity 0.8.7 have no switch statement?
        if (cardToCheck <= 12) {
            return 0;
        }
        if (cardToCheck <= 25) {
            return 1;
        }
        if (cardToCheck <= 38) {
            return 2;
        }
        return 3;
    }
}
