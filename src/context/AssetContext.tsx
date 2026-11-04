import { createContext, useContext, useState, ReactNode } from 'react';
import { Asset, DEFAULT_ASSET, ASSETS, AssetCategory } from '../data/assetRegistry';

interface AssetContextType {
  currentAsset: Asset;
  setCurrentAsset: (asset: Asset) => void;
  currentCategory: AssetCategory;
  setCurrentCategory: (category: AssetCategory) => void;
  watchlist: Asset[];
  addToWatchlist: (asset: Asset) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

const DEFAULT_WATCHLIST: Asset[] = [
  ASSETS[0],  // Gold
  ASSETS[10], // BTC
  ASSETS[16], // WTI Oil
  ASSETS[22], // S&P 500
  ASSETS[6],  // EUR/USD
];

export function AssetProvider({ children }: { children: ReactNode }) {
  const [currentAsset, setCurrentAssetState] = useState<Asset>(DEFAULT_ASSET);
  const [currentCategory, setCurrentCategory] = useState<AssetCategory>('metals');
  const [watchlist, setWatchlist] = useState<Asset[]>(DEFAULT_WATCHLIST);

  const setCurrentAsset = (asset: Asset) => {
    setCurrentAssetState(asset);
    setCurrentCategory(asset.category);
  };

  const addToWatchlist = (asset: Asset) => {
    if (!watchlist.find(a => a.symbol === asset.symbol)) {
      setWatchlist([...watchlist, asset]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(a => a.symbol !== symbol));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.some(a => a.symbol === symbol);
  };

  return (
    <AssetContext.Provider
      value={{
        currentAsset,
        setCurrentAsset,
        currentCategory,
        setCurrentCategory,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

export function useAsset() {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAsset must be used within AssetProvider');
  }
  return context;
}
