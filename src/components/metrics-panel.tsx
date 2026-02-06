'use client';

import { useTradingStore } from '@/lib/store';
import { calculateMetrics } from '@/lib/metrics';

export default function MetricsPanel() {
  const { trades, cashBalance, positions } = useTradingStore();

  const positionsValue = positions.reduce(
    (sum, p) => sum + p.currentPrice * p.quantity,
    0,
  );
  const metrics = calculateMetrics(trades, cashBalance, positionsValue);

  const items = [
    {
      label: 'Win Rate',
      value: `${metrics.winRate.toFixed(1)}%`,
      color: metrics.winRate > 50 ? 'text-emerald-500' : metrics.winRate > 0 ? 'text-red-500' : 'text-[#fafafa]',
    },
    {
      label: 'Sharpe Ratio',
      value: metrics.sharpeRatio.toFixed(2),
      color: metrics.sharpeRatio > 1 ? 'text-emerald-500' : metrics.sharpeRatio > 0 ? 'text-[#fafafa]' : 'text-red-500',
    },
    {
      label: 'Max Drawdown',
      value: `${metrics.maxDrawdown.toFixed(1)}%`,
      color: 'text-red-500',
    },
    {
      label: 'Total Trades',
      value: metrics.totalTrades.toString(),
      color: 'text-[#fafafa]',
    },
    {
      label: 'Profit Factor',
      value: metrics.profitFactor.toFixed(2),
      color: metrics.profitFactor > 1 ? 'text-emerald-500' : 'text-red-500',
    },
  ];

  return (
    <div className="flex items-center gap-4 border-t border-[#262626] bg-[#141414] px-4 py-2">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <div className="text-xs text-[#a1a1aa]">{item.label}</div>
          <div className={`text-sm font-bold ${item.color}`}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
