const { network, deployments, ethers } = require("hardhat")
const { assert } = require("chai")
const { developmentChains } = require("../../helper.config")
const chai = require("chai"),
    spies = require("chai-spies")

chai.use(spies)

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Game integration tests", () => {
          let game, VRFCoordinatorV2Mock, chainId, player, deployer
          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              player = accounts[1]
              await deployments.fixture(["mocks", "game"])
              game = await ethers.getContract("Game", deployer)
              VRFCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock",
                  deployer
              )
              chainId = network.config.chainId
          })

          describe("play", () => {
              it("Emits a game result", async () => {
                  const indexChosen = 5
                  const playerGuess = 5
                  const betAmount = (await game.getMinimumBet()) * 2
                  const gameType = 0
                  const amountToFund = ethers.utils.parseEther("1")
                  const requestId = 1

                  await new Promise(async (resolve, reject) => {
                      await deployer.sendTransaction({
                          to: (await ethers.getContract("Game")).address,
                          value: amountToFund,
                      })
                      game.once("GameResult", (requestId, result, deck) => {
                          try {
                              assert.equal(requestId.toString(), "1")
                              resolve()
                          } catch (e) {
                              reject(e)
                          }
                      })
                      await game.play(
                          gameType,
                          indexChosen,
                          playerGuess,
                          {
                              value: betAmount,
                          }
                      )
                      await VRFCoordinatorV2Mock.fulfillRandomWords(
                          requestId,
                          game.address
                      )
                  })
              })
          })
      })
