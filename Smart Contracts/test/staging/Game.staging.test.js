const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper.config")
const chai = require("chai"),
    spies = require("chai-spies")

chai.use(spies)

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Game staging tests", () => {
          let game, chainId, player, deployer

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              player = accounts[1]
              game = await ethers.getContract("Game", deployer)
              chainId = network.config.chainId
          })

          describe("play", () => {
              it("Emits A game result", async () => {
                  await new Promise(async (resolve, reject) => {
                      game.once("GameResult", (requestId, result, deck) => {
                          try {
                              resolve()
                          } catch (e) {
                              reject(e)
                          }
                      })
                      let bet = await game.MINIMUM_BET()
                      await game.play(0, deployer.address, 5, 5, {
                          value: bet,
                      })
                  })
              })
          })
      })
