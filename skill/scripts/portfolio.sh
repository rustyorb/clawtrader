#!/bin/bash
# ClawTrader: Get portfolio status
# Usage: portfolio.sh

set -e

CLAWTRADER_URL="${CLAWTRADER_URL:-http://localhost:3000}"

RESPONSE=$(curl -s "$CLAWTRADER_URL/api/portfolio")

if command -v jq &> /dev/null; then
  echo "$RESPONSE" | jq .
else
  echo "$RESPONSE"
fi
