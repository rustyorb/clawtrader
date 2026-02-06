import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { action, assetId, symbol, quantity, amountUSD, price } = body;

    if (!action || !['buy', 'sell'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "buy" or "sell".' },
        { status: 400 },
      );
    }

    if (!assetId || !symbol) {
      return NextResponse.json(
        { error: 'Missing required fields: assetId, symbol' },
        { status: 400 },
      );
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 },
      );
    }

    if (!quantity && !amountUSD) {
      return NextResponse.json(
        { error: 'Must provide either quantity or amountUSD' },
        { status: 400 },
      );
    }

    const resolvedQuantity = quantity ?? (amountUSD ? amountUSD / price : 0);
    const resolvedAmountUSD = amountUSD ?? (quantity ? quantity * price : 0);

    return NextResponse.json({
      status: 'ok',
      trade: {
        action,
        assetId,
        symbol,
        quantity: resolvedQuantity,
        amountUSD: resolvedAmountUSD,
        price,
        timestamp: Date.now(),
      },
      message:
        'Trade received. Note: actual execution happens client-side via Zustand store. This endpoint is for agent API integration.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'ClawTrader Trading API' });
}
