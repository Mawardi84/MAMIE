import { useState } from 'react';
import { useAsset } from '../context/AssetContext';
import { useAssetQuote } from '../hooks/useDataHooks';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function TradingPanel() {
  const { currentAsset } = useAsset();
  const { data: quote } = useAssetQuote(currentAsset);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');

  const total = quote && quantity ? parseFloat(quantity) * quote.price : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock order submission
    alert(`Mock Order Submitted:\n${side.toUpperCase()} ${quantity} ${currentAsset.shortName}\nType: ${orderType}\nPrice: ${orderType === 'market' ? 'Market' : limitPrice}\nTotal: $${total.toFixed(2)}`);
  };

  return (
    <div className="premium-card p-4">
      <h3 className="text-white font-semibold text-sm mb-4">Place Order</h3>

      {/* Buy/Sell Toggle */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => setSide('buy')}
          className={`py-2 rounded-lg font-semibold text-sm transition-all ${
            side === 'buy'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`py-2 rounded-lg font-semibold text-sm transition-all ${
            side === 'sell'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Order Type */}
      <div className="mb-4">
        <label className="text-gray-400 text-xs mb-2 block">Order Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setOrderType('market')}
            className={`py-1.5 rounded text-xs font-medium transition-colors ${
              orderType === 'market'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('limit')}
            className={`py-1.5 rounded text-xs font-medium transition-colors ${
              orderType === 'limit'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            Limit
          </button>
        </div>
      </div>

      {/* Limit Price (only for limit orders) */}
      {orderType === 'limit' && (
        <div className="mb-4">
          <label className="text-gray-400 text-xs mb-2 block">Limit Price</label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder={quote?.price.toFixed(2)}
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 font-mono"
          />
        </div>
      )}

      {/* Quantity */}
      <div className="mb-4">
        <label className="text-gray-400 text-xs mb-2 block">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 font-mono"
        />
      </div>

      {/* Total */}
      <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Total</span>
          <span className="text-white font-mono font-semibold">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit Button */}
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={!quantity || parseFloat(quantity) <= 0}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            side === 'buy'
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {side === 'buy' ? (
              <ArrowUpCircle className="w-4 h-4" />
            ) : (
              <ArrowDownCircle className="w-4 h-4" />
            )}
            <span>{side === 'buy' ? 'Buy' : 'Sell'} {currentAsset.shortName}</span>
          </div>
        </button>
      </form>

      {/* Info */}
      <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
        <p className="text-amber-300 text-xs">
          ⚠️ This is a demo trading panel. Orders are simulated and do not execute real trades.
        </p>
      </div>
    </div>
  );
}
