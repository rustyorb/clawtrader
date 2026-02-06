import { MarketQuote, PriceCandle, Asset } from '@/lib/types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchQuotes(ids: string[]): Promise<MarketQuote[]> {
  if (ids.length === 0) return [];

  const params = new URLSearchParams({
    vs_currency: 'usd',
    ids: ids.join(','),
    sparkline: 'false',
    price_change_percentage: '24h',
  });

  const res = await fetch(`${BASE_URL}/coins/markets?${params}`);
  if (!res.ok) throw new Error(`CoinGecko markets error: ${res.status}`);

  const data = await res.json();

  return data.map((coin: Record<string, unknown>) => ({
    id: coin.id as string,
    symbol: (coin.symbol as string).toUpperCase(),
    name: coin.name as string,
    price: (coin.current_price as number) ?? 0,
    change24h: (coin.price_change_percentage_24h as number) ?? 0,
    high24h: (coin.high_24h as number) ?? 0,
    low24h: (coin.low_24h as number) ?? 0,
    volume24h: (coin.total_volume as number) ?? 0,
    marketCap: (coin.market_cap as number) ?? 0,
    image: (coin.image as string) ?? '',
  }));
}

export async function fetchPriceHistory(id: string, days: number): Promise<PriceCandle[]> {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    days: days.toString(),
  });

  const res = await fetch(`${BASE_URL}/coins/${encodeURIComponent(id)}/ohlc?${params}`);
  if (!res.ok) throw new Error(`CoinGecko OHLC error: ${res.status}`);

  const data: number[][] = await res.json();

  return data.map(([timestamp, open, high, low, close]) => ({
    time: Math.floor(timestamp / 1000),
    open,
    high,
    low,
    close,
  }));
}

export async function searchAssets(query: string): Promise<Asset[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({ query });

  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error(`CoinGecko search error: ${res.status}`);

  const data = await res.json();

  return (data.coins ?? []).map((coin: Record<string, unknown>) => ({
    id: coin.id as string,
    symbol: (coin.symbol as string).toUpperCase(),
    name: coin.name as string,
    price: 0,
    change24h: 0,
    image: (coin.large as string) ?? (coin.thumb as string) ?? undefined,
  }));
}

const TIME_RANGE_DAYS: Record<string, number> = {
  '1D': 1,
  '7D': 7,
  '30D': 30,
  '90D': 90,
  '1Y': 365,
  ALL: 730,
};

export function timeRangeToDays(range: string): number {
  return TIME_RANGE_DAYS[range] ?? 30;
}
