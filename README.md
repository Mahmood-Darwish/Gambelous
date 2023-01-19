# Gambling Game

> Ethereum smart contract gambling game.

A smart contract that implements multiple games on the Ethereum blockchain plus the next.js frontend that goes with it. The contract allows users to bet Ether on the results of the games.

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
- Expand unit tests
- Update tests to use constants instead of literals everywhere
- Add natspec documentation
- Fix name casing everywhere
- Improve readme.md

## Contributing

1. Fork it (<https://github.com/Mahmood-Darwish/gambling-game/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License

See `LICENSE.md`
