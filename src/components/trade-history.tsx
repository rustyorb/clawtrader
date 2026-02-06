'use client';

import { useTradingStore } from '@/lib/store';
import { formatUSD, formatPercent, pnlColor } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TradeHistory() {
  const { trades } = useTradingStore();

  const sorted = [...trades].sort((a, b) => b.closedAt - a.closedAt);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
          Trade History
        </span>
        {trades.length > 0 && (
          <span className="rounded bg-[#262626] px-1.5 py-0.5 text-xs text-[#a1a1aa]">
            {trades.length}
          </span>
        )}
      </div>

      <div className="max-h-60 flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-[#a1a1aa]">
            No trades yet
          </div>
        ) : (
          sorted.map((trade) => {
            const isWin = trade.pnl > 0;
            return (
              <div
                key={trade.id}
                className="flex items-center justify-between border-b border-[#262626]/50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  {isWin ? (
                    <ArrowUpRight size={14} className="text-emerald-500" />
                  ) : (
                    <ArrowDownRight size={14} className="text-red-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#fafafa]">
                        {trade.symbol}
                      </span>
                      <span
                        className={`text-[10px] font-medium uppercase ${
                          trade.side === 'long' ? 'text-emerald-500' : 'text-red-500'
                        }`}
                      >
                        {trade.side}
                      </span>
                    </div>
                    <div className="text-xs text-[#a1a1aa]">
                      {formatUSD(trade.entryPrice)} → {formatUSD(trade.exitPrice)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-medium ${pnlColor(trade.pnl)}`}>
                    {formatUSD(trade.pnl)}
                  </div>
                  <div className={`text-xs ${pnlColor(trade.pnlPercent)}`}>
                    {formatPercent(trade.pnlPercent)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
