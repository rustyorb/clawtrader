# ClawTrader

**Paper trading simulator for OpenClaw agents — Learn before you earn.**

ClawTrader is an OpenClaw-native trading simulator where AI agents practice trading with fake money before risking real capital. Train your agent, prove its edge, then graduate to live markets with confidence.

## Features

- **Paper Trading Engine** — Virtual portfolio with configurable starting balance, market/limit/stop-loss/take-profit orders
- **Real-Time Market Data** — Live crypto prices via CoinGecko API (free tier, no key required)
- **Interactive Charts** — TradingView-style candlestick charts powered by lightweight-charts v5
- **Position Tracking** — Open positions with live P&L calculations
- **Performance Metrics** — Win rate, Sharpe ratio, profit factor, max drawdown, and more
- **Trade History** — Full audit trail of every trade executed
- **Persistent State** — Portfolio and trades saved to localStorage via Zustand
- **Dark Mode** — Trading terminal aesthetic with emerald green / red P&L colors

## Screenshot

```
┌─────────────────────────────────────────────────────────────┐
│  ClawTrader                    [Portfolio: $10,247.83]  [Settings] │
├──────────────┬──────────────────────────────────────────────┤
│  WATCHLIST   │              CHART AREA                      │
│  BTC  $97.2K │         (TradingView-style)                  │
│  ETH  $3.1K  │    [1D] [1W] [1M] [3M] [1Y] [ALL]           │
│  + Add       │──────────────────────────────────────────────│
│              │  TRADE PANEL                                 │
│  POSITIONS   │  [BUY]  [SELL]  Amount: [____]  Type: [▼]   │
│  BTC Long    │  Stop-Loss: [____]  Take-Profit: [____]      │
│  +$127 (2.1%)│  [EXECUTE TRADE]                             │
│              │──────────────────────────────────────────────│
│  ETH Short   │  PERFORMANCE METRICS                         │
│  -$43 (-1.2%)│  Win Rate: 62%  |  Sharpe: 1.4  |  DD: -8%  │
│              │  Trades: 47     |  Profit Factor: 1.8        │
└──────────────┴──────────────────────────────────────────────┘
```

## Tech Stack

- **Framework:** Next.js 16 + React 19
- **Charts:** [lightweight-charts](https://github.com/nicedoc/lightweight-charts) v5 (TradingView open source)
- **State:** Zustand v5 with localStorage persistence
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Market Data:** CoinGecko API (free tier)
- **Language:** TypeScript

## Getting Started

```bash
# Clone
git clone https://github.com/rustyorb/clawtrader.git
cd clawtrader

# Install dependencies
npm ci

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start paper trading.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/market?symbol=bitcoin` | Get current price quote |
| `GET` | `/api/portfolio` | Get portfolio state |
| `POST` | `/api/trade` | Execute a paper trade |

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx            # Main trading dashboard
│   ├── layout.tsx          # Root layout
│   └── api/                # API routes (trade, portfolio, market)
├── components/             # React components
│   ├── chart.tsx           # Candlestick chart (lightweight-charts)
│   ├── watchlist.tsx       # Asset watchlist sidebar
│   ├── positions.tsx       # Open positions panel
│   ├── trade-panel.tsx     # Buy/sell order form
│   ├── metrics-panel.tsx   # Performance metrics display
│   ├── trade-history.tsx   # Trade history table
│   └── header.tsx          # Top navigation bar
└── lib/                    # Core logic
    ├── store.ts            # Zustand store (portfolio, trades, positions)
    ├── trading-engine.ts   # Paper trading execution engine
    ├── market-data.ts      # CoinGecko API client
    ├── metrics.ts          # Performance calculations
    └── types.ts            # TypeScript type definitions
```

## Roadmap

- [x] Paper trading engine with order types
- [x] Real-time crypto prices (CoinGecko)
- [x] Interactive candlestick charts
- [x] Position tracking with live P&L
- [x] Performance metrics dashboard
- [x] Trade history
- [x] LocalStorage persistence
- [ ] Backtesting engine
- [ ] OpenClaw agent API integration
- [ ] Stock market data support
- [ ] Strategy templates
- [ ] Leaderboards
- [ ] Export reports

## Part of the OpenClaw Ecosystem

ClawTrader is built for [OpenClaw](https://github.com/s1nthagent/openclaw), the local-first AI agent framework. It's designed so agents like ClawdBot and MoltBot can practice trading strategies safely before deploying with real capital.

## Disclaimer

For educational and simulation purposes only. Not financial advice. Paper trading results do not guarantee real trading performance.

## License

[MIT](LICENSE)
