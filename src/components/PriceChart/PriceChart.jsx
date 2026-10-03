import { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import cryptoApi from '../../services/cryptoApi';
import { formatCurrency, formatChartDate, formatFullDateTime, formatPercentage } from '../../utils/formatters';
import { ChartSkeleton } from '../Common/LoadingSkeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './PriceChart.css';

const TIMEFRAMES = [
  { label: '24H', value: '1' },
  { label: '7D', value: '7' },
  { label: '30D', value: '30' },
  { label: '90D', value: '90' },
  { label: '1Y', value: '365' },
];

const CustomTooltip = ({ active, payload, currencySymbol = '$' }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-chart-tooltip">
        <p className="tooltip-price">{formatCurrency(data.price, currencySymbol)}</p>
        <p className="tooltip-date">{data.fullDate}</p>
      </div>
    );
  }
  return null;
};

const PriceChart = ({ coinId, currency }) => {
  const [days, setDays] = useState('7');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchChart = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cryptoApi.getCoinMarketChart(coinId, currency.name, days);
        if (!isMounted) return;

        if (data && data.prices && data.prices.length > 0) {
          const formatted = data.prices.map(([timestamp, price]) => ({
            timestamp,
            price,
            displayDate: formatChartDate(timestamp, days),
            fullDate: formatFullDateTime(timestamp),
          }));
          setChartData(formatted);
        } else {
          setChartData([]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading chart data:', err);
        setError('Unable to load chart data for the selected period.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChart();

    return () => {
      isMounted = false;
    };
  }, [coinId, currency.name, days]);

  // Performance stats over the timeframe
  const stats = useMemo(() => {
    if (!chartData || chartData.length < 2) return null;
    const first = chartData[0].price;
    const last = chartData[chartData.length - 1].price;
    const changePct = ((last - first) / first) * 100;
    const prices = chartData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return {
      first,
      last,
      changePct,
      isPositive: changePct >= 0,
      min,
      max,
    };
  }, [chartData]);

  const isPositive = stats ? stats.isPositive : true;
  const strokeColor = isPositive ? '#00d580' : '#ff4d4d';
  const gradientId = `chartGradient_${coinId}_${days}`;

  return (
    <div className="price-chart-card">
      <div className="chart-header">
        <div className="chart-title-group">
          <span className="chart-title">Price Performance</span>
          {stats && (
            <div className={`chart-change-badge ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{formatPercentage(stats.changePct)}</span>
              <span className="timeframe-label">
                ({TIMEFRAMES.find((t) => t.value === days)?.label})
              </span>
            </div>
          )}
        </div>

        {/* Timeframe Buttons */}
        <div className="timeframe-buttons">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              className={`tf-btn ${days === tf.value ? 'active' : ''}`}
              onClick={() => setDays(tf.value)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <ChartSkeleton />
      ) : error ? (
        <div className="chart-error">
          <p>{error}</p>
          <button className="retry-link" onClick={() => setDays(days)}>
            Retry Chart
          </button>
        </div>
      ) : chartData.length === 0 ? (
        <div className="chart-empty">
          <p>No price history available for this coin.</p>
        </div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
              <XAxis
                dataKey="displayDate"
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={40}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(val) => formatCurrency(val, currency.symbol, 0)}
              />
              <Tooltip content={<CustomTooltip currencySymbol={currency.symbol} />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>

          {stats && (
            <div className="chart-quick-stats">
              <div className="qs-item">
                <span className="qs-label">Period Low:</span>
                <span className="qs-val">{formatCurrency(stats.min, currency.symbol)}</span>
              </div>
              <div className="qs-item">
                <span className="qs-label">Period High:</span>
                <span className="qs-val">{formatCurrency(stats.max, currency.symbol)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceChart;

