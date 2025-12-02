# SwipeStakes

A developer-friendly starter kit for building prediction market applications on [Myriad Protocol](https://myriadprotocol.com) and [Abstract](https://abs.xyz).

## Features

- **Swipe Interface** - Tinder-style card stack for browsing and betting on markets
- **Quick Bets** - One-tap betting with fixed amounts (default $5 USDC)
- **Market Details** - View outcomes, price charts, and trading history
- **Trading** - Buy and sell outcome shares with real-time quotes
- **Portfolio** - Track positions, P&L, and claim winnings
- **Wallet Support** - Abstract Global Wallet (AGW) for seamless onboarding
- **Mock Data Mode** - Development mode with realistic mock markets
- **Abstract Mainnet** - Production-ready on Abstract (Chain ID: 2741)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Wallet**: Abstract Global Wallet (AGW) + wagmi + viem
- **Data**: TanStack Query + Myriad REST API
- **Smart Contracts**: polkamarkets-js SDK

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/myriad-starter-kit.git
cd myriad-starter-kit
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Edit `.env.local` with your values:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_MYRIAD_API_KEY` | Myriad API key ([contact Myriad](https://myriadprotocol.com)) | Yes* |
| `NEXT_PUBLIC_REFERRAL_CODE` | Your referral code for revenue sharing | Optional |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Enable mock data mode for development (`true`/`false`) | Optional |

\* Required when `NEXT_PUBLIC_USE_MOCK_DATA` is not set to `true`

### 4. Start development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js App                              │
├─────────────────────────────────────────────────────────────────┤
│  Pages                                                          │
│  ├── / (Swipe interface - Tinder-style market browsing)        │
│  ├── /markets/[slug] (Market detail + trading)                  │
│  └── /portfolio (User positions)                                │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                      │
│  ├── TanStack Query (caching, loading states)                   │
│  ├── Myriad REST API (market data, quotes)                      │
│  ├── Mock Data (development mode)                               │
│  └── polkamarkets-js SDK (on-chain transactions)                │
├─────────────────────────────────────────────────────────────────┤
│  Wallet Layer                                                    │
│  ├── Abstract Global Wallet (connection UI)                     │
│  ├── wagmi (React hooks)                                        │
│  └── viem (blockchain interactions)                             │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
config/
  chain.ts            # Chain configuration (Abstract mainnet/testnet)
  wagmi.ts            # Wallet configuration

lib/
  config.ts           # Network config, contract addresses, tokens
  myriad-api.ts       # REST API client
  myriad-sdk.ts       # polkamarkets-js wrapper
  network-context.tsx # Network configuration provider
  bet-settings-context.tsx # Quick bet amount configuration
  mock-data.ts        # Mock market data for development
  queries/            # TanStack Query options
  mutations/          # Trade/claim mutations
  types/              # TypeScript interfaces

components/
  layout/             # Header, navigation
  swipe/              # Swipe interface components
  markets/            # Market list, cards, filters
  market/             # Detail page components
  portfolio/          # Position cards, summary
  ui/                 # shadcn primitives

app/
  page.tsx            # Swipe interface (main page)
  markets/[slug]/     # Market detail
  portfolio/          # User portfolio
  api/mock-markets/   # Mock data API endpoint
```

## Customization Guide

### Theming

The starter kit uses shadcn/ui with a neutral theme. Customize in:

- `app/globals.css` - CSS variables for colors, radius, etc.
- `components/agw-provider.tsx` - Abstract Global Wallet provider configuration

### Adding Networks

To add support for other Myriad-supported chains (Linea, BNB Chain):

1. Update `NETWORK` config in `lib/config.ts` (chain ID, RPC URL, block explorer)
2. Add chain to `config/wagmi.ts` transports
3. Update `config/chain.ts` to export the new chain
4. The network context will automatically use the updated configuration

### Swipe Interface

The main page (`app/page.tsx`) features a Tinder-style swipe interface:
- Card stack with gesture-based navigation
- Quick bet buttons (Yes/No) with fixed amounts
- Card flip for market details
- Filter by category and sort order
- Aurora background effect

Customize the quick bet amount in `lib/config.ts`:
```typescript
export const QUICK_BET_AMOUNT = 5; // USDC amount
```

### Mock Data Mode

For development without an API key, enable mock data:
```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
```

This provides realistic mock markets for testing the UI and trading flows.

### Custom Components

All components follow a consistent pattern:
- Located in `components/` directory
- TypeScript interfaces for props
- JSDoc comments explaining usage

## Key Files Explained

### `config/wagmi.ts`
Wagmi client configuration with:
- Chain setup (Abstract mainnet)
- Abstract Global Wallet connector
- HTTP transports for RPC

### `lib/config.ts`
Central configuration file with:
- Network settings (RPC URL, chain ID: 2741 for Abstract mainnet)
- Contract addresses (PredictionMarket, PredictionMarketQuerier)
- Token addresses (USDC.e, PENGU, PTS)
- API endpoint configuration
- Quick bet amount (default: $5 USDC)
- Mock data toggle

### `lib/myriad-api.ts`
Typed REST API client with functions for:
- `getMarkets()` - List markets with filters
- `getMarket()` - Single market with price charts
- `getQuote()` - Trade quotes with calldata
- `getClaim()` - Claim calldata for winnings
- `getUserPortfolio()` - User positions
- `getUserEvents()` - User activity history

### `lib/queries/`
TanStack Query options factories using the `queryOptions` pattern:
- Type-safe query keys
- Automatic caching configuration
- Easy to compose and extend

### `lib/mutations/`
TanStack Query mutations for transactions:
- `useTrade()` - Buy/sell with approval flow
- `useClaim()` - Claim winnings

## API Reference

The starter kit uses the Myriad Protocol REST API v2:

- **Base URL**: `https://api-v2.myriadprotocol.com`

Key endpoints used:
- `GET /markets` - List markets
- `GET /markets/:slug` - Market details
- `POST /markets/quote` - Trade quotes
- `POST /markets/claim` - Claim calldata
- `GET /users/:address/portfolio` - User positions
- `GET /users/:address/events` - User activity

[Full API Documentation](https://docs.myriadprotocol.com)

## Revenue Sharing

Builders can earn a percentage of buy volume through Myriad's referral program:

1. **Apply for whitelisting** - Contact Myriad team
2. **Get your referral code** - Short ASCII string
3. **Configure the starter kit** - Set `NEXT_PUBLIC_REFERRAL_CODE`

When configured, all buy transactions automatically use `referralBuy` to attribute trades to your code.

Eligible trades: Markets with `distributor_fee > 0`

## Smart Contracts

### Abstract Mainnet (Chain ID: 2741)

| Contract | Address |
|----------|---------|
| PredictionMarket | `0x3e0F5F8F5Fb043aBFA475C0308417Bf72c463289` |
| PredictionMarketQuerier | `0x1d5773Cd0dC74744C1F7a19afEeECfFE64f233Ff` |

### Supported Tokens

| Token | Address | Decimals |
|-------|---------|----------|
| USDC.e | `0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1` | 6 |
| PENGU | `0x9eBe3A824Ca958e4b3Da772D2065518F009CBa62` | 18 |
| PTS | `0x0b07cf011b6e2b7e0803b892d97f751659940f23` | 18 |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details.

## Credits to

https://github.com/jarrodwatts/myriad-starter-kit

## Resources

- [Myriad Protocol](https://myriadprotocol.com)
- [Abstract](https://abs.xyz)
- [Myriad API Docs](https://docs.myriadprotocol.com)
- [polkamarkets-js](https://github.com/polkamarkets/polkamarkets-js)
