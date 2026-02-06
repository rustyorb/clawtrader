#!/bin/bash
# ClawTrader: Get trade history
# Usage: history.sh [--limit=N]

set -e

CLAWTRADER_URL="${CLAWTRADER_URL:-http://localhost:3000}"
LIMIT=10

# Parse flags
for arg in "$@"; do
  case $arg in
    --limit=*)
      LIMIT="${arg#*=}"
      ;;
  esac
done

RESPONSE=$(curl -s "$CLAWTRADER_URL/api/portfolio")

if command -v jq &> /dev/null; then
  echo "$RESPONSE" | jq -r ".trades | .[-$LIMIT:] | reverse | .[] | \"\(.timestamp) | \(.action | ascii_upcase) \(.symbol) | Qty: \(.quantity) | P&L: \(.pnl // \"pending\")\""
else
  echo "$RESPONSE"
fi
