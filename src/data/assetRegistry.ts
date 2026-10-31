// Multi-Asset Registry - 50+ assets across all major classes
export type AssetCategory = 'metals' | 'forex' | 'crypto' | 'commodities' | 'indices' | 'stocks' | 'bonds';

export interface Asset {
  symbol: string;
  name: string;
  shortName: string;
  category: AssetCategory;
  subCategory?: string;
  currency: string;
  exchange: string;
  hasCOT: boolean;
  hasOptions: boolean;
  tradingHours: string;
  tickSize: number;
  description: string;
  color: string;
}

export const ASSET_CATEGORIES: Record<AssetCategory, { label: string; icon: string; color: string; description: string }> = {
  metals: { label: 'Precious Metals', icon: '🥇', color: 'amber', description: 'Gold, Silver, Platinum, Palladium' },
  forex: { label: 'Forex', icon: '💱', color: 'blue', description: 'Major, minor & exotic pairs' },
  crypto: { label: 'Cryptocurrency', icon: '₿', color: 'purple', description: 'Bitcoin, Ethereum, Altcoins' },
  commodities: { label: 'Commodities', icon: '🛢️', color: 'orange', description: 'Energy, Agriculture, Industrial' },
  indices: { label: 'Market Indices', icon: '📈', color: 'emerald', description: 'Global market benchmarks' },
  stocks: { label: 'Stocks', icon: '🏢', color: 'cyan', description: 'Major global equities' },
  bonds: { label: 'Bonds & Rates', icon: '📜', color: 'indigo', description: 'Government bonds & yields' },
};

export const ASSETS: Asset[] = [
  // ========== PRECIOUS METALS (5) ==========
  { symbol: 'GC=F', name: 'Gold Futures (COMEX)', shortName: 'Gold', category: 'metals', subCategory: 'Precious', currency: 'USD', exchange: 'COMEX', hasCOT: true, hasOptions: true, tradingHours: 'Sun-Fri 18:00-17:00 ET', tickSize: 0.10, description: 'COMEX Gold Futures - Primary gold benchmark', color: 'amber' },
  { symbol: 'SI=F', name: 'Silver Futures (COMEX)', shortName: 'Silver', category: 'metals', subCategory: 'Precious', currency: 'USD', exchange: 'COMEX', hasCOT: true, hasOptions: true, tradingHours: 'Sun-Fri 18:00-17:00 ET', tickSize: 0.005, description: 'COMEX Silver Futures', color: 'gray' },
  { symbol: 'PL=F', name: 'Platinum Futures (NYMEX)', shortName: 'Platinum', category: 'metals', subCategory: 'Precious', currency: 'USD', exchange: 'NYMEX', hasCOT: true, hasOptions: false, tradingHours: 'Sun-Fri 18:00-17:00 ET', tickSize: 0.10, description: 'NYMEX Platinum Futures', color: 'slate' },
  { symbol: 'PA=F', name: 'Palladium Futures (NYMEX)', shortName: 'Palladium', category: 'metals', subCategory: 'Precious', currency: 'USD', exchange: 'NYMEX', hasCOT: true, hasOptions: false, tradingHours: 'Sun-Fri 18:00-17:00 ET', tickSize: 0.50, description: 'NYMEX Palladium Futures', color: 'zinc' },
  { symbol: 'HG=F', name: 'Copper (COMEX)', shortName: 'Copper', category: 'metals', subCategory: 'Industrial', currency: 'USD', exchange: 'COMEX', hasCOT: true, hasOptions: true, tradingHours: 'Sun-Fri 18:00-17:00 ET', tickSize: 0.0005, description: 'COMEX Copper - Dr. Copper economic indicator', color: 'orange' },

  // ========== FOREX (10) ==========
  { symbol: 'EURUSD=X', name: 'Euro / US Dollar', shortName: 'EUR/USD', category: 'forex', subCategory: 'Major', currency: 'USD', exchange: 'FX', hasCOT: true, hasOptions: true, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.0001, description: 'Most traded currency pair globally', color: 'blue' },
  { symbol: 'GBPUSD=X', name: 'British Pound / US Dollar', shortName: 'GBP/USD', category: 'forex', subCategory: 'Major', currency: 'USD', exchange: 'FX', hasCOT: true, hasOptions: true, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.0001, description: 'Cable - Second most traded pair', color: 'indigo' },
  { symbol: 'USDJPY=X', name: 'US Dollar / Japanese Yen', shortName: 'USD/JPY', category: 'forex', subCategory: 'Major', currency: 'JPY', exchange: 'FX', hasCOT: true, hasOptions: true, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.01, description: 'Gopher - Key Asian pair', color: 'red' },
  { symbol: 'AUDUSD=X', name: 'Australian Dollar / USD', shortName: 'AUD/USD', category: 'forex', subCategory: 'Major', currency: 'USD', exchange: 'FX', hasCOT: true, hasOptions: false, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.0001, description: 'Aussie - Commodity currency', color: 'yellow' },
  { symbol: 'USDCAD=X', name: 'US Dollar / Canadian Dollar', shortName: 'USD/CAD', category: 'forex', subCategory: 'Major', currency: 'CAD', exchange: 'FX', hasCOT: true, hasOptions: false, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.0001, description: 'Loonie - Oil-correlated', color: 'red' },
  { symbol: 'USDCHF=X', name: 'US Dollar / Swiss Franc', shortName: 'USD/CHF', category: 'forex', subCategory: 'Major', currency: 'CHF', exchange: 'FX', hasCOT: true, hasOptions: false, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.0001, description: 'Swissy - Safe haven', color: 'red' },
  { symbol: 'NZDUSD=X', name: 'New Zealand Dollar / USD', shortName: 'NZD/USD', category: 'forex', subCategory: 'Major', currency: 'USD', exchange: 'FX', hasCOT: true, hasOptions: false, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.0001, description: 'Kiwi - Commodity currency', color: 'green' },
  { symbol: 'EURGBP=X', name: 'Euro / British Pound', shortName: 'EUR/GBP', category: 'forex', subCategory: 'Cross', currency: 'GBP', exchange: 'FX', hasCOT: false, hasOptions: false, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.0001, description: 'European cross pair', color: 'blue' },
  { symbol: 'EURJPY=X', name: 'Euro / Japanese Yen', shortName: 'EUR/JPY', category: 'forex', subCategory: 'Cross', currency: 'JPY', exchange: 'FX', hasCOT: false, hasOptions: false, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.01, description: 'Euro-Yen cross', color: 'blue' },
  { symbol: 'GBPJPY=X', name: 'British Pound / Yen', shortName: 'GBP/JPY', category: 'forex', subCategory: 'Cross', currency: 'JPY', exchange: 'FX', hasCOT: false, hasOptions: false, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.01, description: 'Dragon - Volatile cross', color: 'indigo' },

  // ========== CRYPTOCURRENCY (10) ==========
  { symbol: 'BTC-USD', name: 'Bitcoin', shortName: 'BTC', category: 'crypto', subCategory: 'Layer 1', currency: 'USD', exchange: 'Crypto', hasCOT: true, hasOptions: true, tradingHours: '24/7', tickSize: 0.01, description: 'Bitcoin - Digital gold, largest crypto', color: 'orange' },
  { symbol: 'ETH-USD', name: 'Ethereum', shortName: 'ETH', category: 'crypto', subCategory: 'Layer 1', currency: 'USD', exchange: 'Crypto', hasCOT: true, hasOptions: true, tradingHours: '24/7', tickSize: 0.01, description: 'Ethereum - Smart contract platform', color: 'indigo' },
  { symbol: 'SOL-USD', name: 'Solana', shortName: 'SOL', category: 'crypto', subCategory: 'Layer 1', currency: 'USD', exchange: 'Crypto', hasCOT: false, hasOptions: false, tradingHours: '24/7', tickSize: 0.01, description: 'Solana - High-performance blockchain', color: 'purple' },
  { symbol: 'BNB-USD', name: 'Binance Coin', shortName: 'BNB', category: 'crypto', subCategory: 'Exchange', currency: 'USD', exchange: 'Crypto', hasCOT: false, hasOptions: false, tradingHours: '24/7', tickSize: 0.01, description: 'Binance ecosystem token', color: 'yellow' },
  { symbol: 'XRP-USD', name: 'Ripple', shortName: 'XRP', category: 'crypto', subCategory: 'Payment', currency: 'USD', exchange: 'Crypto', hasCOT: false, hasOptions: false, tradingHours: '24/7', tickSize: 0.0001, description: 'XRP - Cross-border payments', color: 'blue' },
  { symbol: 'ADA-USD', name: 'Cardano', shortName: 'ADA', category: 'crypto', subCategory: 'Layer 1', currency: 'USD', exchange: 'Crypto', hasCOT: false, hasOptions: false, tradingHours: '24/7', tickSize: 0.0001, description: 'Cardano - Research-driven blockchain', color: 'blue' },
  { symbol: 'AVAX-USD', name: 'Avalanche', shortName: 'AVAX', category: 'crypto', subCategory: 'Layer 1', currency: 'USD', exchange: 'Crypto', hasCOT: false, hasOptions: false, tradingHours: '24/7', tickSize: 0.01, description: 'Avalanche - High throughput', color: 'red' },
  { symbol: 'DOT-USD', name: 'Polkadot', shortName: 'DOT', category: 'crypto', subCategory: 'Layer 0', currency: 'USD', exchange: 'Crypto', hasCOT: false, hasOptions: false, tradingHours: '24/7', tickSize: 0.001, description: 'Polkadot - Interoperability', color: 'pink' },
  { symbol: 'LINK-USD', name: 'Chainlink', shortName: 'LINK', category: 'crypto', subCategory: 'Oracle', currency: 'USD', exchange: 'Crypto', hasCOT: false, hasOptions: false, tradingHours: '24/7', tickSize: 0.001, description: 'Chainlink - Decentralized oracle', color: 'blue' },
  { symbol: 'MATIC-USD', name: 'Polygon', shortName: 'MATIC', category: 'crypto', subCategory: 'Layer 2', currency: 'USD', exchange: 'Crypto', hasCOT: false, hasOptions: false, tradingHours: '24/7', tickSize: 0.0001, description: 'Polygon - Ethereum scaling', color: 'purple' },

  // ========== COMMODITIES (8) ==========
  { symbol: 'CL=F', name: 'Crude Oil WTI (NYMEX)', shortName: 'WTI Oil', category: 'commodities', subCategory: 'Energy', currency: 'USD', exchange: 'NYMEX', hasCOT: true, hasOptions: true, tradingHours: 'Sun-Fri 18:00-17:00 ET', tickSize: 0.01, description: 'WTI Crude Oil - Primary oil benchmark', color: 'gray' },
  { symbol: 'BZ=F', name: 'Brent Crude Oil (ICE)', shortName: 'Brent', category: 'commodities', subCategory: 'Energy', currency: 'USD', exchange: 'ICE', hasCOT: true, hasOptions: true, tradingHours: 'Sun-Fri 18:00-17:00 ET', tickSize: 0.01, description: 'Brent Crude - Global oil benchmark', color: 'gray' },
  { symbol: 'NG=F', name: 'Natural Gas (NYMEX)', shortName: 'Nat Gas', category: 'commodities', subCategory: 'Energy', currency: 'USD', exchange: 'NYMEX', hasCOT: true, hasOptions: true, tradingHours: 'Sun-Fri 18:00-14:30 ET', tickSize: 0.001, description: 'Henry Hub Natural Gas', color: 'blue' },
  { symbol: 'ZC=F', name: 'Corn Futures (CBOT)', shortName: 'Corn', category: 'commodities', subCategory: 'Agriculture', currency: 'USD', exchange: 'CBOT', hasCOT: true, hasOptions: true, tradingHours: 'Sun-Fri 19:00-13:20 CT', tickSize: 0.25, description: 'CBOT Corn Futures', color: 'yellow' },
  { symbol: 'ZW=F', name: 'Wheat Futures (CBOT)', shortName: 'Wheat', category: 'commodities', subCategory: 'Agriculture', currency: 'USD', exchange: 'CBOT', hasCOT: true, hasOptions: true, tradingHours: 'Sun-Fri 19:00-13:20 CT', tickSize: 0.25, description: 'CBOT Wheat Futures', color: 'amber' },
  { symbol: 'ZS=F', name: 'Soybeans (CBOT)', shortName: 'Soybeans', category: 'commodities', subCategory: 'Agriculture', currency: 'USD', exchange: 'CBOT', hasCOT: true, hasOptions: true, tradingHours: 'Sun-Fri 19:00-13:20 CT', tickSize: 0.25, description: 'CBOT Soybean Futures', color: 'green' },
  { symbol: 'KC=F', name: 'Coffee Futures (ICE)', shortName: 'Coffee', category: 'commodities', subCategory: 'Softs', currency: 'USD', exchange: 'ICE', hasCOT: true, hasOptions: false, tradingHours: 'Sun-Fri 19:00-12:30 ET', tickSize: 0.05, description: 'ICE Coffee C Futures', color: 'amber' },
  { symbol: 'CT=F', name: 'Cotton Futures (ICE)', shortName: 'Cotton', category: 'commodities', subCategory: 'Softs', currency: 'USD', exchange: 'ICE', hasCOT: true, hasOptions: false, tradingHours: 'Sun-Fri 19:00-13:00 ET', tickSize: 0.01, description: 'ICE Cotton No. 2 Futures', color: 'white' },

  // ========== MARKET INDICES (10) ==========
  { symbol: '^GSPC', name: 'S&P 500 Index', shortName: 'S&P 500', category: 'indices', subCategory: 'US', currency: 'USD', exchange: 'CBOE', hasCOT: true, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'S&P 500 - US large-cap benchmark', color: 'blue' },
  { symbol: '^IXIC', name: 'Nasdaq Composite', shortName: 'Nasdaq', category: 'indices', subCategory: 'US', currency: 'USD', exchange: 'NASDAQ', hasCOT: true, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Nasdaq - Tech-heavy index', color: 'blue' },
  { symbol: '^DJI', name: 'Dow Jones Industrial', shortName: 'Dow Jones', category: 'indices', subCategory: 'US', currency: 'USD', exchange: 'NYSE', hasCOT: true, hasOptions: false, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Dow Jones - Blue chip index', color: 'blue' },
  { symbol: '^RUT', name: 'Russell 2000', shortName: 'Russell 2K', category: 'indices', subCategory: 'US', currency: 'USD', exchange: 'NYSE', hasCOT: true, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Russell 2000 - Small cap index', color: 'purple' },
  { symbol: '^VIX', name: 'CBOE Volatility Index', shortName: 'VIX', category: 'indices', subCategory: 'Volatility', currency: 'USD', exchange: 'CBOE', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:15 ET', tickSize: 0.01, description: 'VIX - Fear gauge, market volatility', color: 'purple' },
  { symbol: 'DX-Y.NYB', name: 'US Dollar Index', shortName: 'DXY', category: 'indices', subCategory: 'Currency', currency: 'USD', exchange: 'ICE', hasCOT: true, hasOptions: false, tradingHours: '24/5 (Sun-Fri)', tickSize: 0.005, description: 'DXY - US Dollar basket index', color: 'green' },
  { symbol: '^N225', name: 'Nikkei 225 (Japan)', shortName: 'Nikkei', category: 'indices', subCategory: 'Asia', currency: 'JPY', exchange: 'TSE', hasCOT: true, hasOptions: true, tradingHours: 'Mon-Fri 09:00-15:00 JST', tickSize: 0.01, description: 'Nikkei 225 - Japanese benchmark', color: 'red' },
  { symbol: '^HSI', name: 'Hang Seng (Hong Kong)', shortName: 'Hang Seng', category: 'indices', subCategory: 'Asia', currency: 'HKD', exchange: 'HKEX', hasCOT: true, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 HKT', tickSize: 0.01, description: 'Hang Seng - HK benchmark', color: 'red' },
  { symbol: '^FTSE', name: 'FTSE 100 (UK)', shortName: 'FTSE 100', category: 'indices', subCategory: 'Europe', currency: 'GBP', exchange: 'LSE', hasCOT: true, hasOptions: true, tradingHours: 'Mon-Fri 08:00-16:30 GMT', tickSize: 0.01, description: 'FTSE 100 - UK blue chips', color: 'blue' },
  { symbol: '^GDAXI', name: 'DAX (Germany)', shortName: 'DAX', category: 'indices', subCategory: 'Europe', currency: 'EUR', exchange: 'XETRA', hasCOT: true, hasOptions: true, tradingHours: 'Mon-Fri 09:00-17:30 CET', tickSize: 0.01, description: 'DAX - German benchmark', color: 'yellow' },

  // ========== STOCKS (12) ==========
  { symbol: 'AAPL', name: 'Apple Inc.', shortName: 'Apple', category: 'stocks', subCategory: 'Technology', currency: 'USD', exchange: 'NASDAQ', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Apple - Largest US company', color: 'gray' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', shortName: 'Microsoft', category: 'stocks', subCategory: 'Technology', currency: 'USD', exchange: 'NASDAQ', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Microsoft - Cloud & AI leader', color: 'blue' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', shortName: 'NVIDIA', category: 'stocks', subCategory: 'Technology', currency: 'USD', exchange: 'NASDAQ', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'NVIDIA - AI chip leader', color: 'green' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', shortName: 'Google', category: 'stocks', subCategory: 'Technology', currency: 'USD', exchange: 'NASDAQ', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Alphabet - Search & AI', color: 'blue' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', shortName: 'Amazon', category: 'stocks', subCategory: 'E-Commerce', currency: 'USD', exchange: 'NASDAQ', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Amazon - E-commerce & Cloud', color: 'orange' },
  { symbol: 'TSLA', name: 'Tesla Inc.', shortName: 'Tesla', category: 'stocks', subCategory: 'Automotive', currency: 'USD', exchange: 'NASDAQ', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Tesla - EV & Energy', color: 'red' },
  { symbol: 'META', name: 'Meta Platforms', shortName: 'Meta', category: 'stocks', subCategory: 'Technology', currency: 'USD', exchange: 'NASDAQ', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Meta - Social media & VR', color: 'blue' },
  { symbol: 'JPM', name: 'JPMorgan Chase', shortName: 'JPMorgan', category: 'stocks', subCategory: 'Financial', currency: 'USD', exchange: 'NYSE', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'JPMorgan - Largest US bank', color: 'blue' },
  { symbol: 'V', name: 'Visa Inc.', shortName: 'Visa', category: 'stocks', subCategory: 'Financial', currency: 'USD', exchange: 'NYSE', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Visa - Payment network', color: 'blue' },
  { symbol: 'XOM', name: 'Exxon Mobil', shortName: 'Exxon', category: 'stocks', subCategory: 'Energy', currency: 'USD', exchange: 'NYSE', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Exxon - Oil major', color: 'red' },
  { symbol: 'BRK-B', name: 'Berkshire Hathaway', shortName: 'Berkshire', category: 'stocks', subCategory: 'Financial', currency: 'USD', exchange: 'NYSE', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Berkshire - Buffett conglomerate', color: 'blue' },
  { symbol: 'GLD', name: 'SPDR Gold Trust ETF', shortName: 'GLD ETF', category: 'stocks', subCategory: 'ETF', currency: 'USD', exchange: 'NYSE', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'GLD - Gold ETF tracking', color: 'amber' },

  // ========== BONDS & RATES (5) ==========
  { symbol: '^TNX', name: 'US 10-Year Treasury', shortName: 'US 10Y', category: 'bonds', subCategory: 'US Treasury', currency: 'USD', exchange: 'Treasury', hasCOT: true, hasOptions: false, tradingHours: 'Mon-Fri 08:00-17:00 ET', tickSize: 0.001, description: '10-Year Treasury Note Yield', color: 'emerald' },
  { symbol: '^TYX', name: 'US 30-Year Treasury', shortName: 'US 30Y', category: 'bonds', subCategory: 'US Treasury', currency: 'USD', exchange: 'Treasury', hasCOT: true, hasOptions: false, tradingHours: 'Mon-Fri 08:00-17:00 ET', tickSize: 0.001, description: '30-Year Treasury Bond Yield', color: 'emerald' },
  { symbol: '^IRX', name: 'US 13-Week T-Bill', shortName: 'US 13W', category: 'bonds', subCategory: 'US Treasury', currency: 'USD', exchange: 'Treasury', hasCOT: false, hasOptions: false, tradingHours: 'Mon-Fri 08:00-17:00 ET', tickSize: 0.001, description: '13-Week T-Bill Rate', color: 'emerald' },
  { symbol: '^FVX', name: 'US 5-Year Treasury', shortName: 'US 5Y', category: 'bonds', subCategory: 'US Treasury', currency: 'USD', exchange: 'Treasury', hasCOT: true, hasOptions: false, tradingHours: 'Mon-Fri 08:00-17:00 ET', tickSize: 0.001, description: '5-Year Treasury Note Yield', color: 'emerald' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury', shortName: 'TLT ETF', category: 'bonds', subCategory: 'ETF', currency: 'USD', exchange: 'NASDAQ', hasCOT: false, hasOptions: true, tradingHours: 'Mon-Fri 09:30-16:00 ET', tickSize: 0.01, description: 'Long-term Treasury ETF', color: 'emerald' },
];

// CFTC COT commodity mapping
export const COT_COMMODITY_MAP: Record<string, string> = {
  'GC=F': 'GOLD', 'SI=F': 'SILVER', 'PL=F': 'PLATINUM', 'PA=F': 'PALLADIUM',
  'HG=F': 'COPPER', 'CL=F': 'CRUDE', 'BZ=F': 'BRENT', 'NG=F': 'NATURAL GAS',
  'ZC=F': 'CORN', 'ZW=F': 'WHEAT', 'ZS=F': 'SOYBEANS', 'KC=F': 'COFFEE C',
  'CT=F': 'COTTON',
  'EURUSD=X': 'EURO FX', 'GBPUSD=X': 'BRITISH POUND', 'USDJPY=X': 'JAPANESE YEN',
  'AUDUSD=X': 'AUSTRALIAN DOLLAR', 'USDCAD=X': 'CANADIAN DOLLAR', 'USDCHF=X': 'SWISS FRANC',
  'NZDUSD=X': 'NEW ZEALAND DOLLAR',
  '^GSPC': 'S&P 500', '^IXIC': 'NASDAQ 100', '^RUT': 'RUSSELL 2000',
  '^N225': 'NIKKEI STOCK AVG', '^HSI': 'HANG SENG', '^FTSE': 'FTSE 100',
  '^GDAXI': 'DAX', 'DX-Y.NYB': 'US DOLLAR INDEX',
  '^TNX': '10-YEAR T-NOTE', '^TYX': '30-YEAR T-BOND', '^FVX': '5-YEAR T-NOTE',
  'BTC-USD': 'BITCOIN', 'ETH-USD': 'ETHEREUM',
};

export const DEFAULT_ASSET = ASSETS[0]; // Gold Futures

export function getAssetBySymbol(symbol: string): Asset | undefined {
  return ASSETS.find(a => a.symbol === symbol);
}

export function getAssetsByCategory(category: AssetCategory): Asset[] {
  return ASSETS.filter(a => a.category === category);
}

export function getCOTCommodity(symbol: string): string | null {
  return COT_COMMODITY_MAP[symbol] || null;
}

export function getAssetsWithCOT(): Asset[] {
  return ASSETS.filter(a => a.hasCOT);
}

export function getTopAssets(count: number = 15): Asset[] {
  // Prioritized list for ticker tape
  const priority = ['GC=F', 'BTC-USD', 'ETH-USD', 'CL=F', '^GSPC', '^IXIC', 'EURUSD=X', 'USDJPY=X', 'AAPL', 'MSFT', 'NVDA', 'TSLA', 'SI=F', '^VIX', 'DX-Y.NYB'];
  return priority.slice(0, count).map(s => ASSETS.find(a => a.symbol === s)).filter(Boolean) as Asset[];
}
