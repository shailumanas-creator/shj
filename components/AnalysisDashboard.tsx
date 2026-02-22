
import React from 'react';
import { StockAnalysis } from '../types';
import ConditionItem from './ConditionItem';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  analysis: StockAnalysis;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const AnalysisDashboard: React.FC<Props> = ({ analysis, onRefresh, isRefreshing }) => {
  const chartData = [
    { name: 'Fundamentals', score: analysis.fundamentalScore, fill: '#3b82f6' },
    { name: 'Technicals', score: analysis.technicalScore, fill: '#10b981' },
  ];

  // Helper to generate trendlyne link
  const trendlyneUrl = `https://trendlyne.com/equity/${analysis.symbol.split(':')[0]}/`;

  return (
    <div className="space-y-8 pb-20">
      {/* Summary Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{analysis.name}</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg font-bold text-sm tracking-widest">{analysis.symbol}</span>
              <a 
                href={trendlyneUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 border border-transparent"
              >
                <span>Trendlyne Deep Dive</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              {onRefresh && (
                <button 
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="p-2.5 bg-slate-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all disabled:opacity-50 border border-gray-100"
                  title="Refresh data"
                >
                  <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <p className="text-5xl font-black text-blue-600 tracking-tighter">
                {analysis.currency} {analysis.price.toLocaleString()}
              </p>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Market Price</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 font-bold flex items-center gap-2 uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              Verified: {analysis.timestamp}
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-slate-50 rounded-3xl border-2 border-slate-100 min-w-[260px] shadow-inner">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Investment Grade</span>
            <div className={`text-3xl font-black px-6 py-3 rounded-2xl shadow-xl ${
              analysis.overallVerdict.includes('STRONG BUY') ? 'text-white bg-green-600' :
              analysis.overallVerdict.includes('BUY') ? 'text-white bg-green-500' : 
              analysis.overallVerdict === 'AVOID' ? 'text-white bg-red-600' : 'text-white bg-amber-500'
            }`}>
              {analysis.overallVerdict}
            </div>
            <p className="text-[9px] text-gray-400 mt-4 font-black uppercase tracking-widest text-center leading-relaxed">
              Based on Shailu's <br/> 16-Point Institutional Framework
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
              </div>
              Efficiency Matrix
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#cbd5e1' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} 
                  />
                  <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={44}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center justify-between uppercase tracking-tight">
              Core Data Points
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black">LATEST FY</span>
            </h3>
            <div className="space-y-3">
              <MetricRow label="Revenue CAGR (5Y)" value={analysis.metrics.revenueCAGR} />
              <MetricRow label="Profit CAGR (5Y)" value={analysis.metrics.profitCAGR} />
              <MetricRow label="ROE / ROCE" value={`${analysis.metrics.roe} / ${analysis.metrics.roce}`} />
              <MetricRow label="Debt to Equity" value={analysis.metrics.debtToEquity} />
              <MetricRow label="Interest Coverage" value={analysis.metrics.interestCoverage} />
              <MetricRow label="Free Cash Flow" value={analysis.metrics.freeCashFlow} />
              <MetricRow label="P/E Ratio" value={analysis.metrics.peRatio} />
              <MetricRow label="PEG Ratio" value={analysis.metrics.pegRatio} />
              <MetricRow label="Promoter Holding" value={analysis.metrics.promoterHolding} />
              <MetricRow label="RSI (Daily)" value={analysis.metrics.rsi.toString()} />
            </div>
          </div>

          {/* Sources Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Verification Links
            </h3>
            <div className="space-y-2">
              {analysis.sources.slice(0, 6).map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-200 group-hover:bg-blue-600 transition-colors"></div>
                  <span className="truncate flex-1 text-xs font-bold text-gray-600 group-hover:text-blue-700">{source.title}</span>
                  <svg className="w-3 h-3 text-gray-300 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
              {analysis.sources.length === 0 && <p className="text-xs text-gray-400 italic">Verified via internal market data engine.</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Conditions */}
        <div className="lg:col-span-2 space-y-10">
          {/* Fundamentals Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center font-black text-xl">F</div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Fundamental Pillars</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Wealth Creation Potential</p>
                </div>
              </div>
              <div className="text-right px-6 py-2 bg-blue-50 rounded-2xl border border-blue-100">
                <span className="text-3xl font-black text-blue-600">{analysis.fundamentalScore}%</span>
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-0.5">Quality Score</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ConditionItem condition={analysis.fundamentals.businessModel} />
              <ConditionItem condition={analysis.fundamentals.revenueGrowth} />
              <ConditionItem condition={analysis.fundamentals.profitGrowth} />
              <ConditionItem condition={analysis.fundamentals.returnRatios} />
              <ConditionItem condition={analysis.fundamentals.debtManagement} />
              <ConditionItem condition={analysis.fundamentals.cashFlow} />
              <ConditionItem condition={analysis.fundamentals.managementQuality} />
              <ConditionItem condition={analysis.fundamentals.valuation} />
              <ConditionItem condition={analysis.fundamentals.shareholdingPattern} />
              <ConditionItem condition={analysis.fundamentals.scalability} />
            </div>
          </section>

          {/* Technicals Section */}
          <section>
             <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-green-600 text-white w-12 h-12 rounded-2xl shadow-lg shadow-green-100 flex items-center justify-center font-black text-xl">T</div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Technical Timing</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Momentum & Entry Optimizers</p>
                </div>
              </div>
              <div className="text-right px-6 py-2 bg-green-50 rounded-2xl border border-green-100">
                <span className="text-3xl font-black text-green-600">{analysis.technicalScore}%</span>
                <p className="text-[9px] font-black text-green-400 uppercase tracking-widest mt-0.5">Momentum Score</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ConditionItem condition={analysis.technicals.primaryTrend} />
              <ConditionItem condition={analysis.technicals.verticalRally} />
              <ConditionItem condition={analysis.technicals.movingAverages} />
              <ConditionItem condition={analysis.technicals.supportZones} />
              <ConditionItem condition={analysis.technicals.rsiStatus} />
              <ConditionItem condition={analysis.technicals.volumeBehavior} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const MetricRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0 hover:bg-slate-50 px-3 rounded-xl transition-all">
    <span className="text-[11px] font-black text-gray-400 uppercase tracking-tight">{label}</span>
    <span className="text-xs font-black text-gray-900">{value || 'N/A'}</span>
  </div>
);

export default AnalysisDashboard;
