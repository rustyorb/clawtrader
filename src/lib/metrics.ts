import { Trade, PortfolioMetrics } from '@/lib/types';

export function calculateMetrics(
  trades: Trade[],
  cashBalance: number,
  positionsValue: number,
): PortfolioMetrics {
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.pnl > 0).length;
  const losingTrades = trades.filter((t) => t.pnl < 0).length;

  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  const grossProfit = trades.reduce((sum, t) => sum + (t.pnl > 0 ? t.pnl : 0), 0);
  const grossLoss = trades.reduce((sum, t) => sum + (t.pnl < 0 ? Math.abs(t.pnl) : 0), 0);
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const totalValue = cashBalance + positionsValue;
  const startingBalance = 10000;
  const totalPnlPercent = (totalPnl / startingBalance) * 100;

  const sharpeRatio = calculateSharpe(trades);
  const maxDrawdown = calculateMaxDrawdown(trades, startingBalance);

  return {
    totalValue,
    cashBalance,
    positionsValue,
    totalPnl,
    totalPnlPercent,
    winRate,
    profitFactor: isFinite(profitFactor) ? profitFactor : 0,
    sharpeRatio,
    maxDrawdown,
    totalTrades,
    winningTrades,
    losingTrades,
  };
}

function calculateSharpe(trades: Trade[]): number {
  if (trades.length < 2) return 0;

  const returns = trades.map((t) => t.pnlPercent / 100);
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / (returns.length - 1);
  const stddev = Math.sqrt(variance);

  if (stddev === 0) return 0;

  return (mean / stddev) * Math.sqrt(252);
}

function calculateMaxDrawdown(trades: Trade[], startingBalance: number): number {
  if (trades.length === 0) return 0;

  const sorted = [...trades].sort((a, b) => a.closedAt - b.closedAt);

  let equity = startingBalance;
  let peak = startingBalance;
  let maxDd = 0;

  for (const trade of sorted) {
    equity += trade.pnl;
    if (equity > peak) peak = equity;
    const dd = peak > 0 ? ((peak - equity) / peak) * 100 : 0;
    if (dd > maxDd) maxDd = dd;
  }

  return maxDd;
}
