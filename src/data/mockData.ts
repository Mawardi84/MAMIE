// Mock data for XAU/USD Quantitative Research Platform

export const priceData = Array.from({ length: 60 }, (_, i) => {
  const base = 2340 + Math.sin(i / 8) * 30 + Math.random() * 15;
  return {
    time: `${String(Math.floor(i / 4) + 1).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`,
    price: Math.round(base * 100) / 100,
    volume: Math.floor(800 + Math.random() * 1200),
    bidVolume: Math.floor(400 + Math.random() * 600),
    askVolume: Math.floor(400 + Math.random() * 600),
  };
});

export const liquidityDepth = [
  { price: 2335, bidDepth: 0, askDepth: 120 },
  { price: 2336, bidDepth: 45, askDepth: 180 },
  { price: 2337, bidDepth: 120, askDepth: 250 },
  { price: 2338, bidDepth: 280, askDepth: 320 },
  { price: 2339, bidDepth: 450, askDepth: 280 },
  { price: 2340, bidDepth: 680, askDepth: 350 },
  { price: 2341, bidDepth: 520, askDepth: 420 },
  { price: 2342, bidDepth: 380, askDepth: 580 },
  { price: 2343, bidDepth: 250, askDepth: 720 },
  { price: 2344, bidDepth: 150, askDepth: 480 },
  { price: 2345, bidDepth: 80, askDepth: 200 },
];

export const orderFlowData = Array.from({ length: 30 }, (_, i) => ({
  time: `T-${30 - i}`,
  aggressiveBuy: Math.floor(200 + Math.random() * 800),
  aggressiveSell: Math.floor(200 + Math.random() * 800),
  passiveBuy: Math.floor(150 + Math.random() * 500),
  passiveSell: Math.floor(150 + Math.random() * 500),
  netFlow: Math.floor(-300 + Math.random() * 600),
}));

export const absorptionData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  absorption: Math.random() > 0.7 ? Math.floor(60 + Math.random() * 40) : Math.floor(Math.random() * 40),
  imbalance: Math.floor(-50 + Math.random() * 100),
  vacuum: Math.random() > 0.8 ? Math.floor(50 + Math.random() * 50) : Math.floor(Math.random() * 20),
}));

export const comexSpotData = Array.from({ length: 40 }, (_, i) => {
  const base = 2340 + Math.sin(i / 6) * 25;
  return {
    date: `Day ${i + 1}`,
    comex: Math.round((base + Math.random() * 8 - 4) * 100) / 100,
    spot: Math.round((base + Math.random() * 6 - 3) * 100) / 100,
    basis: Math.round((Math.random() * 4 - 2) * 100) / 100,
  };
});

export const probabilityData = [
  { range: '<-3σ', probability: 0.5, historical: 0.3 },
  { range: '-3σ to -2σ', probability: 4.2, historical: 4.4 },
  { range: '-2σ to -1σ', probability: 13.4, historical: 13.6 },
  { range: '-1σ to 0', probability: 34.1, historical: 34.1 },
  { range: '0 to +1σ', probability: 34.1, historical: 33.8 },
  { range: '+1σ to +2σ', probability: 13.4, historical: 13.5 },
  { range: '+2σ to +3σ', probability: 4.2, historical: 4.1 },
  { range: '>+3σ', probability: 0.5, historical: 0.2 },
];

export const backtestResults = {
  totalTrades: 847,
  winRate: 58.3,
  profitFactor: 1.82,
  sharpeRatio: 1.45,
  maxDrawdown: -12.4,
  avgRR: 2.1,
  expectancy: 0.42,
  monthlyReturns: Array.from({ length: 24 }, (_, i) => ({
    month: `M${i + 1}`,
    return: Math.round((-5 + Math.random() * 15) * 100) / 100,
    cumulative: 0,
  })),
};

// Calculate cumulative returns
let cum = 0;
backtestResults.monthlyReturns.forEach((m) => {
  cum += m.return;
  m.cumulative = Math.round(cum * 100) / 100;
});

export const volatilityData = Array.from({ length: 50 }, (_, i) => ({
  time: i,
  realized: Math.round((8 + Math.sin(i / 5) * 4 + Math.random() * 3) * 100) / 100,
  implied: Math.round((10 + Math.cos(i / 7) * 3 + Math.random() * 2) * 100) / 100,
  parkinson: Math.round((7 + Math.sin(i / 4) * 3 + Math.random() * 2) * 100) / 100,
}));

export const macroCorrelation = [
  { factor: 'DXY', correlation: -0.72, pValue: 0.001, significance: '***' },
  { factor: 'US 10Y Yield', correlation: -0.58, pValue: 0.003, significance: '**' },
  { factor: 'VIX', correlation: 0.45, pValue: 0.012, significance: '*' },
  { factor: 'Fed Funds Rate', correlation: -0.65, pValue: 0.002, significance: '**' },
  { factor: 'CPI YoY', correlation: 0.52, pValue: 0.008, significance: '**' },
  { factor: 'Real Yield', correlation: -0.78, pValue: 0.001, significance: '***' },
  { factor: 'Silver/Gold Ratio', correlation: 0.83, pValue: 0.001, significance: '***' },
  { factor: 'Oil (WTI)', correlation: 0.31, pValue: 0.045, significance: '*' },
];

export const positioningData = [
  { category: 'Managed Money Long', current: 285000, previous: 278000, change: 7000 },
  { category: 'Managed Money Short', current: 42000, previous: 38000, change: 4000 },
  { category: 'Swap Dealer Long', current: 15000, previous: 18000, change: -3000 },
  { category: 'Swap Dealer Short', current: 120000, previous: 115000, change: 5000 },
  { category: 'Producer/Merchant Long', current: 95000, previous: 92000, change: 3000 },
  { category: 'Producer/Merchant Short', current: 180000, previous: 185000, change: -5000 },
];

export const marketRegimeData = [
  { period: 'Week 1', regime: 'Trending Up', confidence: 78, volRegime: 'Normal' },
  { period: 'Week 2', regime: 'Trending Up', confidence: 82, volRegime: 'Normal' },
  { period: 'Week 3', regime: 'Range Bound', confidence: 65, volRegime: 'Low' },
  { period: 'Week 4', regime: 'Range Bound', confidence: 71, volRegime: 'Low' },
  { period: 'Week 5', regime: 'Trending Down', confidence: 58, volRegime: 'Elevated' },
  { period: 'Week 6', regime: 'Volatile', confidence: 45, volRegime: 'High' },
  { period: 'Week 7', regime: 'Trending Up', confidence: 73, volRegime: 'Normal' },
  { period: 'Week 8', regime: 'Trending Up', confidence: 85, volRegime: 'Normal' },
];
