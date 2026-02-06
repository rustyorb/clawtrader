import { Position, Trade } from '@/lib/types';
import { generateId } from '@/lib/utils';

export function openPosition(
  assetId: string,
  symbol: string,
  side: 'long' | 'short',
  quantity: number,
  price: number,
  stopLoss?: number,
  takeProfit?: number,
): Position {
  return {
    id: generateId(),
    assetId,
    symbol,
    side,
    entryPrice: price,
    quantity,
    currentPrice: price,
    stopLoss,
    takeProfit,
    openedAt: Date.now(),
  };
}

export function closePosition(position: Position, exitPrice: number): Trade {
  const pnl =
    position.side === 'long'
      ? (exitPrice - position.entryPrice) * position.quantity
      : (position.entryPrice - exitPrice) * position.quantity;

  const cost = position.entryPrice * position.quantity;
  const pnlPercent = cost !== 0 ? (pnl / cost) * 100 : 0;

  return {
    id: generateId(),
    assetId: position.assetId,
    symbol: position.symbol,
    side: position.side,
    entryPrice: position.entryPrice,
    exitPrice,
    quantity: position.quantity,
    pnl,
    pnlPercent,
    openedAt: position.openedAt,
    closedAt: Date.now(),
  };
}

export function calculatePositionPnl(position: Position): { pnl: number; pnlPercent: number } {
  const pnl =
    position.side === 'long'
      ? (position.currentPrice - position.entryPrice) * position.quantity
      : (position.entryPrice - position.currentPrice) * position.quantity;

  const cost = position.entryPrice * position.quantity;
  const pnlPercent = cost !== 0 ? (pnl / cost) * 100 : 0;

  return { pnl, pnlPercent };
}

export function shouldTriggerStopLoss(position: Position): boolean {
  if (position.stopLoss == null) return false;

  return position.side === 'long'
    ? position.currentPrice <= position.stopLoss
    : position.currentPrice >= position.stopLoss;
}

export function shouldTriggerTakeProfit(position: Position): boolean {
  if (position.takeProfit == null) return false;

  return position.side === 'long'
    ? position.currentPrice >= position.takeProfit
    : position.currentPrice <= position.takeProfit;
}
