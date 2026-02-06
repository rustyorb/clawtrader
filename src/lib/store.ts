import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Position, Trade, WatchlistItem, TimeRange } from '@/lib/types';
import {
  openPosition as createPosition,
  closePosition as createTrade,
  shouldTriggerStopLoss,
  shouldTriggerTakeProfit,
} from '@/lib/trading-engine';

const STARTING_BALANCE = 10000;

const DEFAULT_WATCHLIST: WatchlistItem[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 0, change24h: 0 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 0, change24h: 0 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 0, change24h: 0 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0, change24h: 0 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0, change24h: 0 },
];

interface TradingStore {
  cashBalance: number;
  startingBalance: number;
  positions: Position[];
  trades: Trade[];
  watchlist: WatchlistItem[];
  selectedAssetId: string | null;
  selectedTimeRange: TimeRange;

  selectAsset: (id: string) => void;
  selectTimeRange: (range: TimeRange) => void;
  addToWatchlist: (asset: WatchlistItem) => void;
  removeFromWatchlist: (id: string) => void;
  updateAssetPrices: (prices: Record<string, { price: number; change24h: number }>) => void;
  openPosition: (
    assetId: string,
    symbol: string,
    side: 'long' | 'short',
    amountUSD: number,
    price: number,
    stopLoss?: number,
    takeProfit?: number,
  ) => void;
  closePosition: (positionId: string, currentPrice: number) => void;
  checkTriggers: () => void;
  resetPortfolio: () => void;
}

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      cashBalance: STARTING_BALANCE,
      startingBalance: STARTING_BALANCE,
      positions: [],
      trades: [],
      watchlist: DEFAULT_WATCHLIST,
      selectedAssetId: 'bitcoin',
      selectedTimeRange: '7D' as TimeRange,

      selectAsset: (id) => set({ selectedAssetId: id }),

      selectTimeRange: (range) => set({ selectedTimeRange: range }),

      addToWatchlist: (asset) =>
        set((state) => {
          if (state.watchlist.some((w) => w.id === asset.id)) return state;
          return { watchlist: [...state.watchlist, asset] };
        }),

      removeFromWatchlist: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((w) => w.id !== id),
        })),

      updateAssetPrices: (prices) =>
        set((state) => ({
          watchlist: state.watchlist.map((item) => {
            const update = prices[item.id];
            if (!update) return item;
            return { ...item, price: update.price, change24h: update.change24h };
          }),
          positions: state.positions.map((pos) => {
            const update = prices[pos.assetId];
            if (!update) return pos;
            return { ...pos, currentPrice: update.price };
          }),
        })),

      openPosition: (assetId, symbol, side, amountUSD, price, stopLoss, takeProfit) =>
        set((state) => {
          if (amountUSD <= 0 || amountUSD > state.cashBalance) return state;
          const quantity = amountUSD / price;
          const position = createPosition(assetId, symbol, side, quantity, price, stopLoss, takeProfit);
          return {
            cashBalance: state.cashBalance - amountUSD,
            positions: [...state.positions, position],
          };
        }),

      closePosition: (positionId, currentPrice) =>
        set((state) => {
          const position = state.positions.find((p) => p.id === positionId);
          if (!position) return state;

          const trade = createTrade(position, currentPrice);
          const proceeds = currentPrice * position.quantity;

          return {
            positions: state.positions.filter((p) => p.id !== positionId),
            trades: [...state.trades, trade],
            cashBalance: state.cashBalance + proceeds,
          };
        }),

      checkTriggers: () => {
        const state = get();
        const toClose: { id: string; price: number }[] = [];

        for (const pos of state.positions) {
          if (shouldTriggerStopLoss(pos)) {
            toClose.push({ id: pos.id, price: pos.currentPrice });
          } else if (shouldTriggerTakeProfit(pos)) {
            toClose.push({ id: pos.id, price: pos.currentPrice });
          }
        }

        for (const { id, price } of toClose) {
          get().closePosition(id, price);
        }
      },

      resetPortfolio: () =>
        set({
          cashBalance: STARTING_BALANCE,
          positions: [],
          trades: [],
          selectedAssetId: 'bitcoin',
          selectedTimeRange: '7D' as TimeRange,
        }),
    }),
    {
      name: 'clawtrader-store',
    },
  ),
);
