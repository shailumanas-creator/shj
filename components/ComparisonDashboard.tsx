
import React from 'react';
import { StockAnalysis } from '../types';

interface Props {
  stocks: StockAnalysis[];
}

const ComparisonDashboard: React.FC<Props> = ({ stocks }) => {
  return (
    <div className="space-y-12 pb-32">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 overflow-x-auto">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Strategic Asset Comparison</h2>
          <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] mt-3">Side-by-Side Institutional Scrutiny</p>
        </div>

        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="py-6 px-6 bg-slate-50/50 rounded-tl-3xl text-sm font-black text-gray-400 uppercase tracking-widest w-1/5">Metric</th>
              {stocks.map((stock, i) => (
                <th key={stock.symbol} className={`py-6 px-6 text-center ${i === stocks.length - 1 ? 'rounded-tr-3xl' : ''} bg-slate-50/50`}>
                  <div className="inline-block text-left">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{stock.symbol}</p>
                    <p className="text-lg font-black text-gray-900 leading-none">{stock.name}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <ComparisonRow label="Overall Verdict" values={stocks.map(s => s.overallVerdict)} highlight />
            <ComparisonRow label="Fundamental Score" values={stocks.map(s => `${s.fundamentalScore}%`)} />
            <ComparisonRow label="Technical Score" values={stocks.map(s => `${s.technicalScore}%`)} />
            <ComparisonRow label="CMP" values={stocks.map(s => `${s.currency} ${s.price.toLocaleString()}`)} />
            
            <tr className="bg-slate-50/50">
              <td colSpan={stocks.length + 1} className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Efficiency Metrics</td>
            </tr>
            <ComparisonRow label="ROE" values={stocks.map(s => s.metrics.roe)} />
            <ComparisonRow label="ROCE" values={stocks.map(s => s.metrics.roce)} />
            <ComparisonRow label="Revenue CAGR" values={stocks.map(s => s.metrics.revenueCAGR)} />
            <ComparisonRow label="Profit CAGR" values={stocks.map(s => s.metrics.profitCAGR)} />
            
            <tr className="bg-slate-50/50">
              <td colSpan={stocks.length + 1} className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Valuation & Risk</td>
            </tr>
            <ComparisonRow label="P/E Ratio" values={stocks.map(s => s.metrics.peRatio)} />
            <ComparisonRow label="PEG Ratio" values={stocks.map(s => s.metrics.pegRatio)} />
            <ComparisonRow label="Debt/Equity" values={stocks.map(s => s.metrics.debtToEquity)} />
            <ComparisonRow label="Promoter Holding" values={stocks.map(s => s.metrics.promoterHolding)} />
            <ComparisonRow label="Promoter Pledging" values={stocks.map(s => s.metrics.promoterPledging)} />

            <tr className="bg-slate-50/50">
              <td colSpan={stocks.length + 1} className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Technical Indicators</td>
            </tr>
            <ComparisonRow label="RSI (Daily)" values={stocks.map(s => s.metrics.rsi.toString())} />
            <ComparisonRow label="DMA 200" values={stocks.map(s => s.metrics.dma200.toString())} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ComparisonRow = ({ label, values, highlight = false }: { label: string; values: string[]; highlight?: boolean }) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="py-5 px-6 text-xs font-bold text-gray-500 uppercase tracking-tight border-r border-gray-50">{label}</td>
    {values.map((val, i) => (
      <td key={i} className={`py-5 px-6 text-center ${highlight ? 'font-black' : 'font-bold'} text-sm`}>
        <span className={highlight ? (
          val.includes('STRONG BUY') ? 'bg-green-600 text-white px-3 py-1.5 rounded-lg' :
          val.includes('BUY') ? 'bg-green-100 text-green-700 px-3 py-1.5 rounded-lg' :
          val === 'AVOID' ? 'bg-red-600 text-white px-3 py-1.5 rounded-lg' : 'bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg'
        ) : 'text-gray-900'}>
          {val}
        </span>
      </td>
    ))}
  </tr>
);

export default ComparisonDashboard;
