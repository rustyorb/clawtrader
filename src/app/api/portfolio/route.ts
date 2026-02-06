import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Portfolio data is managed client-side. Use the dashboard or agent SDK.',
    endpoints: {
      market: '/api/market?action=quotes&ids=bitcoin,ethereum',
      trade: 'POST /api/trade',
    },
  });
}
