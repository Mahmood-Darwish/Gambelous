require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const MAINNET_RPC_URL = "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const GOERLI_RPC_URL = "https://eth-goerli.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY = ""
const ETHERSCAN_API_KEY = "Your etherscan API key"
const REPORT_GAS = false

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        localhost: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        /*goerli: {
            url: GOERLI_RPC_URL,
            accounts:
                PRIVATE_KEY !== undefined
                    ? [PRIVATE_KEY]
                    : [],
            saveDeployments: true,
            chainId: 5,
            blockConfirmations: 6
        },
        mainnet: {
            url: MAINNET_RPC_URL,
            accounts:
                PRIVATE_KEY !== undefined
                    ? [PRIVATE_KEY]
                    : [],
            saveDeployments: true,
            chainId: 1,
            blockConfirmations: 6
        },*/
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            goerli: ETHERSCAN_API_KEY,
        },
        customChains: [
            {
                network: "goerli",
                chainId: 5,
                urls: {
                    apiURL: "https://api-goerli.etherscan.io/api",
                    browserURL: "https://goerli.etherscan.io",
                },
            },
        ],
    },
    gasReporter: {
        enabled: REPORT_GAS,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: false,
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    contractSizer: {
        runOnCompile: false,
        only: ["Game"],
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        player: {
            default: 1,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
        ],
    },
    mocha: {
        timeout: 500000, // 500 seconds max for running tests
    },
}
