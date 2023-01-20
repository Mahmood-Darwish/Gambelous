const networkConfig = {
    31337: {
        name: "hardhat",
        subscriptionId: "1",
        gasLane:
            "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        callbackGasLimit: "500000", // 500,000 gas
    },
    5: {
        name: "goerli",
        subscriptionId: "8814",
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 150 gwei
        callbackGasLimit: "500000", // 500,000 gas
        VRFCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    },
}

const developmentChains = ["hardhat", "localhost"]
const blockConfirmations = 6
//const frontEndContractsFile = "../frontend/constants/contractAddresses.json"
//const frontEndAbiFile = "../frontend/constants/abi.json"

module.exports = {
    networkConfig,
    developmentChains,
    blockConfirmations,
    //frontEndContractsFile,
    //frontEndAbiFile,
}
