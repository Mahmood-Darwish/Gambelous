// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

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
        uint8 index_chosen;
        uint8 player_guess;
        uint256 bet_amount;
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
    uint32 private constant NUM_WORDS = 52;

    // contract veriables
    address private immutable i_owner;
    uint256 public constant MINIMUM_BET = 1000000000000000;
    mapping(uint256 => GameRequest) private s_requests;

    /* modifiers */
    modifier onwerOnly() {
        if (msg.sender != i_owner) {
            revert Game__Not_Onwer();
        }
        _;
    }

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
    function play(
        GameTypes game,
        address player,
        uint8 index_chosen,
        uint8 player_guess
    ) external payable {
        if (msg.value <= MINIMUM_BET) {
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
            player: player,
            index_chosen: index_chosen,
            player_guess: player_guess,
            bet_amount: msg.value
        });
    }

    function withdraw(uint256 value) external onwerOnly {
        if (value > address(this).balance) {
            revert Game__Not_Enough_Balance();
        }
        (bool success, ) = i_owner.call{value: value}("");
        if (!success) {
            revert Game__Transfer_Failed();
        }
    }

    function getOwner() external view returns (address) {
        return i_owner;
    }

    function getGasLane() external view returns (bytes32) {
        return i_gasLane;
    }

    function getCallbackGasLimit() external view returns (uint32) {
        return i_callbackGasLimit;
    }

    function getSubscriptionId() external view returns (uint64) {
        return i_subscriptionId;
    }

    /* internal functions */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        // Why does solidity 0.8.7 have no switch statement?
        if (s_requests[requestId].gameType == GameTypes.BlackOrRed) {
            blackOrRed(
                randomWords,
                s_requests[requestId].player,
                s_requests[requestId].index_chosen,
                s_requests[requestId].player_guess,
                s_requests[requestId].bet_amount
            );
        }
        if (s_requests[requestId].gameType == GameTypes.Suit) {
            suit(
                randomWords,
                s_requests[requestId].player,
                s_requests[requestId].index_chosen,
                s_requests[requestId].player_guess,
                s_requests[requestId].bet_amount
            );
        }
        if (s_requests[requestId].gameType == GameTypes.Card) {
            card(
                randomWords,
                s_requests[requestId].player,
                s_requests[requestId].index_chosen,
                s_requests[requestId].player_guess,
                s_requests[requestId].bet_amount
            );
        }
        delete s_requests[requestId];
    }

    function shuffleDeck(
        uint256[] memory random_words
    ) internal pure returns (uint8[52] memory) {
        uint8[52] memory unshuffled;
        uint8[52] memory deck;

        for (uint8 i = 0; i < 52; i++) {
            unshuffled[i] = i;
        }

        uint8 cardIndex;

        for (uint8 i = 0; i < 52; i++) {
            cardIndex = uint8(random_words[i] % (52 - i));
            deck[i] = unshuffled[cardIndex];
            unshuffled[cardIndex] = unshuffled[52 - i - 1];
        }
        return deck;
    }

    function blackOrRed(
        uint256[] memory random_words,
        address player,
        uint8 index_chosen,
        uint8 player_guess,
        uint256 bet_amount
    ) internal {
        uint8[52] memory deck = shuffleDeck(random_words);

        if (isRed(deck[index_chosen]) == isRed(player_guess)) {
            (bool success, ) = player.call{value: bet_amount * 2}("");
            if (!success) {
                revert Game__Transfer_Failed();
            }
        }
    }

    function suit(
        uint256[] memory random_words,
        address player,
        uint8 index_chosen,
        uint8 player_guess,
        uint256 bet_amount
    ) internal {
        uint8[52] memory deck = shuffleDeck(random_words);

        if (getSuit(deck[index_chosen]) == getSuit(player_guess)) {
            (bool success, ) = player.call{value: bet_amount * 4}("");
            if (!success) {
                revert Game__Transfer_Failed();
            }
        }
    }

    function card(
        uint256[] memory random_words,
        address player,
        uint8 index_chosen,
        uint8 player_guess,
        uint256 bet_amount
    ) internal {
        uint8[52] memory deck = shuffleDeck(random_words);

        if (deck[index_chosen] == player_guess) {
            (bool success, ) = player.call{value: bet_amount * 52}("");
            if (!success) {
                revert Game__Transfer_Failed();
            }
        }
    }

    /* private functions */
    function isRed(uint8 card) private pure returns (bool) {
        return (card <= 12 || (card >= 26 && card <= 38));
    }

    function getSuit(uint8 card) private pure returns (uint8) {
        // Again, why does solidity 0.8.7 have no switch statement?
        if (card <= 12) {
            return 0;
        }
        if (card <= 25) {
            return 1;
        }
        if (card <= 38) {
            return 2;
        }
        return 3;
    }
}
