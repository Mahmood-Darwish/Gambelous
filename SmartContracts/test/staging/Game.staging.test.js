const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper.config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Game staging tests", () => {
          let game, deployer

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              game = await ethers.getContract("Game", deployer)
          })

          describe("play", () => {
              it("Emits A game result", async () => {
                  const indexChosen = 5
                  const playerGuess = 5
                  const gameType = 0

                  return new Promise(async (resolve, reject) => {
                      game.once("GameResult", async () => {
                          console.log("Caught it!!!")
                          try {
                              resolve()
                          } catch (e) {
                              reject(e)
                          }
                      })
                      console.log("Getting bet...")
                      let bet = await game.getMinimumBet()
                      console.log("Playing Game...")
                      const tx = await game.play(
                          gameType,
                          indexChosen,
                          playerGuess,
                          {
                              value: bet,
                          }
                      )
                      console.log("Waiting for transaction...")
                      await tx.wait(1)
                      console.log("Ok, time to wait...")
                  })
              })
          })
      })
