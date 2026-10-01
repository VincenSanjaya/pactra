# Pactra

Work. Verify. Get paid.

AI-assisted onchain escrow for freelancers and clients, powered by milestone-based mUSDC payments on Arbitrum Sepolia.

## What is Pactra?

Pactra helps freelancers and clients reduce payment risk using milestone-based escrow.

Clients define milestones and lock funds into a smart contract. Freelancers submit their work, and Pactra AI assists the client by reviewing the submission against the milestone requirements.

The AI is advisory only. It never controls or releases funds. The client always makes the final payment decision.

## Core Flow

1. Client connects wallet
2. Client creates a Pact
3. Client adds milestone requirements
4. Client funds escrow with mUSDC
5. Freelancer submits work
6. Pactra AI reviews the submission
7. Client requests revision or approves
8. Smart contract releases payment to the freelancer

## Features

- Onchain milestone escrow
- Arbitrum Sepolia deployment
- Mock USDC payments
- Freelancer submission workflow
- Revision request flow
- AI-assisted milestone review
- Manual client approval
- Automatic milestone payment release
- Demo mUSDC faucet
- Wallet role detection
- Transaction links to Arbiscan

## Architecture

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- wagmi
- viem
- RainbowKit

Smart Contracts:
- Solidity
- Foundry
- OpenZeppelin

Blockchain:
- Arbitrum Sepolia

AI:
- Gemini API
- Structured milestone review

## Smart Contracts

Network: Arbitrum Sepolia

Chain ID:

```text
421614
