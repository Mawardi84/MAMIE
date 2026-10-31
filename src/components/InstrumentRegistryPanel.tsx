/**
 * MAMIE Instrument Registry UI Component
 * PHASE 01: Core Platform & Universal Instrument Registry
 * 
 * This component provides a UI for viewing and managing the instrument registry.
 */

import { useState } from 'react';
import { useInstruments, useAssetClasses, useExchanges, useInstrumentSearch } from '../domain/instrumentRegistry/hooks';
import { instrumentRegistryApi } from '../domain/instrumentRegistry/api';
import { InstrumentSearchFilters, InstrumentStatus, DataVerificationStatus, AssetClassId } from '../domain/instrumentRegistry/types';
import { Search, Filter, Database, RefreshCw } from 'lucide-react';

export default function InstrumentRegistryPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<InstrumentSearchFilters>({});
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: instruments, loading, error, refetch } = useInstrumentSearch(filters, page, pageSize);
  const { data: assetClasses } = useAssetClasses();
  const { data: exchanges } = useExchanges();

  const handleSearch = () => {
    const newFilters: InstrumentSearchFilters = { ...filters };
    
    if (searchQuery) {
      newFilters.symbol = searchQuery;
    } else {
      delete newFilters.symbol;
    }
    
    setFilters(newFilters);
    setPage(1);
  };

  const handleFilterChange = (key: keyof InstrumentSearchFilters, value: any) => {
    const newFilters = { ...filters };
    if (value) {
      (newFilters as any)[key] = value;
    } else {
      delete (newFilters as any)[key];
    }
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPage(1);
  };

  const getStatusColor = (status: InstrumentStatus) => {
    switch (status) {
      case 'ACTIVE': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'IPO': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'SUSPENDED': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'DELISTED': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'EXPIRED': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      case 'MATURED': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      case 'INACTIVE': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getVerificationColor = (status: DataVerificationStatus) => {
    switch (status) {
      case 'VERIFIED': return 'text-emerald-400';
      case 'PARTIALLY_VERIFIED': return 'text-amber-400';
      case 'NOT_VERIFIED': return 'text-red-400';
      case 'NOT_CONFIGURED': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const totalPages = instruments ? Math.ceil(instruments.total / pageSize) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold flex items-center gap-2">
            <Database className="w-6 h-6" />
            Universal Instrument Registry
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Multi-asset instrument management with stable IDs and historical tracking
          </p>
        </div>
        <button
          onClick={refetch}
          className="btn-premium flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="premium-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <button onClick={handleSearch} className="btn-premium">
            Search
          </button>
          <button onClick={handleClearFilters} className="btn-premium">
            Clear
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Asset Class</label>
            <select
              value={filters.asset_class_id || ''}
              onChange={(e) => handleFilterChange('asset_class_id', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All</option>
              {assetClasses.map((ac: any) => (
                <option key={ac.asset_class_id} value={ac.asset_class_id}>
                  {ac.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Exchange</label>
            <select
              value={filters.exchange_id || ''}
              onChange={(e) => handleFilterChange('exchange_id', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All</option>
              {exchanges.map((ex: any) => (
                <option key={ex.exchange_id} value={ex.exchange_id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="IPO">IPO</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DELISTED">Delisted</option>
              <option value="EXPIRED">Expired</option>
              <option value="MATURED">Matured</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {instruments && (
        <div className="text-sm text-gray-400">
          Showing {instruments.instruments.length} of {instruments.total} instruments
        </div>
      )}

      {/* Instrument List */}
      <div className="premium-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading instruments...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            Error: {error}
          </div>
        ) : !instruments || instruments.instruments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No instruments found. Try adjusting your filters or create a new instrument.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-900/50 border-b border-gray-800">
                <tr>
                  <th className="text-left text-gray-400 font-semibold px-4 py-3">Symbol</th>
                  <th className="text-left text-gray-400 font-semibold px-4 py-3">Name</th>
                  <th className="text-left text-gray-400 font-semibold px-4 py-3">Asset Class</th>
                  <th className="text-left text-gray-400 font-semibold px-4 py-3">Exchange</th>
                  <th className="text-left text-gray-400 font-semibold px-4 py-3">Status</th>
                  <th className="text-left text-gray-400 font-semibold px-4 py-3">Verification</th>
                  <th className="text-left text-gray-400 font-semibold px-4 py-3">Instrument ID</th>
                </tr>
              </thead>
              <tbody>
                {instruments.instruments.map((instrument: any) => {
                  const assetClass = assetClasses.find((ac: any) => ac.asset_class_id === instrument.asset_class_id);
                  const exchange = exchanges.find((ex: any) => ex.exchange_id === instrument.exchange_id);

                  return (
                    <tr key={instrument.instrument_id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-white font-mono font-semibold">{instrument.primary_symbol}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-300">{instrument.instrument_name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-400">{assetClass?.name || instrument.asset_class_id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-400">{exchange?.name || instrument.exchange_id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(instrument.status)}`}>
                          {instrument.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono ${getVerificationColor(instrument.data_verification_status)}`}>
                          {instrument.data_verification_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-500 text-xs font-mono">
                          {instrument.instrument_id.substring(0, 8)}...
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-premium disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-400 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-premium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-300 text-xs">
          <strong>PHASE 01 Implementation:</strong> This instrument registry uses localStorage for persistence. 
          In future phases, this will be migrated to a PostgreSQL database with full API support.
          All instruments have stable UUID-based instrument_id fields that persist across symbol changes.
        </p>
      </div>
    </div>
  );
}
