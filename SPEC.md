# ClawTrader — Learn Before You Earn 🦞📈

An OpenClaw-native trading simulator where AI agents learn before they earn.

## Vision

Paper trading platform built for OpenClaw agents. Users train and tune their agents on simulated markets, prove edge with fake money, then graduate to real trading with confidence.

## Target Users

1. **OpenClaw users** — Want to test trading agents without risking real money
2. **Agent developers** — Need to validate strategies before deployment
3. **Curious traders** — Want AI assistance in learning markets

## Core Features

### 1. Paper Trading Engine
- Virtual portfolio with configurable starting balance ($1K - $1M)
- Real-time market data (stocks, crypto, forex)
- Support for: Market orders, Limit orders, Stop-loss, Take-profit
- Position tracking with live P&L
- Trade history with full audit trail

### 2. Agent Training Mode
- Connect OpenClaw agent via API key or skill
- Agent executes trades autonomously
- Track performance metrics:
  - Win rate
  - Profit factor
  - Sharpe ratio
  - Max drawdown
  - Average trade duration
  - Risk-adjusted returns

### 3. Strategy Backtesting
- Replay historical data (1Y, 5Y, max)
- Fast-forward simulation (1x, 10x, 100x speed)
- Compare strategy variants side-by-side
- Identify optimal parameters

### 4. Confidence Threshold System
- Set graduation criteria (e.g., "60% win rate over 100 trades")
- Visual progress toward goals
- "Ready for Real" badge when thresholds met
- Optional: Connect to real exchange when confident

### 5. OpenClaw Integration
- REST API for agent communication
- OpenClaw skill for native integration
- Webhook notifications (trade executed, target hit, etc.)
- MCP server option for Claude Desktop users

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ClawTrader                    [Portfolio: $10,247.83]  [⚙️] │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  WATCHLIST   │              CHART AREA                      │
│  ──────────  │         (TradingView-style)                  │
│  BTC  $97.2K │                                              │
│  ETH  $3.1K  │    [1D] [1W] [1M] [3M] [1Y] [ALL]           │
│  AAPL $182   │                                              │
│  TSLA $248   │                                              │
│              │                                              │
│  + Add       │──────────────────────────────────────────────│
│              │  TRADE PANEL                                 │
├──────────────┤  [BUY]  [SELL]  Amount: [____]  Type: [▼]   │
│              │  Stop-Loss: [____]  Take-Profit: [____]      │
│  POSITIONS   │  [EXECUTE TRADE]                             │
│  ──────────  │──────────────────────────────────────────────│
│  BTC Long    │  PERFORMANCE METRICS                         │
│  +$127 (2.1%)│  Win Rate: 62%  |  Sharpe: 1.4  |  DD: -8%  │
│              │  Trades: 47     |  Profit Factor: 1.8        │
│  ETH Short   │──────────────────────────────────────────────│
│  -$43 (-1.2%)│  TRADE HISTORY                               │
│              │  [✓] BTC Buy $95K → Sell $97K (+2.1%)        │
│              │  [✗] ETH Short $3.2K → Stop hit (-1.2%)      │
│              │  [✓] AAPL Buy $178 → Sell $182 (+2.2%)       │
└──────────────┴──────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, shadcn/ui
- **Charts:** Lightweight-charts (TradingView open source) or Recharts
- **State:** Zustand with persist (localStorage)
- **Data:** 
  - Stocks: Yahoo Finance API (free)
  - Crypto: CoinGecko API (free tier)
  - Forex: Exchange rates API
- **Backend:** Next.js API routes
- **Real-time:** WebSocket for live prices (optional, can poll)

## File Structure

```
src/
├── app/
│   ├── page.tsx                 # Main trading dashboard
│   ├── layout.tsx               # Root layout with providers
│   ├── backtest/page.tsx        # Backtesting interface
│   ├── history/page.tsx         # Trade history & analytics
│   ├── settings/page.tsx        # Configuration
│   └── api/
│       ├── trade/route.ts       # Execute paper trades
│       ├── portfolio/route.ts   # Get portfolio state
│       ├── market/route.ts      # Fetch market data
│       ├── backtest/route.ts    # Run backtests
│       └── agent/route.ts       # OpenClaw agent integration
├── components/
│   ├── chart.tsx                # Price chart component
│   ├── watchlist.tsx            # Asset watchlist
│   ├── positions.tsx            # Open positions
│   ├── trade-panel.tsx          # Buy/sell interface
│   ├── metrics.tsx              # Performance dashboard
│   ├── history.tsx              # Trade history table
│   └── ui/                      # shadcn components
├── lib/
│   ├── store.ts                 # Zustand store
│   ├── types.ts                 # TypeScript types
│   ├── trading-engine.ts        # Paper trading logic
│   ├── market-data.ts           # Data fetching
│   ├── backtest.ts              # Backtesting engine
│   ├── metrics.ts               # Performance calculations
│   └── agent-api.ts             # OpenClaw integration
└── styles/
    └── globals.css              # Global styles + dark theme
```

## Color Scheme (Dark Mode)

- Background: #0a0a0a (near black)
- Surface: #141414
- Border: #262626
- Primary: #10b981 (emerald green - profit)
- Danger: #ef4444 (red - loss)
- Accent: #f97316 (orange - OpenClaw brand)
- Text: #fafafa
- Muted: #a1a1aa

## API Endpoints

### Trading
- `POST /api/trade` — Execute paper trade
- `GET /api/portfolio` — Get current portfolio
- `GET /api/positions` — Get open positions
- `GET /api/history` — Get trade history

### Market Data
- `GET /api/market/quote?symbol=BTC` — Get current price
- `GET /api/market/history?symbol=BTC&range=1Y` — Get historical data
- `GET /api/market/search?q=tesla` — Search symbols

### Agent Integration
- `POST /api/agent/connect` — Connect OpenClaw agent
- `POST /api/agent/trade` — Agent executes trade
- `GET /api/agent/status` — Get agent performance
- `POST /api/agent/webhook` — Register webhook URL

### Backtesting
- `POST /api/backtest/run` — Run backtest with strategy
- `GET /api/backtest/results/:id` — Get backtest results

## OpenClaw Skill (Future)

```yaml
name: clawtrader
description: Paper trading for OpenClaw agents
commands:
  - trade: Execute a paper trade
  - portfolio: Get current portfolio
  - metrics: Get performance metrics
  - history: Get trade history
```

## MVP Scope (Phase 1)

Focus on core paper trading:
1. ✅ Dashboard with chart and trade panel
2. ✅ Paper trading engine (buy/sell/stop-loss)
3. ✅ Real-time crypto prices (CoinGecko)
4. ✅ Position tracking with P&L
5. ✅ Basic performance metrics
6. ✅ Trade history
7. ✅ LocalStorage persistence

## Phase 2 (Post-MVP)
- Backtesting engine
- OpenClaw API integration
- Stock market data
- Strategy templates
- Leaderboards
- Export reports

## Tagline

**ClawTrader — Learn before you earn.** 🦞

## Disclaimer

For educational and simulation purposes only. Not financial advice. 
Paper trading results do not guarantee real trading performance.
