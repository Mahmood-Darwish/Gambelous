const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Game unit tests", () => {
          let game, VRFCoordinatorV2Mock, chainId, player, deployer

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              player = accounts[1]
              await deployments.fixture(["testing"])
              game = await ethers.getContract("ExposedGame", deployer)
              VRFCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock",
                  deployer
              )
              chainId = network.config.chainId
          })

          describe("Constructor", () => {
              it("Initilizes contract correctly", async () => {
                  const owner = (await game.getOwner()).toString()
                  const minBet = (await game.MINIMUM_BET()).toString()
                  const subscriptionId = (
                      await game.getSubscriptionId()
                  ).toString()
                  const gasLane = (await game.getGasLane()).toString()
                  const callbackGasLimit = (
                      await game.getCallbackGasLimit()
                  ).toString()

                  assert.equal(deployer.address, owner)
                  assert.equal(minBet, "1000000000000000")
                  assert.equal(
                      networkConfig[chainId]["subscriptionId"],
                      subscriptionId
                  )
                  assert.equal(networkConfig[chainId]["gasLane"], gasLane)
                  assert.equal(
                      networkConfig[chainId]["callbackGasLimit"],
                      callbackGasLimit
                  )
              })
          })

          describe("Withdraw", () => {
              it("Only owner can withdarw", async () => {
                  const playerGame = game.connect(player)
                  await expect(
                      playerGame.withdraw(ethers.utils.parseEther("0.25"))
                  ).to.be.revertedWith("Game__Not_Onwer")
              })

              it("Reverts when owner withdraws more than available amount", async () => {
                  const transactionHash = await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: ethers.utils.parseEther("0.01"),
                  })
                  await expect(
                      game.withdraw(ethers.utils.parseEther("0.25"))
                  ).to.be.revertedWith("Game__Not_Enough_Balance")
              })

              it("Owner can withdraw ether", async () => {
                  const transactionHash = await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: ethers.utils.parseEther("0.1"),
                  })
                  expect(await game.withdraw(ethers.utils.parseEther("0.05")))
                      .to.be.ok
              })
          })

          describe("Play", () => {
              it("Can't play with less than minimum amount", async () => {
                  let bet = await game.MINIMUM_BET()
                  bet /= 2

                  await expect(
                      game.play(0, deployer.address, 5, 5, {
                          value: bet,
                      })
                  ).to.be.revertedWith("Game__Not_Enough_ETH")
              })

              it("Lets the request through if enough ETH is paid", async () => {
                  let bet = await game.MINIMUM_BET()
                  await expect(
                      game.play(0, deployer.address, 5, 5, {
                          value: bet,
                      })
                  ).to.be.ok
              })
          })

          describe("fulfillRandomWords", () => {
              it("Cannot be called with nonexistent request IDs", async () => {
                  await expect(
                      VRFCoordinatorV2Mock.fulfillRandomWords(0, game.address)
                  ).to.be.revertedWith("nonexistent request")
                  await expect(
                      VRFCoordinatorV2Mock.fulfillRandomWords(1, game.address)
                  ).to.be.revertedWith("nonexistent request")
              })

              it("Calls the right game", async () => {
                  let bet = await game.MINIMUM_BET()

                  game.play(0, deployer.address, 5, 5, {
                      value: bet,
                  })

                  let randomWords = Array.from({ length: 52 }, () =>
                      Math.floor(Math.random() * 100000000000)
                  )
                  await expect(game._fulfillRandomWords(0, randomWords)).to.be.ok
              })
          })
      })
