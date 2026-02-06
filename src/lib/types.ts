export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit' | 'stop-loss' | 'take-profit';
export type OrderStatus = 'open' | 'filled' | 'cancelled' | 'stopped';
export type PositionSide = 'long' | 'short';

export interface Asset {
  id: string;       // coingecko id e.g. "bitcoin"
  symbol: string;   // e.g. "BTC"
  name: string;     // e.g. "Bitcoin"
  price: number;
  change24h: number; // percent
  image?: string;
}

export interface WatchlistItem extends Asset {}

export interface Order {
  id: string;
  assetId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number;          // execution / limit price
  stopLoss?: number;
  takeProfit?: number;
  status: OrderStatus;
  createdAt: number;      // timestamp ms
  filledAt?: number;
}

export interface Position {
  id: string;
  assetId: string;
  symbol: string;
  side: PositionSide;
  entryPrice: number;
  quantity: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  openedAt: number;
}

export interface Trade {
  id: string;
  assetId: string;
  symbol: string;
  side: PositionSide;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  openedAt: number;
  closedAt: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  cashBalance: number;
  positionsValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}

export interface PriceCandle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface MarketQuote {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  image: string;
}

export type TimeRange = '1D' | '7D' | '30D' | '90D' | '1Y' | 'ALL';
