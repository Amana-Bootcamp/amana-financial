"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceDot } from 'recharts';

// --- API CONSTANTS ---
const API_URL = '/api/portfolio';


// --- UTILITY FUNCTIONS ---

// Formats a number as a currency string.
const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined || isNaN(value)) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
};

// Formats a number as a short currency string with k/M/B suffixes for axes.
const formatCurrencyShort = (value: number) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0';
  }
  const numValue = Number(value);
  const abs = Math.abs(numValue);
  if (abs >= 1_000_000_000) return `$${(numValue / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(numValue / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(numValue / 1_000).toFixed(1)}k`;
  return `$${Math.round(numValue)}`;
};

// Formats a number as a percentage string.
const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  return `${Number(value).toFixed(2)}%`;
};

// Determines the text color for profit/loss values based on whether they are positive or negative.
const getPnlClass = (pnl) => {
  if (pnl === null || pnl === undefined || isNaN(pnl)) {
    return 'text-gray-500';
  }
  return Number(pnl) >= 0 ? 'text-green-500' : 'text-red-500';
};


// --- CHILD COMPONENTS ---

// Displays a single key performance indicator (KPI) with a title and value.
const KpiCard = ({ title, value, className = '' }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className={`text-2xl font-semibold ${className}`}>{value}</p>
  </div>
);

// Renders the main header for the application, including the company name and navigation links.
const Header = ({ companyInfo, page, setPage, onRefresh, isRefreshing }) => (
  <header className="bg-white shadow-md">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-gray-800">{companyInfo.name}</div>
      <div className="flex items-center space-x-4">
        <nav className="flex space-x-4">
          <NavLink text="Dashboard" page={page} setPage={setPage} />
          <NavLink text="Portfolio" page={page} setPage={setPage} />
          <NavLink text="Sectors" page={page} setPage={setPage} />
          <NavLink text="Countries" page={page} setPage={setPage} />
        </nav>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
        >
          <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
    </div>
  </header>
);

// Represents a single navigation link in the header.
const NavLink = ({ text, page, setPage }) => (
  <button
    onClick={() => setPage({ view: text.toLowerCase() })}
    className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
      page.view === text.toLowerCase() ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200'
    }`}
  >
    {text}
  </button>
);

// This new component renders the filter dropdowns.
const PortfolioFilters = ({ filters, setFilters, allHoldings }) => {
    // We derive the unique sectors and countries from the complete dataset to populate the dropdowns.
    const uniqueSectors = ['all', ...Array.from(new Set(allHoldings.map(h => h.sector)))];
    const uniqueCountries = ['all', ...Array.from(new Set(allHoldings.map(h => h.country)))];

    // This function handles changes to any filter dropdown.
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-start md:items-center">
            <span className="font-semibold text-gray-700">Filter by:</span>
            <div className="flex space-x-4">
                <div>
                    <label htmlFor="sector" className="sr-only">Sector</label>
                    <select 
                        name="sector" 
                        id="sector"
                        value={filters.sector}
                        onChange={handleFilterChange}
                        className="rounded-md border-gray-300 shadow-sm cursor-pointer focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        {uniqueSectors.map(sector => <option key={sector} value={sector}>{sector === 'all' ? 'All Sectors' : sector}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="country" className="sr-only">Country</label>
                    <select 
                        name="country" 
                        id="country"
                        value={filters.country}
                        onChange={handleFilterChange}
                        className="rounded-md border-gray-300 shadow-sm cursor-pointer focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        {uniqueCountries.map(country => <option key={country} value={country}>{country === 'all' ? 'All Countries' : country}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};


// --- PAGE COMPONENTS ---

// Displays the main dashboard, including a portfolio summary and charts.
// Note: The charts on this page now update based on the filtered data.
const DashboardPage = ({ summary, holdings, setPage, timeframe, setTimeframe }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    // Build portfolio-level monthly history by summing each holding's
    // shares_held * monthly price. This respects current filters.
    const months: string[] = (holdings[0]?.price_history_2024?.map((p: any) => p.month)) ?? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthsByFrame = { '12M': 12, '6M': 6, '3M': 3 } as const;
    const visibleMonths = months.slice(-((monthsByFrame as any)[timeframe] || 12));
    const portfolioHistoryData = visibleMonths.map((month: string) => {
        const totalValue = holdings.reduce((sum: number, h: any) => {
            const point = h.price_history_2024?.find((p: any) => p.month === month);
            if (!point) return sum;
            return sum + (point.value * h.shares_held);
        }, 0 as number);
        return { month, value: totalValue };
    });

    const sectorData = holdings.reduce((acc, holding) => {
        const sector = acc.find(item => item.name === holding.sector);
        if (sector) {
            sector.value += holding.market_value;
        } else {
            acc.push({ name: holding.sector, value: holding.market_value });
        }
        return acc;
    }, []);
    
    const countryData = holdings.reduce((acc, holding) => {
        const country = acc.find(item => item.name === holding.country);
        if (country) {
            country.value += holding.market_value;
        } else {
            acc.push({ name: holding.country, value: holding.market_value });
        }
        return acc;
    }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Total Market Value" value={formatCurrency(summary.total_market_value)} />
        <KpiCard title="Unrealized P/L" value={formatCurrency(summary.total_unrealized_pnl)} className={getPnlClass(summary.total_unrealized_pnl)} />
        <KpiCard title="YTD Return" value={formatPercentage(summary.ytd_return)} className={getPnlClass(summary.ytd_return)} />
        <KpiCard title="Number of Holdings" value={summary.number_of_holdings} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Portfolio Value Over 2024</h3>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {['12M','6M','3M'].map((label) => (
              <button
                key={label}
                onClick={() => setTimeframe(label)}
                className={`px-3 py-1 text-sm border cursor-pointer transition-colors ${timeframe === label ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-800 hover:text-white'} ${label === '12M' ? 'rounded-l-md' : ''} ${label === '3M' ? 'rounded-r-md' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={portfolioHistoryData} margin={{ left: 10, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            {(() => {
              const values = portfolioHistoryData.map((d: any) => d.value);
              const minVal = Math.min(...values);
              const maxVal = Math.max(...values);
              const range = Math.max(1, maxVal - minVal || minVal * 0.05);
              const pad = range * 0.1;
              const axisMin = Math.max(0, minVal - pad);
              const axisMax = maxVal + pad;
              return (
                <YAxis
                  tickFormatter={(value) => formatCurrencyShort(value as number)}
                  domain={[axisMin, axisMax]}
                  tickCount={6}
                  width={80}
                  tickMargin={8}
                />
              );
            })()}
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#2563eb" name="Portfolio Value" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Sector Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sectorData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {sectorData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Country Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={countryData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#82ca9d" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {countryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// This page now includes the filter component and displays the filtered list of holdings.
const PortfolioPage = ({ holdings, setPage, allHoldings, filters, setFilters }) => {
  const [sort, setSort] = useState({ key: 'market_value', dir: 'desc' });

  const sortedHoldings = useMemo(() => {
    const arr = [...holdings];
    arr.sort((a: any, b: any) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      const key = sort.key as any;
      const aVal = a[key];
      const bVal = b[key];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal > bVal ? dir : aVal < bVal ? -dir : 0;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return aStr > bStr ? dir : aStr < bStr ? -dir : 0;
    });
    return arr;
  }, [holdings, sort]);

  const toggleSort = (key: any) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
      }
      const isText = key === 'name' || key === 'sector';
      return { key, dir: isText ? 'asc' : 'desc' };
    });
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Portfolio Holdings</h2>
      <PortfolioFilters filters={filters} setFilters={setFilters} allHoldings={allHoldings} />
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => toggleSort('name')} className="flex items-center gap-1 cursor-pointer hover:underline">
                  Name {sort.key === 'name' && <span>{sort.dir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => toggleSort('sector')} className="flex items-center gap-1 cursor-pointer hover:underline">
                  Sector {sort.key === 'sector' && <span>{sort.dir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => toggleSort('market_value')} className="flex items-center gap-1 w-full justify-end cursor-pointer hover:underline">
                  Market Value {sort.key === 'market_value' && <span>{sort.dir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => toggleSort('unrealized_pnl')} className="flex items-center gap-1 w-full justify-end cursor-pointer hover:underline">
                  Unrealized P/L {sort.key === 'unrealized_pnl' && <span>{sort.dir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => toggleSort('weight_in_portfolio')} className="flex items-center gap-1 w-full justify-end cursor-pointer hover:underline">
                  Weight {sort.key === 'weight_in_portfolio' && <span>{sort.dir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holdings.length > 0 ? (
              sortedHoldings.map(stock => (
                <tr key={stock.id} onClick={() => setPage({ view: 'stock', id: stock.id })} className="hover:bg-gray-100 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{stock.name}</div>
                    <div className="text-sm text-gray-500">{stock.symbol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.sector}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">{formatCurrency(stock.market_value, stock.currency)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${getPnlClass(stock.unrealized_pnl)}`}>{formatCurrency(stock.unrealized_pnl, stock.currency)} ({formatPercentage(stock.unrealized_pnl_percent)})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{formatPercentage(stock.weight_in_portfolio)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                    No holdings match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Provides an in-depth view of a single selected stock, including its price history.
const StockDetailPage = ({ stock, setPage }) => {
  if (!stock) return <p>Stock not found.</p>;

  const [activeTab, setActiveTab] = useState('overview');
  const [showDividends, setShowDividends] = useState(false);
  const dividendMonths = ['Mar','Jun','Sep','Dec'];
  const monthToValue: Record<string, number> = Object.fromEntries(
    (stock.price_history_2024 || []).map((p: any) => [p.month, p.value])
  );

  return (
    <div>
      <button onClick={() => setPage({ view: 'portfolio' })} className="mb-4 text-sm text-blue-600 hover:underline cursor-pointer">&larr; Back to Portfolio</button>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">{stock.name} ({stock.symbol})</h2>
        <div className="text-3xl font-bold">{formatCurrency(stock.current_price, stock.currency)}</div>
      </div>

      <div className="mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="tablist">
          {['overview','metrics','dividends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm border cursor-pointer transition-colors ${activeTab === tab ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-800 hover:text-white'} ${tab === 'overview' ? 'rounded-l-md' : ''} ${tab === 'dividends' ? 'rounded-r-md' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <KpiCard title="Sector" value={stock.sector} />
            <KpiCard title="Country" value={stock.country} />
            <KpiCard title="Market Cap" value={stock.market_cap} />
            <KpiCard title="P/E Ratio" value={stock.pe_ratio} />
            <KpiCard title="Div. Yield" value={formatPercentage(stock.dividend_yield)} />
            <KpiCard title="Weight" value={formatPercentage(stock.weight_in_portfolio)} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">2024 Price History ({stock.currency})</h3>
              <button
                onClick={() => setShowDividends(v => !v)}
                className={`px-3 py-1 text-sm rounded-md border cursor-pointer hover:opacity-90 ${showDividends ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {showDividends ? 'Hide Dividends' : 'Show Dividends'}
              </button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={stock.price_history_2024}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip formatter={(value) => formatCurrency(value, stock.currency)} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Price" />
                {showDividends && dividendMonths.map((m) => (
                  monthToValue[m] != null ? (
                    <ReferenceDot key={m} x={m} y={monthToValue[m]} r={6} fill="#10b981" stroke="none" />
                  ) : null
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {activeTab === 'metrics' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Key Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KpiCard title="Avg. Cost Basis" value={formatCurrency(stock.avg_cost_basis, stock.currency)} />
            <KpiCard title="Shares Held" value={stock.shares_held} />
            <KpiCard title="Market Value" value={formatCurrency(stock.market_value, stock.currency)} />
            <KpiCard title="Unrealized P/L" value={`${formatCurrency(stock.unrealized_pnl, stock.currency)} (${formatPercentage(stock.unrealized_pnl_percent)})`} className={getPnlClass(stock.unrealized_pnl)} />
          </div>
        </div>
      )}

      {activeTab === 'dividends' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Dividends</h3>
          {(() => {
            const annualDividendPerShare = stock.current_price * (stock.dividend_yield / 100);
            const quarterlyDividend = annualDividendPerShare / 4;
            return (
              <div className="space-y-2 text-sm text-gray-700">
                <p>Estimated annual dividend per share: <span className="font-semibold">{formatCurrency(annualDividendPerShare, stock.currency)}</span></p>
                <p>Approx. quarterly payments (Mar, Jun, Sep, Dec): <span className="font-semibold">{formatCurrency(quarterlyDividend, stock.currency)}</span></p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

// Displays a breakdown of the portfolio by sector.
const SectorBreakdownPage = ({ holdings }) => {
    const sectorSummary = holdings.reduce((acc, holding) => {
        if (!acc[holding.sector]) {
            acc[holding.sector] = { market_value: 0, count: 0 };
        }
        acc[holding.sector].market_value += holding.market_value;
        acc[holding.sector].count += 1;
        return acc;
    }, {});

    const chartData = Object.entries(sectorSummary).map(([name, data]) => ({ name, ...data }));
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Sector Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Value by Sector</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis type="category" dataKey="name" width={120}/>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="market_value" fill="#8884d8" name="Market Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white shadow overflow-hidden rounded-lg">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sector</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Market Value</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"># of Holdings</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(sectorSummary).map(([sector, data]) => (
                        <tr key={sector} className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sector}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(data.market_value)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{data.count}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    );
};

// Displays a breakdown of the portfolio by country.
const CountryBreakdownPage = ({ holdings }) => {
    const countrySummary = holdings.reduce((acc, holding) => {
        if (!acc[holding.country]) {
            acc[holding.country] = { market_value: 0, count: 0 };
        }
        acc[holding.country].market_value += holding.market_value;
        acc[holding.country].count += 1;
        return acc;
    }, {});

    const chartData = Object.entries(countrySummary).map(([name, data]) => ({ name, ...data }));
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Country Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Value by Country</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis type="category" dataKey="name" width={100}/>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="market_value" fill="#82ca9d" name="Market Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white shadow overflow-hidden rounded-lg">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Market Value</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"># of Holdings</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(countrySummary).map(([country, data]) => (
                        <tr key={country} className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{country}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(data.market_value)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{data.count}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    );
};


// --- MAIN APP COMPONENT ---

// The root component of the application. It now manages the filter state and API data.
export default function App() {
  const [page, setPage] = useState({ view: 'dashboard' });
  const [filters, setFilters] = useState({ sector: 'all', country: 'all' });
  const [timeframe, setTimeframe] = useState('12M');
  
  // State for API data management
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from API
  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform the API data to match our expected format
      const transformedData = {
        ...data,
        holdings: data.holdings?.map(holding => ({
          ...holding,
          price_history_2024: holding.price_history_2024?.map(item => ({
            month: item.month.substring(0, 3), // Convert "January" to "Jan"
            value: item.value
          }))
        }))
      };
      
      setPortfolioData(transformedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // useMemo is a performance optimization. The filtering logic will only re-run
  // when the `filters` state or portfolioData changes, not on every render.
  const filteredHoldings = useMemo(() => {
    if (!portfolioData?.holdings) return [];
    return portfolioData.holdings.filter(holding => {
        const sectorMatch = filters.sector === 'all' || holding.sector === filters.sector;
        const countryMatch = filters.country === 'all' || holding.country === filters.country;
        return sectorMatch && countryMatch;
    });
  }, [filters, portfolioData]);

  // useEffect hook demonstrates reacting to data changes.
  // This will log a message to the browser console whenever the filteredHoldings array is updated.
  useEffect(() => {
    console.log(`Filtered data updated. Now showing ${filteredHoldings.length} holdings.`);
  }, [filteredHoldings]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading portfolio data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200">
            <p className="text-red-600 mb-4">Error loading portfolio data: {error}</p>
            <button 
              onClick={fetchPortfolioData}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (!portfolioData) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">No data available</p>
        </div>
      );
    }

    switch (page.view) {
      case 'dashboard':
        // Dashboard charts are now based on filtered data to stay consistent.
        return <DashboardPage summary={portfolioData.portfolio_summary} holdings={filteredHoldings} setPage={setPage} timeframe={timeframe} setTimeframe={setTimeframe} />;
      case 'portfolio':
        // Pass the filter state, setter function, and full dataset to the Portfolio page.
        return <PortfolioPage 
                    holdings={filteredHoldings} 
                    setPage={setPage}
                    allHoldings={portfolioData.holdings}
                    filters={filters}
                    setFilters={setFilters}
                />;
      case 'stock':
        // The stock detail page uses the original dataset to find the stock by ID.
        const selectedStock = portfolioData.holdings.find(s => s.id === (page as any).id);
        return <StockDetailPage stock={selectedStock} setPage={setPage} />;
      case 'sectors':
        return <SectorBreakdownPage holdings={filteredHoldings} />;
      case 'countries':
        return <CountryBreakdownPage holdings={filteredHoldings} />;
      default:
        return <DashboardPage summary={portfolioData.portfolio_summary} holdings={filteredHoldings} setPage={setPage} timeframe={timeframe} setTimeframe={setTimeframe} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {portfolioData && (
        <Header 
          companyInfo={portfolioData.company_info} 
          page={page} 
          setPage={setPage}
          onRefresh={fetchPortfolioData}
          isRefreshing={loading}
        />
      )}
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}

