const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Game unit tests", () => {
          let game, chainId, player, deployer
          let deckLength
          /*
            The seeds cause the following shuffle:
            [
                23,  2, 20, 41,  9, 11, 36, 34, 37, 26, 42,
                39, 16, 17,  7, 28, 46, 15,  3, 47, 19,  1,
                35, 22, 32, 51, 43, 48,  0, 12, 38, 14, 29,
                5, 31, 33, 21, 50, 25, 24, 10, 45,  4, 40,
                27,  6, 13, 18, 30,  8, 49, 44
            ]
          */
          const seeds = [
              35053992357293870730714867426566905148978928452753502468510870549180240652415n,
              65435487694026400608138574424648548168885109637056472451333937866018550034503n,
          ]

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
              blackOrRedGame = 0
              suitGame = 1
              cardGame = 2
              deckLength = 52
          })

          describe("Constructor", () => {
              it("Initilizes contract correctly", async () => {
                  const owner = (await game.getOwner()).toString()
                  const minBet = (await game.getMinimumBet()).toString()
                  const expectedMinBet = "1000000000000000"
                  const subscriptionId = (
                      await game.getSubscriptionId()
                  ).toString()
                  const gasLane = (await game.getGasLane()).toString()
                  const callbackGasLimit = (
                      await game.getCallbackGasLimit()
                  ).toString()

                  assert.equal(deployer.address, owner)
                  assert.equal(minBet, expectedMinBet)
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
                  const amountTOSend = ethers.utils.parseEther("0.01")
                  const amountTOWithdraw = ethers.utils.parseEther("0.25")

                  await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: amountTOSend,
                  })

                  await expect(
                      game.withdraw(amountTOWithdraw)
                  ).to.be.revertedWith("Game__Not_Enough_Balance")
              })

              it("Allows owner to withdraw ether", async () => {
                  const amountTOSend = ethers.utils.parseEther("0.1")
                  const amountTOWithdraw = ethers.utils.parseEther("0.05")

                  await deployer.sendTransaction({
                      to: (await ethers.getContract("ExposedGame")).address,
                      value: amountTOSend,
                  })
                  await expect(game.withdraw(amountTOWithdraw)).to.not.be
                      .reverted

                  assert.equal(
                      (await game.provider.getBalance(game.address)).toString(),
                      amountTOSend - amountTOWithdraw
                  )
              })
          })

          describe("GenerateNumbers", async () => {
              it("Returns a random array", async () => {
                  const sortedArray = [...Array(deckLength).keys()] // [0, 1, 2, ..., 51]
                  const randomWords = await game._generateNumbers(seeds)
                  assert.notEqual(sortedArray, randomWords)
                  assert.equal(sortedArray.length, deckLength)
              })
              it("Returns an array of length 52", async () => {
                  const randomWords = await game._generateNumbers(seeds)
                  assert.equal(randomWords.length, deckLength)
              })
          })

          describe("Play", () => {
              it("Can't play with less than minimum amount", async () => {
                  const bet = (await game.getMinimumBet()) / 2
                  const indexChosen = 5
                  const playerGuess = 5
                  await expect(
                      game.play(blackOrRedGame, indexChosen, playerGuess, {
                          value: bet,
                      })
                  ).to.be.revertedWith("Game__Not_Enough_ETH")
              })

              it("Lets the request through if enough ETH is paid", async () => {
                  let bet = await game.getMinimumBet()
                  const indexChosen = 5
                  const playerGuess = 5
                  await expect(
                      game.play(blackOrRedGame, indexChosen, playerGuess, {
                          value: bet,
                      })
                  ).to.not.be.reverted
              })

              it("Emits a game ID", async () => {
                  const indexChosen = 5
                  const playerGuess = 5
                  const betAmount = (await game.getMinimumBet()) * 2
                  const gameType = 0
                  const amountToFund = ethers.utils.parseEther("1")
                  const requestId = 1

                  await new Promise(async (resolve, reject) => {
                      await deployer.sendTransaction({
                          to: (await ethers.getContract("ExposedGame")).address,
                          value: amountToFund,
                      })
                      game.once("GameId", (address, requestId) => {
                          try {
                              assert.equal(requestId.toString(), requestId)
                              assert.equal(
                                  address.toString(),
                                  deployer.address.toString()
                              )
                              resolve()
                          } catch (e) {
                              reject(e)
                          }
                      })
                      await game.play(gameType, indexChosen, playerGuess, {
                          value: betAmount,
                      })
                  })
              })
          })

          describe("shuffleDeck", () => {
              it("Returns an array of length 52", async () => {
                  const shuffledDeck = await game._shuffleDeck(seeds)
                  assert.equal(shuffledDeck.length, deckLength)
              })

              it("Returns a random array", async () => {
                  const shuffledDeck = await game._shuffleDeck(seeds)
                  assert.notEqual(shuffledDeck, [...Array(deckLength).keys()]) // check that the array isn't [0, 1, 2, ..., 51]
              })

              it("Returns a premutation from 0 to 51", async () => {
                  let shuffledDeck = await game._shuffleDeck(seeds)
                  let arrToSort = [...shuffledDeck]
                  arrToSort.sort((a, b) => {
                      return a - b
                  })
                  shuffledDeck = arrToSort
                  assert.deepEqual(shuffledDeck, [...Array(deckLength).keys()]) // check that the sorted array is [0, 1, 2, ..., 51]
              })
          })

          describe("fulfillRandomWords", () => {
              it("Cannot be called with nonexistent request IDs", async () => {
                  const firstRequestId = 0
                  const secondRequestId = 1
                  await expect(
                      game._fulfillRandomWords(firstRequestId, seeds)
                  ).to.be.revertedWith("Game__VRF_RequestId_Not_Found")
                  await expect(
                      game._fulfillRandomWords(secondRequestId, seeds)
                  ).to.be.revertedWith("Game__VRF_RequestId_Not_Found")
              })
          })
      })
