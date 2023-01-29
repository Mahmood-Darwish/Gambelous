# Gambelous

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=plastic)](./LICENSE.md)

> Ethereum smart contract gambling game.

A smart contract that implements multiple games on the Ethereum blockchain plus the next.js frontend that goes with it. The contract allows users to bet Ether on the results of the games.

## Table of Contents

1. [ Tech Stack ](#tech)
   1. [ Backend ](#tech-backend)
   2. [ Frontend ](#tech-frontend)
2. [ Contract address ](#address)
   1. [ Goerli ](#address-goerli)
3. [ Development setup ](#dev)
   1. [Deploying the contract](#dev-deploy)
   2. [Testing the contract](#dev-test)
4. [ Current state of the project ](#cur)
5. [ TODO ](#todo)
6. [ Contributing ](#contrib)
7. [ Acknowledgments ](#ack)

<a name="tech"></a>

## Tech stack

<a name="tech-backend"></a>

### Backend

![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)
![Chainlink](https://img.shields.io/badge/Chainlink-375BD2?style=for-the-badge&logo=Chainlink&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-yellow.svg?style=for-the-badge)

<a name="tech-frontend"></a>

### Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
<img src="frontend/public/wagmi.jpg" width="50" height="31" alt="Wagmi">
<img src="frontend/public/milligram.jpg" width="40" height="40" alt="Milligram">

<a name="address"></a>

## Contract address

<a name="address-goerli"></a>

### Goerli

[Etherscan link](https://goerli.etherscan.io/address/0xa710af3d0833fb7018c9c2a3365c3a44e29fd816)

```
0xA710Af3d0833FB7018c9C2A3365C3A44e29FD816
```

<a name="dev"></a>

## Development setup

To start developing on the smart contract just clone the repo then run:

```
cd "SmartContracts"
yarn
```

It will install all the dependencies and you can start developing.

Note: The contract currently is only setup to be used locally on hardhat or to be deployed and used on the Goerli testnet.

<a name="dev-deploy"></a>

### Deploying the contract

#### Locally

```
yarn hardhat deploy
```

#### Goerli

```
yarn hardhat deploy --network goerli
```

<a name="dev-test"></a>

### Testing the contract

#### Locally

```
yarn hardhat test
```

#### Staging tests on Goerli

```
yarn hardhat test --network goerli
```

<a name="cur"></a>

## Current state of the project

![Current state](https://img.shields.io/badge/Under%20Active%20Development-green.svg?style=for-the-badge)

The smart contract is finished. The frontend still needs a lot of work.

Currently, the frontend is finished but it's not connected to smart contract. It also needs styling.

And finally, I need to make tests for the frontend.

<a name="todo"></a>

## TODO

- Fix staging test
- Improve readme.md
- Add tests for frontend

<a name="contrib"></a>

## Contributing

1. Fork it (<https://github.com/Mahmood-Darwish/Gambelous/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<a name="ack"></a>

## Acknowledgments

I was able to implement this after taking [this course](https://github.com/smartcontractkit/full-blockchain-solidity-course-js). I own a lot of thanks to [Patrick Collins](https://github.com/PatrickAlphaC) for making the course. Check it out!
