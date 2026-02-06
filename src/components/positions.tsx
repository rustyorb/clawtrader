'use client';

import { useTradingStore } from '@/lib/store';
import { formatUSD, formatPercent, pnlColor } from '@/lib/utils';
import { X, Crosshair } from 'lucide-react';

export default function Positions() {
  const { positions, closePosition } = useTradingStore();

  const calcPnl = (pos: (typeof positions)[0]) => {
    const raw =
      pos.side === 'long'
        ? (pos.currentPrice - pos.entryPrice) * pos.quantity
        : (pos.entryPrice - pos.currentPrice) * pos.quantity;
    const pct =
      pos.side === 'long'
        ? ((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100
        : ((pos.entryPrice - pos.currentPrice) / pos.entryPrice) * 100;
    return { raw, pct };
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
          Positions
        </span>
        {positions.length > 0 && (
          <span className="rounded bg-[#262626] px-1.5 py-0.5 text-xs text-[#a1a1aa]">
            {positions.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {positions.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-[#a1a1aa]">
            No open positions
          </div>
        ) : (
          positions.map((pos) => {
            const { raw, pct } = calcPnl(pos);
            return (
              <div
                key={pos.id}
                className="group flex items-center justify-between border-b border-[#262626]/50 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#fafafa]">{pos.symbol}</span>
                    <span
                      className={`rounded px-1 py-0.5 text-[10px] font-medium uppercase ${
                        pos.side === 'long'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {pos.side}
                    </span>
                    {(pos.stopLoss || pos.takeProfit) && (
                      <Crosshair size={10} className="text-[#a1a1aa]" />
                    )}
                  </div>
                  <div className="text-xs text-[#a1a1aa]">
                    Entry: {formatUSD(pos.entryPrice)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className={`text-xs font-medium ${pnlColor(raw)}`}>
                      {formatUSD(raw)}
                    </div>
                    <div className={`text-xs ${pnlColor(pct)}`}>
                      {formatPercent(pct)}
                    </div>
                  </div>
                  <button
                    onClick={() => closePosition(pos.id, pos.currentPrice)}
                    className="hidden rounded p-1 text-[#a1a1aa] transition-colors hover:bg-[#262626] hover:text-red-500 group-hover:block"
                    title="Close position"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
