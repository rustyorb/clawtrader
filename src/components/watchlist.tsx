'use client';

import { useState } from 'react';
import { useTradingStore } from '@/lib/store';
import { formatUSD, formatPercent, pnlColor } from '@/lib/utils';
import { Plus, Search, X } from 'lucide-react';
import type { Asset, WatchlistItem } from '@/lib/types';

interface WatchlistProps {
  searchResults: Asset[];
  onSearch: (query: string) => void;
  onAddAsset: (asset: WatchlistItem) => void;
}

export default function Watchlist({ searchResults, onSearch, onAddAsset }: WatchlistProps) {
  const { watchlist, selectedAssetId, selectAsset, removeFromWatchlist } = useTradingStore();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    onSearch(q);
  };

  const handleAdd = (asset: Asset) => {
    onAddAsset({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      price: asset.price,
      change24h: asset.change24h,
    });
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">
          Watchlist
        </span>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="rounded p-1 text-[#a1a1aa] transition-colors hover:bg-[#262626] hover:text-[#fafafa]"
        >
          {showSearch ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>

      {showSearch && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-1.5 rounded border border-[#262626] bg-[#0a0a0a] px-2 py-1">
            <Search size={12} className="text-[#a1a1aa]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full bg-transparent text-xs text-[#fafafa] placeholder-[#a1a1aa] outline-none"
              autoFocus
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded border border-[#262626] bg-[#0a0a0a]">
              {searchResults.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => handleAdd(asset)}
                  className="flex w-full items-center justify-between px-2 py-1.5 text-left transition-colors hover:bg-[#1a1a1a]"
                >
                  <div>
                    <span className="text-xs font-medium text-[#fafafa]">
                      {asset.symbol.toUpperCase()}
                    </span>
                    <span className="ml-1.5 text-xs text-[#a1a1aa]">{asset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {watchlist.map((item) => {
          const isSelected = item.id === selectedAssetId;
          return (
            <button
              key={item.id}
              onClick={() => selectAsset(item.id)}
              className={`group flex h-10 w-full items-center justify-between px-3 text-left transition-colors ${
                isSelected
                  ? 'border-l-2 border-l-orange-500 bg-[#1a1a1a]'
                  : 'border-l-2 border-l-transparent hover:bg-[#1a1a1a]/50'
              }`}
            >
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#fafafa]">{item.symbol}</span>
                <span className="ml-1.5 truncate text-xs text-[#a1a1aa]">{item.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-[#fafafa]">
                  {item.price > 0 ? formatUSD(item.price) : '—'}
                </span>
                <span className={`text-xs ${pnlColor(item.change24h)}`}>
                  {item.price > 0 ? formatPercent(item.change24h) : ''}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWatchlist(item.id);
                }}
                className="ml-1 hidden rounded p-0.5 text-[#a1a1aa] transition-colors hover:bg-[#262626] hover:text-red-500 group-hover:block"
              >
                <X size={10} />
              </button>
            </button>
          );
        })}
      </div>
    </div>
  );
}
