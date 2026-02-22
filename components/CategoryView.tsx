
import React from 'react';
import { StockSummary } from '../types';

interface Props {
  type: 'fundamentals' | 'technicals' | 'checklist';
  stocks: StockSummary[];
  loading: boolean;
  selectedStocks: string[];
  onToggleSelect: (symbol: string) => void;
  onStockClick: (symbol: string) => void;
  onClose: () => void;
}

const CategoryView: React.FC<Props> = ({ type, stocks, loading, selectedStocks, onToggleSelect, onStockClick, onClose }) => {
  const getHeaderStyle = () => {
    switch(type) {
      case 'fundamentals': return 'bg-blue-600 text-white';
      case 'technicals': return 'bg-green-600 text-white';
      default: return 'bg-slate-900 text-white';
    }
  };

  const getLabel = () => {
    switch(type) {
      case 'fundamentals': return 'Fundamental Powerhouse Screen';
      case 'technicals': return 'Technical Momentum Screen';
      default: return '16-Point Institutional Checklist';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
      <div className={`${getHeaderStyle()} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-3">{getLabel()}</h2>
          <p className="text-white/80 text-lg max-w-2xl font-medium">
            {type === 'fundamentals' 
              ? 'Analyzing the top 10% of the market for highest capital efficiency and debt safety.'
              : type === 'technicals'
              ? 'Identifying high-velocity price movements with institutional volume support.'
              : 'The comprehensive audit framework for long-term checkout.'}
          </p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] text-[180px] opacity-10 pointer-events-none select-none font-black">
          {type === 'fundamentals' ? 'FUND' : type === 'technicals' ? 'TECH' : 'AUDIT'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse"></span>
            Live Results (Early 2025)
          </h3>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stocks.map(stock => (
                <div key={stock.symbol} className="relative">
                  <button
                    onClick={() => onStockClick(stock.symbol)}
                    className={`w-full group bg-white p-6 rounded-2xl border transition-all text-left flex flex-col justify-between h-full ${selectedStocks.includes(stock.symbol) ? 'border-blue-400 ring-2 ring-blue-50' : 'border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-300'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{stock.name}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stock.sector}</p>
                      </div>
                      <div className="bg-gray-50 px-3 py-1 rounded-full text-xs font-black text-gray-500">
                        {stock.symbol}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4 font-medium italic">"{stock.reason}"</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Fund</p>
                          <p className="text-xs font-black text-blue-600">{stock.fundamentalScore}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Tech</p>
                          <p className="text-xs font-black text-green-600">{stock.technicalScore}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                        Analysis <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleSelect(stock.symbol); }}
                    className={`absolute top-4 right-4 p-2 rounded-full border shadow-sm transition-all z-10 ${selectedStocks.includes(stock.symbol) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-300 border-gray-100 hover:border-blue-200'}`}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-black text-gray-900 uppercase tracking-tight mb-4 border-b pb-2">Analyst Rules</h4>
            <div className="space-y-4">
              {type === 'fundamentals' ? (
                <>
                  <RuleItem title="ROCE > 20%" desc="Highest priority for capital efficiency." />
                  <RuleItem title="Debt/Equity < 0.5" desc="Strict survival criteria." />
                  <RuleItem title="Positive OCF" desc="Earnings must convert to cash." />
                </>
              ) : type === 'technicals' ? (
                <>
                  <RuleItem title="200-DMA UP" desc="Price must lead the long-term trend." />
                  <RuleItem title="Golden Cross" desc="50-DMA above 200-DMA." />
                  <RuleItem title="Bullish RSI" desc="RSI sustaining 45-65 support." />
                </>
              ) : (
                <>
                  <RuleItem title="10 Fundamentals" desc="Core business quality." />
                  <RuleItem title="6 Technicals" desc="Entry timing rules." />
                  <RuleItem title="Total checkout" desc="Zero compromises." />
                </>
              )}
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-colors uppercase tracking-widest text-sm shadow-xl"
          >
            Close Analyst View
          </button>
        </div>
      </div>
    </div>
  );
};

const RuleItem = ({ title, desc }: { title: string; desc: string }) => (
  <div>
    <h5 className="text-xs font-black text-blue-600">{title}</h5>
    <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">{desc}</p>
  </div>
);

export default CategoryView;
