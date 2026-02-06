'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useTradingStore } from '@/lib/store';
import { fetchQuotes, fetchPriceHistory, searchAssets, timeRangeToDays } from '@/lib/market-data';
import type { Asset, PriceCandle, TimeRange } from '@/lib/types';
import Header from '@/components/header';
import Watchlist from '@/components/watchlist';
import Positions from '@/components/positions';
import Chart from '@/components/chart';
import TradePanel from '@/components/trade-panel';
import MetricsPanel from '@/components/metrics-panel';
import TradeHistory from '@/components/trade-history';

const POLL_INTERVAL = 30_000;

export default function Dashboard() {
  const {
    watchlist,
    selectedAssetId,
    selectedTimeRange,
    selectTimeRange,
    updateAssetPrices,
    addToWatchlist,
    checkTriggers,
  } = useTradingStore();

  const [chartData, setChartData] = useState<PriceCandle[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch quotes for all watchlist items
  const refreshQuotes = useCallback(async () => {
    const ids = watchlist.map((w) => w.id);
    if (ids.length === 0) return;

    try {
      const quotes = await fetchQuotes(ids);
      const priceMap: Record<string, { price: number; change24h: number }> = {};
      for (const q of quotes) {
        priceMap[q.id] = { price: q.price, change24h: q.change24h };
      }
      updateAssetPrices(priceMap);
      checkTriggers();
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
    }
  }, [watchlist, updateAssetPrices, checkTriggers]);

  // Fetch price history for the selected asset
  const refreshChart = useCallback(async () => {
    if (!selectedAssetId) return;

    setChartLoading(true);
    try {
      const days = timeRangeToDays(selectedTimeRange);
      const candles = await fetchPriceHistory(selectedAssetId, days);
      setChartData(candles);
    } catch (err) {
      console.error('Failed to fetch price history:', err);
    } finally {
      setChartLoading(false);
    }
  }, [selectedAssetId, selectedTimeRange]);

  // On mount: initial data fetch
  useEffect(() => {
    refreshQuotes();
  }, [refreshQuotes]);

  // Poll prices every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshQuotes, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshQuotes]);

  // When selected asset or time range changes, refresh chart
  useEffect(() => {
    refreshChart();
  }, [refreshChart]);

  // Search handler with debounce
  const handleSearch = useCallback((query: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchAssets(query);
        setSearchResults(results.slice(0, 10));
      } catch (err) {
        console.error('Search failed:', err);
      }
    }, 300);
  }, []);

  // Handle adding an asset from search results
  const handleAddAsset = useCallback(
    (asset: Asset) => {
      addToWatchlist(asset);
      setSearchResults([]);
    },
    [addToWatchlist],
  );

  // Handle time range change
  const handleTimeRangeChange = useCallback(
    (range: TimeRange) => {
      selectTimeRange(range);
    },
    [selectTimeRange],
  );

  const selectedAsset = watchlist.find((a) => a.id === selectedAssetId);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: Watchlist + Positions */}
        <aside className="flex w-72 flex-shrink-0 flex-col border-r border-[#262626] bg-[#141414]">
          <div className="flex-1 overflow-y-auto border-b border-[#262626]">
            <Watchlist
              searchResults={searchResults}
              onSearch={handleSearch}
              onAddAsset={handleAddAsset}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <Positions />
          </div>
        </aside>

        {/* RIGHT CONTENT: Chart + Trade Panel + Metrics + History */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* CHART */}
          <div className="h-[400px] flex-shrink-0 border-b border-[#262626]">
            <Chart
              data={chartData}
              symbol={selectedAsset?.symbol ?? ''}
              price={selectedAsset?.price ?? 0}
              change24h={selectedAsset?.change24h ?? 0}
              timeRange={selectedTimeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
          </div>

          {/* LOWER SECTION */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* TRADE PANEL */}
            <div className="border-b border-[#262626] p-4">
              <TradePanel
                selectedAsset={
                  selectedAsset
                    ? {
                        id: selectedAsset.id,
                        symbol: selectedAsset.symbol,
                        price: selectedAsset.price,
                      }
                    : null
                }
              />
            </div>

            {/* METRICS PANEL */}
            <div className="border-b border-[#262626]">
              <MetricsPanel />
            </div>

            {/* TRADE HISTORY */}
            <div className="flex-1 overflow-y-auto">
              <TradeHistory />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
