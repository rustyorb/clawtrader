'use client';

import { useState } from 'react';
import { useTradingStore } from '@/lib/store';
import { formatUSD, formatQuantity } from '@/lib/utils';
import type { PositionSide } from '@/lib/types';

interface TradePanelProps {
  selectedAsset: { id: string; symbol: string; price: number } | null;
}

export default function TradePanel({ selectedAsset }: TradePanelProps) {
  const { cashBalance, openPosition } = useTradingStore();
  const [side, setSide] = useState<PositionSide>('long');
  const [amount, setAmount] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [error, setError] = useState('');

  const amountNum = parseFloat(amount) || 0;
  const price = selectedAsset?.price ?? 0;
  const quantity = price > 0 ? amountNum / price : 0;

  const handleExecute = () => {
    setError('');

    if (!selectedAsset) {
      setError('Select an asset first');
      return;
    }
    if (amountNum <= 0) {
      setError('Enter an amount greater than 0');
      return;
    }
    if (amountNum > cashBalance) {
      setError('Insufficient cash balance');
      return;
    }
    if (price <= 0) {
      setError('Waiting for price data');
      return;
    }

    const sl = parseFloat(stopLoss) || undefined;
    const tp = parseFloat(takeProfit) || undefined;

    openPosition(selectedAsset.id, selectedAsset.symbol, side, amountNum, price, sl, tp);

    setAmount('');
    setStopLoss('');
    setTakeProfit('');
    setError('');
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
        Trade
      </div>

      {/* Buy / Sell toggle */}
      <div className="grid grid-cols-2 gap-1 rounded bg-[#0a0a0a] p-1">
        <button
          onClick={() => setSide('long')}
          className={`rounded py-1.5 text-xs font-medium transition-colors ${
            side === 'long'
              ? 'bg-emerald-500/20 text-emerald-500'
              : 'text-[#a1a1aa] hover:text-[#fafafa]'
          }`}
        >
          BUY / LONG
        </button>
        <button
          onClick={() => setSide('short')}
          className={`rounded py-1.5 text-xs font-medium transition-colors ${
            side === 'short'
              ? 'bg-red-500/20 text-red-500'
              : 'text-[#a1a1aa] hover:text-[#fafafa]'
          }`}
        >
          SELL / SHORT
        </button>
      </div>

      {/* Amount input */}
      <div>
        <label className="mb-1 block text-xs text-[#a1a1aa]">Amount (USD)</label>
        <div className="flex items-center rounded border border-[#262626] bg-[#0a0a0a] px-2">
          <span className="text-xs text-[#a1a1aa]">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="any"
            className="w-full bg-transparent py-1.5 pl-1 text-sm text-[#fafafa] placeholder-[#a1a1aa]/50 outline-none"
          />
        </div>
        {quantity > 0 && selectedAsset && (
          <div className="mt-1 text-xs text-[#a1a1aa]">
            ≈ {formatQuantity(quantity)} {selectedAsset.symbol}
          </div>
        )}
      </div>

      {/* Stop-Loss */}
      <div>
        <label className="mb-1 block text-xs text-[#a1a1aa]">Stop-Loss (optional)</label>
        <div className="flex items-center rounded border border-[#262626] bg-[#0a0a0a] px-2">
          <span className="text-xs text-[#a1a1aa]">$</span>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            placeholder="—"
            min="0"
            step="any"
            className="w-full bg-transparent py-1.5 pl-1 text-sm text-[#fafafa] placeholder-[#a1a1aa]/50 outline-none"
          />
        </div>
      </div>

      {/* Take-Profit */}
      <div>
        <label className="mb-1 block text-xs text-[#a1a1aa]">Take-Profit (optional)</label>
        <div className="flex items-center rounded border border-[#262626] bg-[#0a0a0a] px-2">
          <span className="text-xs text-[#a1a1aa]">$</span>
          <input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            placeholder="—"
            min="0"
            step="any"
            className="w-full bg-transparent py-1.5 pl-1 text-sm text-[#fafafa] placeholder-[#a1a1aa]/50 outline-none"
          />
        </div>
      </div>

      {/* Available balance */}
      <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
        <span>Available</span>
        <span>{formatUSD(cashBalance)}</span>
      </div>

      {/* Error */}
      {error && (
        <div className="text-xs text-red-500">{error}</div>
      )}

      {/* Execute button */}
      <button
        onClick={handleExecute}
        className={`w-full rounded py-2 text-sm font-medium text-white transition-colors ${
          side === 'long'
            ? 'bg-emerald-600 hover:bg-emerald-500'
            : 'bg-red-600 hover:bg-red-500'
        }`}
      >
        Execute {side === 'long' ? 'Buy' : 'Sell'}
        {selectedAsset ? ` ${selectedAsset.symbol}` : ''}
      </button>
    </div>
  );
}
