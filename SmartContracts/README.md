# Smart Contract

## Table of Contents

1. [ Development Setup ](#setup)
    1. [ Development ](#dev)
    2. [ Deployment ](#deploy)
        1. [ Locally ](#dep-local)
        2. [ Goerli ](#dep-goerli)
    3. [ Testing ](#test)
        1. [ Locally ](#test-local)
        2. [ Staging Tests on Goerli ](#test-goerli)
2. [ Code Explanation ](#exp)
3. [ .ENV Note ](#env)

---

<a name="setup"></a>

## Development Setup

<a name="dev"></a>

### Development

To start development on the smart contract just clone the repo then run:

```
cd "SmartContracts"
yarn
```

It will install all the dependencies and you can start development.

Note: The contract currently is only setup to be used locally on hardhat or to be deployed and used on the Goerli testnet.

<a name="deploy"></a>

### Deployment

<a name="dep-local"></a>

#### Locally

```
yarn hardhat deploy
```

This will compile and deploy the contract on a local node run by hardhat and shut the node down. You won't be actually able to interact with the contract locally this way.

If you intend to deploy the contract locally and interact with it, you need to run the following:

```
yarn hardhat node
```

It will spin up a local hardhat node and deploy the contract on it. You can then interact with the contract using your JS or TS scripts.

<a name="dep-goerli"></a>

#### Goerli

```
yarn hardhat deploy --network goerli
```

This will deploy the contract on Goerli and verify it if you've provided an Etherscan API key.

<a name="test"></a>

### Testing

<a name="test-local"></a>

#### Locally

```
yarn hardhat test
```

This will run all the unit and integration tests on a local hardhat node, report the results and shut the node down.

<a name="test-goerli"></a>

#### Staging Tests on Goerli

```
yarn hardhat test --network goerli
```

If the contract has been deployed on Goerli, this will run the staging tests on the contract. Keep in mind since this is basically just does normal blockchain transactions it will take a long time.

---

<a name="exp"></a>

## Code Explanation

There are 4 folders in "SmartContracts":

-   contracts: contains all smart contracts in this project.
-   deploy: contains all the JavaScript scripts to deploy the smart contracts and update the frontend.
-   test: contains all the tests for the smart contracts.
-   utils: contains all helper scripts.

"contracts" has 3 files in total, one of them is `VRFCoordinatorV2Mock.sol` which is a mock for the VRF (Verifiable Randomness Function) service from Chainlink. This file is provided by Chainlink and is only deployed and used on the local hardhat node to mock the VRF service.

Next, we have `Game.sol` this is the main contract which has all the functionality. It is well documented and the code is easy to understand. Please look at the source code if you want to understand the logic.

Finally, we have `ExposedGame.sol`. This contract inherits `Game.sol`, the only thing that it does, is that it overrides the non public functions of `Game.sol` and makes them public. This contract is used for testing purposes only. It exposes internal functions to the testing scripts.

"deploy" has 4 scripts, each one of them deploys one of the smart contracts except for `99-update-frontend.js`. When you run `yarn hardhat deploy` all of the scripts in the deploy folder will run. `00-deploy-mocks.js` checks for the network you're deploying on. It only deploys on a local network. `99-update-frontend.js` will update the abi and contract address (the address on the network you deployed on) for the frontend, since the frontend needs both information to work.

"test": has 3 testing scripts. When you run `yarn hardhat test` all of them will run. `staging` will only run the tests if you're not deploying on a local network. The other two will only work if you're deploying on a local network.

"utils": has a utility script that verifies your contract on Etherscan if you've provided an Etherscan API key and didn't deploy on a local network.

Finally, there are two files `hardhat.config.js` and `helper.config.js` that have important configurations for hardhat and some helper info.

---

<a name="env"></a>

## .ENV Note

Please note that the project needs a .env file that provides the following variables:

-   COINMARKETCAP_API_KEY: API key for CoinMarketCap if you want the gas reporter to provide values in USD.
-   GOERLI_RPC_URL: Your provider for a connection to the Goerli network (Alchemy for example).
-   ETHERSCAN_API_KEY: API key for Etherscan if you want verify your contract on Etherscan.
-   PRIVATE_KEY: The private key that you will use to connect to Goerli.
-   UPDATE_FRONT_END=true: Whether or not to update the abi and address contract for the frontend after deploying the contract. Takes a boolean value.
