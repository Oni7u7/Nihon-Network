# Nihon-Network

A Next.js application for interacting with ERC20 tokens on the Ethereum blockchain.

## Features

- View token information (name, symbol, decimals, total supply)
- Connect MetaMask wallet
- View token balance
- Transfer tokens to other addresses

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update the configuration:
- Open `src/config.ts`
- Replace `YOUR_INFURA_PROJECT_ID` with your actual Infura project ID
- Update `SENDER_ADDRESS` and `SPENDER_ADDRESS` if needed

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Requirements

- MetaMask browser extension
- Ethereum network connection
- Infura project ID (for mainnet access)

## Security Notes

- Never commit your private keys or sensitive information
- Always verify transactions before signing
- Use test networks for testing purposes

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- ethers.js
- MetaMask
