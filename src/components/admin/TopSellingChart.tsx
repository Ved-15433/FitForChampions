import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, BarChart2, Calendar, TrendingUp } from 'lucide-react';
import type { Product } from '../ui/ProductCard';

interface TopSellingChartProps {
  orders: any[];
  products: Product[];
}

interface ChartItem {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  category: string;
  price: number;
}

type TimeFilter = 'today' | 'weekly' | 'all';

export const TopSellingChart: React.FC<TopSellingChartProps> = ({ orders = [], products = [] }) => {
  const [filter, setFilter] = useState<TimeFilter>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 1. Data Aggregation Pipeline
  const getAggregatedData = (): ChartItem[] => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Filter orders based on active timeframe
    const filteredOrders = orders.filter(order => {
      if (!order.created_at) return filter === 'all';
      
      const orderDate = new Date(order.created_at);
      if (filter === 'today') {
        return orderDate >= startOfToday;
      }
      if (filter === 'weekly') {
        return orderDate >= sevenDaysAgo;
      }
      return true; // all
    });

    const salesMap: Record<string, ChartItem> = {};

    filteredOrders.forEach(order => {
      const items = Array.isArray(order.products) ? order.products : [];
      items.forEach((item: any) => {
        // Exclude resilient schema metadata fields
        if (item && item.product && item.quantity && !item.is_metadata) {
          const prodId = item.product.id || item.product.name;
          if (!prodId) return;

          const qty = Number(item.quantity) || 0;
          const price = Number(item.product.price) || 0;

          if (!salesMap[prodId]) {
            // Find full product details in catalogs if available
            const catalogProduct = products.find(p => p.id === item.product.id || p.name === item.product.name);
            
            salesMap[prodId] = {
              id: prodId,
              name: item.product.name || catalogProduct?.name || 'Accessory Item',
              unitsSold: 0,
              revenue: 0,
              category: catalogProduct?.category || 'General',
              price: price || catalogProduct?.price || 0
            };
          }

          salesMap[prodId].unitsSold += qty;
          salesMap[prodId].revenue += qty * price;
        }
      });
    });

    // 2. Data Processing Pipeline
    return Object.values(salesMap)
      .filter(item => item.unitsSold >= 1)              // Filter units_sold >= 1
      .sort((a, b) => b.unitsSold - a.unitsSold)         // Sort descending by units_sold
      .slice(0, 5);                                     // Slice top 5 results
  };

  const chartData = getAggregatedData();

  // Find max units sold to calculate relative bar percentage widths
  const maxUnitsSold = chartData.length > 0 ? Math.max(...chartData.map(item => item.unitsSold)) : 1;
  const totalUnitsSoldFilter = chartData.reduce((sum, item) => sum + item.unitsSold, 0);

  // Rank-based gradients and glow colors matching cyber athletic style
  const getRankGradient = (index: number) => {
    switch (index) {
      case 0: // 1st Place
        return {
          bar: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.45)] border-amber-400/40',
          text: 'text-amber-400'
        };
      case 1: // 2nd Place
        return {
          bar: 'bg-gradient-to-r from-emerald-400 to-teal-400',
          glow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)] border-emerald-400/30',
          text: 'text-emerald-400'
        };
      case 2: // 3rd Place
        return {
          bar: 'bg-gradient-to-r from-cyan-400 to-blue-400',
          glow: 'shadow-[0_0_12px_rgba(6,182,212,0.4)] border-cyan-400/30',
          text: 'text-cyan-400'
        };
      default: // 4th & 5th Place
        return {
          bar: 'bg-gradient-to-r from-purple-500 to-indigo-500',
          glow: 'shadow-[0_0_10px_rgba(168,85,247,0.3)] border-purple-500/20',
          text: 'text-purple-400'
        };
    }
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    if (chartData.length === 0) return;

    const headers = ['Rank', 'Product Name', 'Category', 'Price (INR)', 'Units Sold', 'Total Revenue (INR)'];
    const rows = chartData.map((item, idx) => [
      idx + 1,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`,
      item.price,
      item.unitsSold,
      item.revenue
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `fitforchampions_top_selling_${filter}_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 lg:col-span-2 relative flex flex-col justify-between h-full min-h-[350px]">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="font-space text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">
            Top Performing Gear // Sales Intelligence
          </span>
          <h3 className="font-orbitron font-black text-lg text-white flex items-center gap-2 tracking-tight">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            TOP SELLING PRODUCTS
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Time Filter Pills */}
          <div className="flex bg-slate-950/80 border border-white/5 rounded-xl p-1 shrink-0">
            {(['today', 'weekly', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg font-space text-[9px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  filter === t 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
              >
                {t === 'all' ? 'All time' : t}
              </button>
            ))}
          </div>

          {/* Export to CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={chartData.length === 0}
            title="Export data as CSV"
            className="p-2 rounded-xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-slate-400 hover:text-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/5 disabled:hover:bg-slate-950/60 disabled:hover:text-slate-400 transition-all duration-300 cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Graph Content */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {chartData.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-white/5 rounded-2xl bg-slate-950/30"
            >
              <div className="p-3.5 rounded-full bg-slate-900 border border-white/5 mb-3 text-slate-600">
                <Calendar className="w-6 h-6 animate-pulse" />
              </div>
              <p className="font-outfit text-slate-400 text-sm font-medium">
                No sales data available yet
              </p>
              <span className="font-space text-[10px] text-slate-600 block mt-1 uppercase tracking-wider">
                Waiting for active checkout transactions
              </span>
            </motion.div>
          ) : (
            <motion.div 
              key="chart-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {chartData.map((item, index) => {
                const style = getRankGradient(index);
                const percent = (item.unitsSold / maxUnitsSold) * 100;
                const totalPercentOfFilter = totalUnitsSoldFilter > 0 
                  ? ((item.unitsSold / totalUnitsSoldFilter) * 100).toFixed(1)
                  : '0';

                return (
                  <div 
                    key={item.id}
                    className="relative group flex flex-col gap-1.5"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Row Label (Product name + Category) */}
                    <div className="flex items-center justify-between text-xs px-1 font-space">
                      <div className="flex items-center gap-2 truncate">
                        <span className={`font-orbitron font-black w-4 text-[10px] ${style.text}`}>
                          0{index + 1}
                        </span>
                        <span className="font-outfit font-bold text-white text-[11px] sm:text-xs truncate">
                          {item.name}
                        </span>
                        <span className="hidden sm:inline-block font-space text-[9px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-white/5">
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="font-space text-[10px] text-slate-400">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        <span className={`font-orbitron font-black text-xs ${style.text}`}>
                          {item.unitsSold} units
                        </span>
                      </div>
                    </div>

                    {/* Bar Tracker Visual */}
                    <div className="w-full h-5 bg-slate-950/70 border border-white/5 rounded-lg overflow-hidden relative flex items-center transition-all duration-300 group-hover:border-white/10 group-hover:bg-slate-950">
                      {/* Interactive Animated Bar */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-r-lg relative ${style.bar} ${style.glow}`}
                      >
                        {/* High-tech internal barcode-style stripes overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:10px_10px] opacity-20 pointer-events-none" />
                      </motion.div>
                    </div>

                    {/* Cyber Tooltip on Hover */}
                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-30 bottom-10 right-0 sm:right-auto sm:left-[30%] w-60 glass-panel p-4 rounded-xl border border-white/10 shadow-2xl bg-slate-950/95 pointer-events-none"
                        >
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                            <span className="font-space text-[9px] text-emerald-400 font-bold tracking-widest uppercase">
                              Metric Insights
                            </span>
                            <span className="font-space text-[9px] text-slate-500">
                              Rank #0{index + 1}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5 font-outfit text-xs text-slate-300">
                            <p className="font-bold text-white text-[13px] leading-tight truncate mb-1">
                              {item.name}
                            </p>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Category:</span>
                              <span className="font-space text-[10px] text-slate-300 font-bold">{item.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Units Sold:</span>
                              <span className="font-orbitron text-white font-bold">{item.unitsSold}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Total Yield:</span>
                              <span className="font-orbitron text-emerald-400 font-bold">₹{item.revenue.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Roster Ratio:</span>
                              <span className="font-space text-[10px] text-cyan-400 font-bold">{totalPercentOfFilter}%</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cyber Footer Micro Metrics */}
      {chartData.length > 0 && (
        <div className="border-t border-white/5 pt-4 mt-5 flex items-center justify-between font-space text-[9px] text-slate-500 uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            Active Sales aggregate: {totalUnitsSoldFilter} units
          </span>
          <span>
            Refreshes automatically
          </span>
        </div>
      )}
    </div>
  );
};
