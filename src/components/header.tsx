'use client';

import { useTradingStore } from '@/lib/store';
import { calculateMetrics } from '@/lib/metrics';
import { formatUSD, formatPercent, pnlColor } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

export default function Header() {
  const { cashBalance, positions, trades, resetPortfolio } = useTradingStore();

  const positionsValue = positions.reduce(
    (sum, p) => sum + p.currentPrice * p.quantity,
    0,
  );
  const metrics = calculateMetrics(trades, cashBalance, positionsValue);

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#262626] bg-[#141414] px-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">
          <span className="text-orange-500">Claw</span>
          <span className="text-[#fafafa]">Trader</span>
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-[#a1a1aa]">Portfolio Value</div>
          <div className="text-sm font-semibold text-[#fafafa]">
            {formatUSD(metrics.totalValue)}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-[#a1a1aa]">Cash</div>
          <div className="text-sm font-semibold text-[#fafafa]">
            {formatUSD(cashBalance)}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-[#a1a1aa]">Total P&L</div>
          <div className={`text-sm font-semibold ${pnlColor(metrics.totalPnl)}`}>
            {formatUSD(metrics.totalPnl)} ({formatPercent(metrics.totalPnlPercent)})
          </div>
        </div>

        <button
          onClick={resetPortfolio}
          className="rounded p-1.5 text-[#a1a1aa] transition-colors hover:bg-[#262626] hover:text-[#fafafa]"
          title="Reset Portfolio"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </header>
  );
}
