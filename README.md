# Gambling Game

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=plastic)](./LICENSE.md)

> Ethereum smart contract gambling game.

A smart contract that implements multiple games on the Ethereum blockchain plus the next.js frontend that goes with it. The contract allows users to bet Ether on the results of the games.

## Tech stack

### Backend

![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)
![Chainlink](https://img.shields.io/badge/Chainlink-375BD2?style=for-the-badge&logo=Chainlink&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-yellow.svg?style=for-the-badge)

### Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Pico](https://img.shields.io/badge/Pico.CSS-gray.svg?style=for-the-badge)

## Development setup

To start developing on the smart contract just clone the repo then run:

```
cd "smart contracts"
yarn
```

It will install all the dependencies and you can start developing.

Note: The contract currently is only setup to be used locally on hardhat or to be deployed and used on the Goerli testnet.

### Deploying the contract

#### Locally

```
yarn hardhat deploy
```

#### Goerli

```
yarn hardhat deploy --network goerli
```

### Testing the contract

#### Locally

```
yarn hardhat test
```

#### Staging tests on Goerli

```
yarn hardhat test --network goerli
```

## Current state of the project

### `Under active development`

The smart contract is all but ready, as for the frontend I haven't started implementing it yet.

I plan to expand the tests on the smart contract and add proper documentation. After that is finished I will start working on the frontend.

The finished version of this project should have a backend and frontend that work seamlessly with each other.

## TODO

- Fix staging test
- Improve readme.md

## Contributing

1. Fork it (<https://github.com/Mahmood-Darwish/gambling-game/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
