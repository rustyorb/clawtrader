#!/bin/bash
# ClawTrader: Get performance metrics
# Usage: metrics.sh

set -e

CLAWTRADER_URL="${CLAWTRADER_URL:-http://localhost:3000}"

RESPONSE=$(curl -s "$CLAWTRADER_URL/api/portfolio")

if command -v jq &> /dev/null; then
  # Extract and format metrics
  echo "$RESPONSE" | jq -r '
    "Performance Metrics",
    "==================",
    "Win Rate: \(.metrics.winRate // 0)%",
    "Total Trades: \(.metrics.totalTrades // 0)",
    "Profit Factor: \(.metrics.profitFactor // 0)",
    "Sharpe Ratio: \(.metrics.sharpeRatio // 0)",
    "Max Drawdown: \(.metrics.maxDrawdown // 0)%"
  '
else
  echo "$RESPONSE"
fi
