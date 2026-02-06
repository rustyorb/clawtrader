#!/bin/bash
# ClawTrader: Execute paper trade
# Usage: trade.sh <buy|sell> <asset_id> <quantity> [--stop-loss=X] [--take-profit=X]

set -e

CLAWTRADER_URL="${CLAWTRADER_URL:-http://localhost:3000}"

ACTION="${1:-}"
ASSET_ID="${2:-}"
QUANTITY="${3:-}"
STOP_LOSS=""
TAKE_PROFIT=""

# Parse optional flags
for arg in "${@:4}"; do
  case $arg in
    --stop-loss=*)
      STOP_LOSS="${arg#*=}"
      ;;
    --take-profit=*)
      TAKE_PROFIT="${arg#*=}"
      ;;
  esac
done

if [[ -z "$ACTION" || -z "$ASSET_ID" || -z "$QUANTITY" ]]; then
  echo "Usage: trade.sh <buy|sell> <asset_id> <quantity> [--stop-loss=X] [--take-profit=X]"
  echo "Example: trade.sh buy bitcoin 0.5 --stop-loss=90000 --take-profit=110000"
  exit 1
fi

# Build JSON payload
PAYLOAD=$(cat <<ENDJSON
{
  "action": "$ACTION",
  "assetId": "$ASSET_ID",
  "quantity": $QUANTITY
ENDJSON
)

if [[ -n "$STOP_LOSS" ]]; then
  PAYLOAD="${PAYLOAD}, \"stopLoss\": $STOP_LOSS"
fi

if [[ -n "$TAKE_PROFIT" ]]; then
  PAYLOAD="${PAYLOAD}, \"takeProfit\": $TAKE_PROFIT"
fi

PAYLOAD="${PAYLOAD}}"

# Execute trade
RESPONSE=$(curl -s -X POST "$CLAWTRADER_URL/api/trade" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Pretty print response
if command -v jq &> /dev/null; then
  echo "$RESPONSE" | jq .
else
  echo "$RESPONSE"
fi
