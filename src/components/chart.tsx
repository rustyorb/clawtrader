'use client';

import { useEffect, useRef } from 'react';
import { formatUSD, pnlColor } from '@/lib/utils';
import type { PriceCandle, TimeRange } from '@/lib/types';

const TIME_RANGES: TimeRange[] = ['1D', '7D', '30D', '90D', '1Y', 'ALL'];

interface ChartProps {
  data: PriceCandle[];
  symbol: string;
  price: number;
  change24h: number;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export default function Chart({
  data,
  symbol,
  price,
  change24h,
  timeRange,
  onTimeRangeChange,
}: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    let cancelled = false;

    import('lightweight-charts').then(({ createChart, CandlestickSeries }) => {
      if (cancelled || !chartContainerRef.current) return;

      // Clean up previous chart
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }

      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: '#141414' },
          textColor: '#a1a1aa',
        },
        grid: {
          vertLines: { color: '#1a1a1a' },
          horzLines: { color: '#1a1a1a' },
        },
        crosshair: {
          vertLine: { color: '#a1a1aa', width: 1, style: 3 },
          horzLine: { color: '#a1a1aa', width: 1, style: 3 },
        },
        rightPriceScale: {
          borderColor: '#262626',
        },
        timeScale: {
          borderColor: '#262626',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      const series = chart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderUpColor: '#10b981',
        borderDownColor: '#ef4444',
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      const formattedData = data.map((c) => ({
        time: c.time as any,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));

      series.setData(formattedData);
      chart.timeScale().fitContent();

      chartRef.current = chart;
      seriesRef.current = series;

      // Resize observer
      const observer = new ResizeObserver(() => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      });
      observer.observe(chartContainerRef.current);

      return () => observer.disconnect();
    });

    return () => {
      cancelled = true;
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="flex h-full flex-col bg-[#141414]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#fafafa]">{symbol}</span>
          {price > 0 && (
            <>
              <span className="text-sm font-medium text-[#fafafa]">{formatUSD(price)}</span>
              <span className={`text-xs ${pnlColor(change24h)}`}>
                {change24h >= 0 ? '+' : ''}
                {change24h.toFixed(2)}%
              </span>
            </>
          )}
        </div>

        {/* Time range buttons */}
        <div className="flex gap-1">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#262626] text-[#fafafa]'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div ref={chartContainerRef} className="flex-1">
        {data.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-[#a1a1aa]">
            Select an asset to view chart
          </div>
        )}
      </div>
    </div>
  );
}
