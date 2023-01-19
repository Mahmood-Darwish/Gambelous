const { network, deployments, ethers } = require("hardhat")
const { assert } = require("chai")
const { developmentChains } = require("../../helper.config")
const chai = require("chai"),
    spies = require("chai-spies")

chai.use(spies)

const should = chai.should(),
    expect = chai.expect

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
                  await new Promise(async (resolve, reject) => {
                      game.once("GameResult", (requestId, result, deck) => {
                          try {
                              assert.equal(requestId.toString(), "1")
                              resolve()
                          } catch (e) {
                              reject(e)
                          }
                      })
                      let bet = await game.MINIMUM_BET()
                      await game.play(0, deployer.address, 5, 5, {
                          value: bet,
                      })
                      await VRFCoordinatorV2Mock.fulfillRandomWords(
                          1,
                          game.address
                      )
                  })
              })
          })
      })
