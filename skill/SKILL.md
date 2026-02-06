# ClawTrader Skill

> Paper trading for OpenClaw agents. Learn before you earn. 🦞📈

## Description

ClawTrader is a paper trading simulator that lets OpenClaw agents practice trading crypto without risking real money. Track performance, analyze metrics, and build confidence before going live.

## Requirements

- ClawTrader server running (default: http://localhost:3000)
- `curl` and `jq` installed

## Configuration

Set the ClawTrader server URL (defaults to localhost):
```bash
export CLAWTRADER_URL="http://localhost:3000"
```

## Commands

### trade
Execute a paper trade (buy or sell).

```bash
# Buy 0.5 BTC at market price
bash scripts/trade.sh buy bitcoin 0.5

# Buy with stop-loss and take-profit
bash scripts/trade.sh buy bitcoin 0.5 --stop-loss=90000 --take-profit=110000

# Sell position
bash scripts/trade.sh sell bitcoin 0.5
```

### portfolio
Get current portfolio status.

```bash
bash scripts/portfolio.sh

# Output:
# Balance: $10,247.83
# Positions: 2
# Total P&L: +$247.83 (+2.5%)
```

### metrics
Get performance metrics.

```bash
bash scripts/metrics.sh

# Output:
# Win Rate: 62%
# Total Trades: 47
# Profit Factor: 1.8
# Sharpe Ratio: 1.4
# Max Drawdown: -8.2%
```

### history
Get trade history.

```bash
# Last 10 trades
bash scripts/history.sh

# Last N trades
bash scripts/history.sh --limit=20
```

## Example Workflow

```bash
# 1. Check portfolio
bash scripts/portfolio.sh

# 2. Buy some BTC
bash scripts/trade.sh buy bitcoin 0.1 --stop-loss=95000

# 3. Check positions
bash scripts/portfolio.sh

# 4. Review performance
bash scripts/metrics.sh

# 5. Sell when ready
bash scripts/trade.sh sell bitcoin 0.1
```

## API Endpoints

The skill wraps these ClawTrader API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/trade` | POST | Execute trades |
| `/api/portfolio` | GET | Get portfolio state |
| `/api/market?action=quotes` | GET | Get price quotes |

## Installation

1. Clone or copy the skill to your OpenClaw skills directory
2. Start ClawTrader: `cd clawtrader && npm run dev`
3. Use the commands above

## Links

- **GitHub:** https://github.com/rustyorb/clawtrader
- **ClawHub:** (coming soon)

## License

MIT
