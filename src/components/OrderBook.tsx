import { useMemo } from 'react';
import { useAsset } from '../context/AssetContext';
import { useAssetQuote } from '../hooks/useDataHooks';

export default function OrderBook() {
  const { currentAsset } = useAsset();
  const { data: quote } = useAssetQuote(currentAsset);

  // Generate realistic order book based on current price
  const orderBook = useMemo(() => {
    if (!quote) return { bids: [], asks: [] };

    const price = quote.price;
    const tickSize = currentAsset.tickSize;
    const decimals = currentAsset.category === 'forex' ? 5 : 2;

    // Generate bids (buy orders) - descending price
    const bids = Array.from({ length: 15 }, (_, i) => {
      const bidPrice = price - (i + 1) * tickSize * (1 + Math.random() * 2);
      const size = Math.floor(10 + Math.random() * 500 * (1 + i * 0.3));
      const total = bidPrice * size;
      return {
        price: Number(bidPrice.toFixed(decimals)),
        size,
        total: Number(total.toFixed(2)),
      };
    });

    // Generate asks (sell orders) - ascending price
    const asks = Array.from({ length: 15 }, (_, i) => {
      const askPrice = price + (i + 1) * tickSize * (1 + Math.random() * 2);
      const size = Math.floor(10 + Math.random() * 500 * (1 + i * 0.3));
      const total = askPrice * size;
      return {
        price: Number(askPrice.toFixed(decimals)),
        size,
        total: Number(total.toFixed(2)),
      };
    }).reverse(); // Reverse to show closest ask at top

    return { bids, asks };
  }, [quote, currentAsset]);

  const maxSize = Math.max(
    ...orderBook.bids.map(b => b.size),
    ...orderBook.asks.map(a => a.size)
  );

  const spread = orderBook.bids[0] && orderBook.asks[orderBook.asks.length - 1]
    ? orderBook.asks[orderBook.asks.length - 1].price - orderBook.bids[0].price
    : 0;

  const spreadPercent = quote ? (spread / quote.price) * 100 : 0;

  return (
    <div className="premium-card flex flex-col h-full">
      <div className="p-4 border-b border-gray-800/50">
        <h3 className="text-white font-semibold text-sm">Order Book</h3>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-gray-400">Size</span>
          <span className="text-gray-400">Price</span>
          <span className="text-gray-400">Total</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks (Sell Orders) */}
        <div className="flex-1 overflow-hidden flex flex-col justify-end">
          {orderBook.asks.map((ask, i) => (
            <div
              key={`ask-${i}`}
              className="relative flex items-center justify-between px-4 py-1 text-xs font-mono hover:bg-gray-800/30 transition-colors"
            >
              <div
                className="absolute right-0 top-0 bottom-0 bg-red-500/10"
                style={{ width: `${(ask.size / maxSize) * 100}%` }}
              />
              <span className="text-gray-400 relative z-10">{ask.size.toLocaleString()}</span>
              <span className="text-red-400 font-semibold relative z-10">{ask.price.toFixed(currentAsset.category === 'forex' ? 5 : 2)}</span>
              <span className="text-gray-500 relative z-10">{ask.total.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="px-4 py-2 bg-gray-900/50 border-y border-gray-800/50 flex items-center justify-between">
          <span className="text-gray-400 text-xs">Spread</span>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-mono font-semibold">
              {spread.toFixed(currentAsset.category === 'forex' ? 5 : 2)}
            </span>
            <span className="text-gray-400 text-xs">
              ({spreadPercent.toFixed(3)}%)
            </span>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex-1 overflow-hidden">
          {orderBook.bids.map((bid, i) => (
            <div
              key={`bid-${i}`}
              className="relative flex items-center justify-between px-4 py-1 text-xs font-mono hover:bg-gray-800/30 transition-colors"
            >
              <div
                className="absolute right-0 top-0 bottom-0 bg-emerald-500/10"
                style={{ width: `${(bid.size / maxSize) * 100}%` }}
              />
              <span className="text-gray-400 relative z-10">{bid.size.toLocaleString()}</span>
              <span className="text-emerald-400 font-semibold relative z-10">{bid.price.toFixed(currentAsset.category === 'forex' ? 5 : 2)}</span>
              <span className="text-gray-500 relative z-10">{bid.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
