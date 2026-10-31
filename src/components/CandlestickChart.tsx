import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { useAsset } from '../context/AssetContext';
import { fetchAssetPriceData } from '../services/dataService';
import { Maximize2, Minimize2 } from 'lucide-react';

const TIMEFRAMES = [
  { label: '1m', value: '1m', range: '1d' },
  { label: '5m', value: '5m', range: '5d' },
  { label: '15m', value: '15m', range: '1mo' },
  { label: '1H', value: '60m', range: '3mo' },
  { label: '4H', value: '60m', range: '6mo' },
  { label: '1D', value: '1d', range: '2y' },
  { label: '1W', value: '1wk', range: '5y' },
];

export default function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const { currentAsset } = useAsset();
  const [timeframe, setTimeframe] = useState('1D');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentTimeframe = TIMEFRAMES.find(t => t.label === timeframe) || TIMEFRAMES[5];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9ca3af',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(55, 65, 81, 0.3)' },
        horzLines: { color: 'rgba(55, 65, 81, 0.3)' },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: 'rgba(245, 158, 11, 0.4)',
          width: 1,
          style: 2,
          labelBackgroundColor: '#f59e0b',
        },
        horzLine: {
          color: 'rgba(245, 158, 11, 0.4)',
          width: 1,
          style: 2,
          labelBackgroundColor: '#f59e0b',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(55, 65, 81, 0.5)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
      },
      timeScale: {
        borderColor: 'rgba(55, 65, 81, 0.5)',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    // Create candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    });

    // Create volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#3b82f6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Load data when asset or timeframe changes
  useEffect(() => {
    const loadData = async () => {
      if (!candlestickSeriesRef.current || !volumeSeriesRef.current) return;

      setLoading(true);
      try {
        const data = await fetchAssetPriceData(
          currentAsset.symbol,
          currentTimeframe.range,
          currentTimeframe.value
        );

        // Transform to candlestick format
        const candleData: CandlestickData<Time>[] = data.map(d => ({
          time: (d.timestamp / 1000) as Time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

        // Transform to volume format
        const volumeData = data.map(d => ({
          time: (d.timestamp / 1000) as Time,
          value: d.volume,
          color: d.close >= d.open ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        }));

        candlestickSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);

        // Fit content
        chartRef.current?.timeScale().fitContent();
      } catch (error) {
        console.error('Failed to load chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentAsset.symbol, currentTimeframe]);

  return (
    <div className="premium-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-semibold text-sm">{currentAsset.shortName} Chart</h3>
          <div className="flex items-center gap-1">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf.label}
                onClick={() => setTimeframe(tf.label)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  timeframe === tf.label
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Chart Container */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10">
            <div className="text-gray-400 text-sm">Loading chart data...</div>
          </div>
        )}
        <div
          ref={chartContainerRef}
          className={`w-full ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[500px]'}`}
        />
      </div>
    </div>
  );
}
