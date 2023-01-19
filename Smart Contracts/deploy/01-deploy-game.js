const { utils } = require("ethers")
const { network } = require("hardhat")
const {
    developmentChains,
    networkConfig,
    blockConfirmations,
} = require("../helper.config")
const { verify } = require("../utils/verfiy")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let VRFCoordinatorV2Address, subscriptionId
    const gasLane = networkConfig[chainId]["gasLane"]
    const subscriptionLinkFund = ethers.utils.parseEther("10")
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    let VRFCoordinatorV2Mock

    console.log("Getting subscription ID for VRF coordinator...")
    if (developmentChains.includes(network.name)) {
        VRFCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        )
        VRFCoordinatorV2Address = VRFCoordinatorV2Mock.address
        const transactionResponse =
            await VRFCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        await VRFCoordinatorV2Mock.fundSubscription(
            subscriptionId,
            subscriptionLinkFund
        )
    } else {
        VRFCoordinatorV2Address = networkConfig[chainId]["VRFCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const args = [
        VRFCoordinatorV2Address,
        subscriptionId,
        gasLane,
        callbackGasLimit,
    ]
    let waitConfirmations = blockConfirmations
    if (developmentChains.includes(network.name)) {
        waitConfirmations = 1
    }
    console.log('Deploying "Game" contract...')
    const game = await deploy("Game", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitConfirmations,
    })
    console.log('"Game" contract deployed!')

    if (developmentChains.includes(network.name)) {
        await VRFCoordinatorV2Mock.addConsumer(
            subscriptionId.toNumber(),
            game.address
        )
    }
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Verifying contract on Etherscan...")
        await verify(game.address, args)
    }
    console.log("----------------------------------------")
}

module.exports.tags = ["all", "game"]
