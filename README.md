# Gambelous

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=plastic)](./LICENSE.md)

> Ethereum smart contract gambling game.

A smart contract that implements multiple games on the Ethereum blockchain plus the next.js frontend that goes with it. The contract allows users to bet Ether on the results of the games.

## Table of Contents

1. [ Tech Stack ](#tech)
   1. [ Backend ](#tech-backend)
   2. [ Frontend ](#tech-frontend)
2. [ Contract Address ](#address)
   1. [ Goerli ](#address-goerli)
3. [ Development Setup ](#dev)
   1. [Deploying the Contract](#dev-deploy)
   2. [Testing the Contract](#dev-test)
4. [ How to Use ](#howto)
5. [ Development Setup and Code Explanation ](#setup)
6. [ Current State of The Project ](#cur)
7. [ TODO ](#todo)
8. [ Contributing ](#contrib)
9. [ Acknowledgments ](#ack)

---

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

---

<a name="address"></a>

## Contract Address

<a name="address-goerli"></a>

### Goerli

[Etherscan link](https://goerli.etherscan.io/address/0xa710af3d0833fb7018c9c2a3365c3a44e29fd816)

```
0xA710Af3d0833FB7018c9C2A3365C3A44e29FD816
```

---

<a name="howto"></a>

## How to Use

The contract is currently deployed on Goerli and you can use it in multiple ways.

First, you can write your own scripts to interact with contract. You only need to get the abi and the contract address on Goerli to do so. You can obtain both by either going to the [ Etherscan ](#address-goerli) link or from the `constants` folder in the frontend directory.

Second, you can use the use the [ Etherscan ](#address-goerli) link and go to the contract tab and connect your wallet to manually call functions from the contract.

Finally, you can run the frontend which will automatically connect with the contract on Goerli and then open `localhost:3000` to interact with the contract using the UI.

---

<a name="setup"></a>

## Development Setup and Code Explanation

Each directory has its own readme file which will explain the code and how to use it.

---

<a name="cur"></a>

## Current state of the project

![Current state](https://img.shields.io/badge/Finished-green.svg?style=for-the-badge)
![Current state](https://img.shields.io/badge/Responding%20to%20Issues%20on%20GitHub-green.svg?style=for-the-badge)

There is a TODO list in this readme file. In the future I might consider finishing it.

Currently, I'm going to fix bugs and problems in the project but I won't extend or add features. Please if you find a problem, mention it on the issues page in the GitHub repo.

---

<a name="todo"></a>

## TODO

- Add documentation for the frontend
- Fix staging test
- Improve readme.md
- Add tests for frontend

---

<a name="contrib"></a>

## Contributing

1. Fork it (<https://github.com/Mahmood-Darwish/Gambelous/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<a name="ack"></a>

---

## Acknowledgments

I was able to implement this after taking [this course](https://github.com/smartcontractkit/full-blockchain-solidity-course-js). I own a lot of thanks to [Patrick Collins](https://github.com/PatrickAlphaC) for making the course. Check it out!
