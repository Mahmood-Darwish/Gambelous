const { assert, anyValue } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper.config")
const chai = require("chai"),
    spies = require("chai-spies")

chai.use(spies)

const should = chai.should(),
    expect = chai.expect

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
              it("Can be withdrawn by owner only", async () => {
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

              it("Allows owner to withdraw ether", async () => {
                  const transactionHash = await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: ethers.utils.parseEther("0.1"),
                  })
                  await expect(game.withdraw(ethers.utils.parseEther("0.05")))
                      .to.not.be.reverted

                  assert.equal(
                      (await game.provider.getBalance(game.address)).toString(),
                      ethers.utils.parseEther("0.05")
                  )
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
                  ).to.not.be.reverted
              })

              it("Emits A game result", async () => {
                  await new Promise(async (resolve, reject) => {
                      game.once("GameResult", () => {
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
                      await VRFCoordinatorV2Mock.fulfillRandomWords(
                          1,
                          game.address
                      )
                  })
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

              /*it("Calls the right game", async () => {
                  const bet = await game.MINIMUM_BET()

                  game.play(0, deployer.address, 5, 5, {
                      value: bet,
                  })

                  const randomWords = Array.from({ length: 52 }, () =>
                      Math.floor(Math.random() * 100000000000)
                  )

                  const spy = chai.spy.on(game, "_fulfillRandomWords")
                  await game._fulfillRandomWords(0, randomWords)
                  console.log(spy)

                  expect(spy).to.have.been.called()
              })*/
          })

          describe("shuffleDeck", () => {
              it("Returns an array of length 52", async () => {
                  const randomWords = Array.from({ length: 52 }, () =>
                      Math.floor(Math.random() * 100000000000)
                  )
                  const arr = await game._shuffleDeck(randomWords)
                  assert.equal(arr.length, 52)
              })

              it("Returns a random array", async () => {
                  const randomWords = Array.from({ length: 52 }, () =>
                      Math.floor(Math.random() * 100000000000)
                  )
                  const arr = await game._shuffleDeck(randomWords)
                  assert.notEqual(arr, [...Array(52).keys()]) // check that the array isn't [0, 1, 2, ..., 51]
              })
          })

          describe("blackOrRed", () => {
              it("Emits a winning event when the player wins", async () => {
                  //console.log(await game._shuffleDeck([...Array(52).keys()]))
                  const randomWords = [...Array(52).keys()] // forces a certain pattern for the deck
                  const index_chosen = 0
                  const player_guess = 0
                  const bet_amount = (await game.MINIMUM_BET()) * 2
                  const requestId = 0

                  await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: ethers.utils.parseEther("1"),
                  })

                  await expect(
                      game._blackOrRed(
                          randomWords,
                          player.address,
                          index_chosen,
                          player_guess,
                          bet_amount,
                          requestId
                      )
                  )
                      .to.emit(game, "GameResult")
                      .withArgs(0, true, () => true)
              })

              it("Emits a losing event when the player loses", async () => {
                  //console.log(await game._shuffleDeck([...Array(52).keys()]))
                  const randomWords = [...Array(52).keys()] // forces a certain pattern for the deck
                  const index_chosen = 13
                  const player_guess = 0
                  const bet_amount = (await game.MINIMUM_BET()) * 2
                  const requestId = 0

                  await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: ethers.utils.parseEther("1"),
                  })

                  await expect(
                      game._blackOrRed(
                          randomWords,
                          player.address,
                          index_chosen,
                          player_guess,
                          bet_amount,
                          requestId
                      )
                  )
                      .to.emit(game, "GameResult")
                      .withArgs(0, false, () => true)
              })
          })

          describe("suit", () => {
              it("Emits a winning event when the player wins", async () => {
                  //console.log(await game._shuffleDeck([...Array(52).keys()]))
                  const randomWords = [...Array(52).keys()] // forces a certain pattern for the deck
                  const index_chosen = 0
                  const player_guess = 0
                  const bet_amount = (await game.MINIMUM_BET()) * 2
                  const requestId = 0

                  await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: ethers.utils.parseEther("1"),
                  })

                  await expect(
                      game._suit(
                          randomWords,
                          player.address,
                          index_chosen,
                          player_guess,
                          bet_amount,
                          requestId
                      )
                  )
                      .to.emit(game, "GameResult")
                      .withArgs(0, true, () => true)
              })

              it("Emits a losing event when the player loses", async () => {
                  //console.log(await game._shuffleDeck([...Array(52).keys()]))
                  const randomWords = [...Array(52).keys()] // forces a certain pattern for the deck
                  const index_chosen = 13
                  const player_guess = 0
                  const bet_amount = (await game.MINIMUM_BET()) * 2
                  const requestId = 0

                  await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: ethers.utils.parseEther("1"),
                  })

                  await expect(
                      game._suit(
                          randomWords,
                          player.address,
                          index_chosen,
                          player_guess,
                          bet_amount,
                          requestId
                      )
                  )
                      .to.emit(game, "GameResult")
                      .withArgs(0, false, () => true)
              })
          })
          describe("card", () => {
              it("Emits a winning event when the player wins", async () => {
                  //console.log(await game._shuffleDeck([...Array(52).keys()]))
                  const randomWords = [...Array(52).keys()] // forces a certain pattern for the deck
                  const index_chosen = 0
                  const player_guess = 0
                  const bet_amount = (await game.MINIMUM_BET()) * 2
                  const requestId = 0

                  await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: ethers.utils.parseEther("1"),
                  })

                  await expect(
                      game._card(
                          randomWords,
                          player.address,
                          index_chosen,
                          player_guess,
                          bet_amount,
                          requestId
                      )
                  )
                      .to.emit(game, "GameResult")
                      .withArgs(0, true, () => true)
              })

              it("Emits a losing event when the player loses", async () => {
                  //console.log(await game._shuffleDeck([...Array(52).keys()]))
                  const randomWords = [...Array(52).keys()] // forces a certain pattern for the deck
                  const index_chosen = 1
                  const player_guess = 0
                  const bet_amount = (await game.MINIMUM_BET()) * 2
                  const requestId = 0

                  await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: ethers.utils.parseEther("1"),
                  })

                  await expect(
                      game._card(
                          randomWords,
                          player.address,
                          index_chosen,
                          player_guess,
                          bet_amount,
                          requestId
                      )
                  )
                      .to.emit(game, "GameResult")
                      .withArgs(0, false, () => true)
              })
          })
      })
