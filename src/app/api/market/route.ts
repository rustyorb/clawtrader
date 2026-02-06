import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'quotes') {
      const ids = searchParams.get('ids');
      if (!ids) {
        return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 });
      }

      const params = new URLSearchParams({
        vs_currency: 'usd',
        ids,
        sparkline: 'false',
        price_change_percentage: '24h',
      });

      const res = await fetch(`${COINGECKO_BASE}/coins/markets?${params}`);

      if (res.status === 429) {
        return NextResponse.json(
          { error: 'Rate limited by CoinGecko. Try again shortly.' },
          { status: 429 },
        );
      }
      if (!res.ok) {
        return NextResponse.json(
          { error: `CoinGecko API error: ${res.status}` },
          { status: res.status },
        );
      }

      const data = await res.json();

      const quotes = data.map((coin: Record<string, unknown>) => ({
        id: coin.id,
        symbol: (coin.symbol as string).toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        total_volume: coin.total_volume,
        market_cap: coin.market_cap,
        image: coin.image,
      }));

      return NextResponse.json(quotes);
    }

    if (action === 'history') {
      const id = searchParams.get('id');
      const days = searchParams.get('days') || '30';

      if (!id) {
        return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
      }

      const params = new URLSearchParams({
        vs_currency: 'usd',
        days,
      });

      const res = await fetch(
        `${COINGECKO_BASE}/coins/${encodeURIComponent(id)}/ohlc?${params}`,
      );

      if (res.status === 429) {
        return NextResponse.json(
          { error: 'Rate limited by CoinGecko. Try again shortly.' },
          { status: 429 },
        );
      }
      if (!res.ok) {
        return NextResponse.json(
          { error: `CoinGecko API error: ${res.status}` },
          { status: res.status },
        );
      }

      const data: number[][] = await res.json();

      const candles = data.map(([timestamp, open, high, low, close]) => ({
        time: Math.floor(timestamp / 1000),
        open,
        high,
        low,
        close,
      }));

      return NextResponse.json(candles);
    }

    if (action === 'search') {
      const q = searchParams.get('q');
      if (!q) {
        return NextResponse.json({ error: 'Missing q parameter' }, { status: 400 });
      }

      const params = new URLSearchParams({ query: q });
      const res = await fetch(`${COINGECKO_BASE}/search?${params}`);

      if (res.status === 429) {
        return NextResponse.json(
          { error: 'Rate limited by CoinGecko. Try again shortly.' },
          { status: 429 },
        );
      }
      if (!res.ok) {
        return NextResponse.json(
          { error: `CoinGecko API error: ${res.status}` },
          { status: res.status },
        );
      }

      const data = await res.json();

      const results = (data.coins ?? [])
        .slice(0, 10)
        .map((coin: Record<string, unknown>) => ({
          id: coin.id,
          symbol: (coin.symbol as string).toUpperCase(),
          name: coin.name,
        }));

      return NextResponse.json(results);
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: quotes, history, or search' },
      { status: 400 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
