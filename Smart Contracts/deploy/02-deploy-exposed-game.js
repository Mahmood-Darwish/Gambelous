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

    if (developmentChains.includes(network.name)) {
        console.log("Getting subscription ID for VRF coordinator...")
        const VRFCoordinatorV2Mock = await ethers.getContract(
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

        const args = [
            VRFCoordinatorV2Address,
            subscriptionId,
            gasLane,
            callbackGasLimit,
        ]
        let waitConfirmations = 1
        console.log('Deploying "ExposedGame" contract...')
        const game = await deploy("ExposedGame", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: waitConfirmations,
        })
        await VRFCoordinatorV2Mock.addConsumer(subscriptionId.toNumber(), game.address)
        console.log('"ExposedGame" contract deployed!')
        console.log("----------------------------------------")
    }
}

module.exports.tags = ["all", "exposedgame", "testing"]
