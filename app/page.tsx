"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceDot } from 'recharts';

// --- MOCK DATA ---
// This JSON object contains all the portfolio data for Amana Financial.
// In a real-world application, this data would typically be fetched from an API.
const portfolioData = {
  "message": "Amana Financial portfolio data retrieved successfully",
  "company_info": {
    "name": "Amana Financial",
    "founded": "2015",
    "headquarters": "Dubai, UAE",
    "industry": "Investment Management",
    "description": "Leading Arab region focused investment firm specializing in equity portfolios across MENA markets, emphasizing regional growth opportunities and sustainable investing."
  },
  "portfolio_summary": {
    "total_market_value": 269052,
    "total_unrealized_pnl": 15822,
    "total_unrealized_pnl_percent": 6.25,
    "number_of_holdings": 10,
    "ytd_return": 8.1,
    "sharpe_ratio": 1.2,
    "volatility": 12.5
  },
  "holdings": [
    {
      "id": 1,
      "symbol": "2222.SR",
      "name": "Saudi Aramco",
      "sector": "Energy",
      "market": "Saudi Stock Exchange (Tadawul)",
      "country": "Saudi Arabia",
      "currency": "SAR",
      "shares_held": 500,
      "avg_cost_basis": 32.5,
      "current_price": 35.2,
      "market_value": 17600,
      "unrealized_pnl": 1350,
      "unrealized_pnl_percent": 8.31,
      "weight_in_portfolio": 15.2,
      "market_cap": "Large",
      "dividend_yield": 4.8,
      "pe_ratio": 14.2,
      "status": "Active",
      "allocation_type": "Core",
      "acquisition_date": "2024-01-15",
      "last_trade_date": "2024-12-05",
      "price_history_2024": [
        { "month": "Jan", "value": 35.18 },
        { "month": "Feb", "value": 35.78 },
        { "month": "Mar", "value": 35.98 },
        { "month": "Apr", "value": 34.33 },
        { "month": "May", "value": 35.15 },
        { "month": "Jun", "value": 36.31 },
        { "month": "Jul", "value": 36.47 },
        { "month": "Aug", "value": 38.75 },
        { "month": "Sep", "value": 40.01 },
        { "month": "Oct", "value": 41.04 },
        { "month": "Nov", "value": 40.26 },
        { "month": "Dec", "value": 43.37 }
      ]
    },
    {
      "id": 2,
      "symbol": "1180.SR",
      "name": "Al Rajhi Bank",
      "sector": "Financials",
      "market": "Saudi Stock Exchange (Tadawul)",
      "country": "Saudi Arabia",
      "currency": "SAR",
      "shares_held": 300,
      "avg_cost_basis": 95,
      "current_price": 102.5,
      "market_value": 30750,
      "unrealized_pnl": 2250,
      "unrealized_pnl_percent": 7.89,
      "weight_in_portfolio": 26.5,
      "market_cap": "Large",
      "dividend_yield": 3.2,
      "pe_ratio": 12.8,
      "status": "Active",
      "allocation_type": "Core",
      "acquisition_date": "2024-02-10",
      "last_trade_date": "2024-12-05",
      "price_history_2024": [
        { "month": "Jan", "value": 97.61 },
        { "month": "Feb", "value": 101.09 },
        { "month": "Mar", "value": 99.75 },
        { "month": "Apr", "value": 100.08 },
        { "month": "May", "value": 104.83 },
        { "month": "Jun", "value": 102.9 },
        { "month": "Jul", "value": 105.96 },
        { "month": "Aug", "value": 108.48 },
        { "month": "Sep", "value": 104.94 },
        { "month": "Oct", "value": 104.81 },
        { "month": "Nov", "value": 102.73 },
        { "month": "Dec", "value": 109.2 }
      ]
    },
    {
      "id": 3,
      "symbol": "ADNOCDIST.AD",
      "name": "ADNOC Distribution",
      "sector": "Energy",
      "market": "Abu Dhabi Securities Exchange",
      "country": "UAE",
      "currency": "AED",
      "shares_held": 800,
      "avg_cost_basis": 4.2,
      "current_price": 4.85,
      "market_value": 3880,
      "unrealized_pnl": 520,
      "unrealized_pnl_percent": 15.48,
      "weight_in_portfolio": 3.3,
      "market_cap": "Large",
      "dividend_yield": 6.2,
      "pe_ratio": 18.5,
      "status": "Active",
      "allocation_type": "Growth",
      "acquisition_date": "2024-03-22",
      "last_trade_date": "2024-12-05",
      "price_history_2024": [
        { "month": "Jan", "value": 4.04 },
        { "month": "Feb", "value": 3.88 },
        { "month": "Mar", "value": 3.98 },
        { "month": "Apr", "value": 3.82 },
        { "month": "May", "value": 4.12 },
        { "month": "Jun", "value": 4.31 },
        { "month": "Jul", "value": 4.42 },
        { "month": "Aug", "value": 4.29 },
        { "month": "Sep", "value": 4.37 },
        { "month": "Oct", "value": 4.36 },
        { "month": "Nov", "value": 4.62 },
        { "month": "Dec", "value": 4.5 }
      ]
    },
    {
      "id": 4,
      "symbol": "EMAAR.DU",
      "name": "Emaar Properties",
      "sector": "Real Estate",
      "market": "Dubai Financial Market",
      "country": "UAE",
      "currency": "AED",
      "shares_held": 1200,
      "avg_cost_basis": 5.1,
      "current_price": 4.95,
      "market_value": 5940,
      "unrealized_pnl": -180,
      "unrealized_pnl_percent": -2.94,
      "weight_in_portfolio": 5.1,
      "market_cap": "Large",
      "dividend_yield": 4.1,
      "pe_ratio": 15.7,
      "status": "Active",
      "allocation_type": "Value",
      "acquisition_date": "2024-01-30",
      "last_trade_date": "2024-12-05",
      "price_history_2024": [
        { "month": "Jan", "value": 5.32 },
        { "month": "Feb", "value": 5.59 },
        { "month": "Mar", "value": 5.59 },
        { "month": "Apr", "value": 6.01 },
        { "month": "May", "value": 6.1 },
        { "month": "Jun", "value": 6.5 },
        { "month": "Jul", "value": 6.55 },
        { "month": "Aug", "value": 6.25 },
        { "month": "Sep", "value": 6.54 },
        { "month": "Oct", "value": 6.14 },
        { "month": "Nov", "value": 6.23 },
        { "month": "Dec", "value": 6.12 }
      ]
    },
    {
      "id": 5,
      "symbol": "COMI.CA",
      "name": "Commercial International Bank Egypt",
      "sector": "Financials",
      "market": "Egyptian Exchange",
      "country": "Egypt",
      "currency": "EGP",
      "shares_held": 2000,
      "avg_cost_basis": 45.8,
      "current_price": 52.3,
      "market_value": 104600,
      "unrealized_pnl": 13000,
      "unrealized_pnl_percent": 14.19,
      "weight_in_portfolio": 9,
      "market_cap": "Large",
      "dividend_yield": 5.5,
      "pe_ratio": 11.2,
      "status": "Active",
      "allocation_type": "Core",
      "acquisition_date": "2024-04-15",
      "last_trade_date": "2024-12-05",
      "price_history_2024": [
        { "month": "Jan", "value": 43.36 },
        { "month": "Feb", "value": 44.44 },
        { "month": "Mar", "value": 42.84 },
        { "month": "Apr", "value": 40.27 },
        { "month": "May", "value": 42.72 },
        { "month": "Jun", "value": 46.41 },
        { "month": "Jul", "value": 45.6 },
        { "month": "Aug", "value": 42.18 },
        { "month": "Sep", "value": 39.33 },
        { "month": "Oct", "value": 41.57 },
        { "month": "Nov", "value": 41.1 },
        { "month": "Dec", "value": 41.49 }
      ]
    },
    {
      "id": 6,
      "symbol": "ETEL.CA",
      "name": "Telecom Egypt",
      "sector": "Telecommunications",
      "market": "Egyptian Exchange",
      "country": "Egypt",
      "currency": "EGP",
      "shares_held": 1500,
      "avg_cost_basis": 18.2,
      "current_price": 16.9,
      "market_value": 25350,
      "unrealized_pnl": -1950,
      "unrealized_pnl_percent": -7.14,
      "weight_in_portfolio": 2.2,
      "market_cap": "Large",
      "dividend_yield": 7.8,
      "pe_ratio": 9.5,
      "status": "Active",
      "allocation_type": "Value",
      "acquisition_date": "2024-06-10",
      "last_trade_date": "2024-12-05",
      "price_history_2024": [
        { "month": "Jan", "value": 17.08 },
        { "month": "Feb", "value": 18.02 },
        { "month": "Mar", "value": 17.64 },
        { "month": "Apr", "value": 16.72 },
        { "month": "May", "value": 15.92 },
        { "month": "Jun", "value": 16 },
        { "month": "Jul", "value": 14.88 },
        { "month": "Aug", "value": 14.65 },
        { "month": "Sep", "value": 15.58 },
        { "month": "Oct", "value": 14.69 },
        { "month": "Nov", "value": 16.49 },
        { "month": "Dec", "value": 15.55 }
      ]
    },
    {
      "id": 7,
      "symbol": "QNBK.QA",
      "name": "Qatar National Bank",
      "sector": "Financials",
      "market": "Qatar Stock Exchange",
      "country": "Qatar",
      "currency": "QAR",
      "shares_held": 400,
      "avg_cost_basis": 18.5,
      "current_price": 19.8,
      "market_value": 7920,
      "unrealized_pnl": 520,
      "unrealized_pnl_percent": 7.03,
      "weight_in_portfolio": 6.8,
      "market_cap": "Large",
      "dividend_yield": 4.5,
      "pe_ratio": 10.8,
      "status": "Active",
      "allocation_type": "Core",
      "acquisition_date": "2024-03-05",
      "last_trade_date": "2024-12-05",
      "price_history_2024": [
        { "month": "Jan", "value": 19.86 },
        { "month": "Feb", "value": 20.26 },
        { "month": "Mar", "value": 20.96 },
        { "month": "Apr", "value": 20.1 },
        { "month": "May", "value": 20.66 },
        { "month": "Jun", "value": 21.51 },
        { "month": "Jul", "value": 21.38 },
        { "month": "Aug", "value": 21.6 },
        { "month": "Sep", "value": 22.53 },
        { "month": "Oct", "value": 23 },
        { "month": "Nov", "value": 22.72 },
        { "month": "Dec", "value": 24.03 }
      ]
    },
    {
      "id": 8,
      "symbol": "SABIC.SR",
      "name": "Saudi Basic Industries Corp",
      "sector": "Materials",
      "market": "Saudi Stock Exchange (Tadawul)",
      "country": "Saudi Arabia",
      "currency": "SAR",
      "shares_held": 250,
      "avg_cost_basis": 88,
      "current_price": 92.4,
      "market_value": 23100,
      "unrealized_pnl": 1100,
      "unrealized_pnl_percent": 5,
      "weight_in_portfolio": 2,
      "market_cap": "Large",
      "dividend_yield": 3.8,
      "pe_ratio": 16.3,
      "status": "Active",
      "allocation_type": "Growth",
      "acquisition_date": "2024-05-20",
      "last_trade_date": "2024-12-05",
      "price_history_2024": [
        { "month": "Jan", "value": 91.26 },
        { "month": "Feb", "value": 89.01 },
        { "month": "Mar", "value": 93.87 },
        { "month": "Apr", "value": 99.47 },
        { "month": "May", "value": 94.67 },
        { "month": "Jun", "value": 95.96 },
        { "month": "Jul", "value": 95.79 },
        { "month": "Aug", "value": 98.93 },
        { "month": "Sep", "value": 95.19 },
        { "month": "Oct", "value": 92.66 },
        { "month": "Nov", "value": 96.04 },
        { "month": "Dec", "value": 95.28 }
      ]
    },
    {
      "id": 9,
      "symbol": "ALCO.JO",
      "name": "Arab Bank",
      "sector": "Financials",
      "market": "Amman Stock Exchange",
      "country": "Jordan",
      "currency": "JOD",
      "shares_held": 600,
      "avg_cost_basis": 3.85,
      "current_price": 4.12,
      "market_value": 2472,
      "unrealized_pnl": 162,
      "unrealized_pnl_percent": 7.01,
      "weight_in_portfolio": 2.1,
      "market_cap": "Large",
      "dividend_yield": 5.2,
      "pe_ratio": 13.1,
      "status": "Active",
      "allocation_type": "Core",
      "acquisition_date": "2024-07-18",
      "last_trade_date": "2024-12-05",
      "price_history_2024": [
        { "month": "Jan", "value": 4.17 },
        { "month": "Feb", "value": 4.16 },
        { "month": "Mar", "value": 4.2 },
        { "month": "Apr", "value": 4.33 },
        { "month": "May", "value": 4.27 },
        { "month": "Jun", "value": 4.17 },
        { "month": "Jul", "value": 4.08 },
        { "month": "Aug", "value": 3.98 },
        { "month": "Sep", "value": 4.06 },
        { "month": "Oct", "value": 4.15 },
        { "month": "Nov", "value": 4.23 },
        { "month": "Dec", "value": 4.12 }
      ]
    },
    {
      "id": 10,
      "symbol": "APMTB.CA",
      "name": "Alexandria Portland Cement",
      "sector": "Materials",
      "market": "Egyptian Exchange",
      "country": "Egypt",
      "currency": "EGP",
      "shares_held": 1000,
      "avg_cost_basis": 28.5,
      "current_price": 31.2,
      "market_value": 31200,
      "unrealized_pnl": 2700,
      "unrealized_pnl_percent": 9.47,
      "weight_in_portfolio": 2.7,
      "market_cap": "Mid",
      "dividend_yield": 4.2,
      "pe_ratio": 14.8,
      "status": "Active",
      "allocation_type": "Growth",
      "acquisition_date": "2024-08-12",
      "last_trade_date": "2024-12-05",
      "price_history_2024": [
        { "month": "Jan", "value": 29.84 },
        { "month": "Feb", "value": 31 },
        { "month": "Mar", "value": 30.55 },
        { "month": "Apr", "value": 32.1 },
        { "month": "May", "value": 34.48 },
        { "month": "Jun", "value": 35.65 },
        { "month": "Jul", "value": 37.47 },
        { "month": "Aug", "value": 34.93 },
        { "month": "Sep", "value": 36.26 },
        { "month": "Oct", "value": 36.31 },
        { "month": "Nov", "value": 39.85 },
        { "month": "Dec", "value": 40.23 }
      ]
    }
  ]
};


// --- UTILITY FUNCTIONS ---

// Formats a number as a currency string.
const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Formats a number as a short currency string with k/M/B suffixes for axes.
const formatCurrencyShort = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${Math.round(value)}`;
};

// Formats a number as a percentage string.
const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

// Determines the text color for profit/loss values based on whether they are positive or negative.
const getPnlClass = (pnl) => (pnl >= 0 ? 'text-green-500' : 'text-red-500');


// --- CHILD COMPONENTS ---

// Displays a single key performance indicator (KPI) with a title and value.
const KpiCard = ({ title, value, className = '' }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className={`text-2xl font-semibold ${className}`}>{value}</p>
  </div>
);

// Renders the main header for the application, including the company name and navigation links.
const Header = ({ companyInfo, page, setPage }) => (
  <header className="bg-white shadow-md">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-gray-800">{companyInfo.name}</div>
      <nav className="flex space-x-4">
        <NavLink text="Dashboard" page={page} setPage={setPage} />
        <NavLink text="Portfolio" page={page} setPage={setPage} />
        <NavLink text="Sectors" page={page} setPage={setPage} />
        <NavLink text="Countries" page={page} setPage={setPage} />
      </nav>
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
                <td colSpan="5" className="text-center py-8 text-gray-500">
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

// The root component of the application. It now manages the filter state.
export default function App() {
  const [page, setPage] = useState({ view: 'dashboard' });
  // useState hook to manage the current filter selections.
  const [filters, setFilters] = useState({ sector: 'all', country: 'all' });
  const [timeframe, setTimeframe] = useState('12M');

  // useMemo is a performance optimization. The filtering logic will only re-run
  // when the `filters` state changes, not on every render.
  const filteredHoldings = useMemo(() => {
    return portfolioData.holdings.filter(holding => {
        const sectorMatch = filters.sector === 'all' || holding.sector === filters.sector;
        const countryMatch = filters.country === 'all' || holding.country === filters.country;
        return sectorMatch && countryMatch;
    });
  }, [filters]);

  // useEffect hook demonstrates reacting to data changes.
  // This will log a message to the browser console whenever the filteredHoldings array is updated.
  useEffect(() => {
    console.log(`Filtered data updated. Now showing ${filteredHoldings.length} holdings.`);
  }, [filteredHoldings]);

  const renderContent = () => {
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
        const selectedStock = portfolioData.holdings.find(s => s.id === page.id);
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
      <Header companyInfo={portfolioData.company_info} page={page} setPage={setPage} />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}

