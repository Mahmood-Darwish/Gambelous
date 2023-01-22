const {
    frontEndContractsFile,
    frontEndAbiFile,
} = require("../helper.config")
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end updated!")
    }
}

async function updateAbi() {
    const game = await ethers.getContract("Game")
    fs.writeFileSync(
        frontEndAbiFile,
        game.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const game = await ethers.getContract("Game")
    const contractAddresses = JSON.parse(
        fs.readFileSync(frontEndContractsFile, "utf8")
    )
    if (network.config.chainId.toString() in contractAddresses) {
        if (
            !contractAddresses[network.config.chainId.toString()].includes(
                game.address
            )
        ) {
            contractAddresses[network.config.chainId.toString()].push(
                game.address
            )
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = [game.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
