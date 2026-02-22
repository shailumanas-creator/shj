
import React from 'react';

interface InfoProps {
  type: 'fundamentals' | 'technicals' | 'checklist';
  onClose: () => void;
}

const InfoSections: React.FC<InfoProps> = ({ type, onClose }) => {
  const renderFundamentals = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
        <h2 className="text-4xl font-black mb-4">The 10 Fundamental Pillars</h2>
        <p className="text-blue-100 text-lg max-w-2xl">These criteria identify "Gems"—companies with sustainable competitive advantages and robust financial health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Business Model", desc: "Focus on understandable businesses with a clear 'Economic Moat' (Brand, Network Effect, Cost Lead)." },
          { title: "Revenue Growth", desc: "Minimum 10-12% CAGR over 5-10 years. Consistency is more important than sudden spikes." },
          { title: "Profit Growth", desc: "Healthy PAT growth of >12-15% CAGR. Bottom line should grow faster than top line (operating leverage)." },
          { title: "Return Ratios", desc: "ROE > 15% and ROCE > 18%. Efficient capital allocation is the hallmark of quality management." },
          { title: "Debt Management", desc: "Debt-to-Equity should be < 0.5. Low debt ensures survival during macro-economic downturns." },
          { title: "Cash Flow", desc: "Operating Cash Flow (OCF) must be positive and close to or greater than Net Profit." },
          { title: "Management Quality", desc: "Integrity check. Low promoter pledging (<10%) and high transparency in corporate governance." },
          { title: "Shareholding Pattern", desc: "Promoter holding > 40% with institutional (FII/DII) interest showing 'smart money' confidence." },
          { title: "Valuation", desc: "P/E must be justified by growth. Ideally PEG (Price/Earnings-to-Growth) between 1 and 2." },
          { title: "Scalability", desc: "The industry should have a long runway. Avoid companies in saturated or dying industries." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-50 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">{i+1}</span>
              <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTechnicals = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-green-600 rounded-3xl p-8 text-white shadow-xl shadow-green-100">
        <h2 className="text-4xl font-black mb-4">The 6 Technical Entry Points</h2>
        <p className="text-green-100 text-lg max-w-2xl">Even a great business is a bad investment if bought at the wrong price. These rules optimize your timing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Primary Trend", desc: "The stock must be in an 'UP' trend. Primary indicator: Price consistently above the 200-Day Moving Average." },
          { title: "Vertical Rally Avoidance", desc: "Do not chase. Avoid stocks that have rallied more than 50% in the last 3 months without consolidation." },
          { title: "Moving Averages", desc: "The 50-DMA should be above the 200-DMA (Golden Cross). Price should ideally be near these levels for support." },
          { title: "Support Zones", desc: "Buy at 'Value' points. Entry is best when stock is near long-term support or the 200-DMA." },
          { title: "Volume Behavior", desc: "Volume should expand on up-days and contract on down-days. Breakouts must be on high volume." },
          { title: "RSI Status", desc: "RSI between 40-65 is ideal. Below 30 is oversold (good for long-term if fundamentals hold), above 70 is overbought." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-green-50 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">{i+1}</span>
              <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChecklist = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
       <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-4xl font-black mb-4">Complete 16-Point Checklist</h2>
        <p className="text-slate-400 text-lg max-w-2xl">A unified view of Shailu's screening methodology for live market checkout.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
            <h3 className="text-xl font-black text-blue-600 mb-6 uppercase tracking-widest">Fundamentals (10)</h3>
            <ul className="space-y-4">
              {["Business Moat", "Revenue CAGR >12%", "Profit CAGR >15%", "ROE >15% / ROCE >18%", "Debt/Equity <0.5", "Interest Coverage >3", "Cash Flow > Net Profit", "Pledging <10%", "Promoter Holding >40%", "Scalable Industry"].map((check, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-bold text-sm">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {check}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8">
            <h3 className="text-xl font-black text-green-600 mb-6 uppercase tracking-widest">Technicals (6)</h3>
            <ul className="space-y-4">
              {["Price > 200-DMA", "No Recent Vertical Rally", "50-DMA > 200-DMA", "Near Strong Support", "Volume Support", "RSI 40-65 Zone"].map((check, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-bold text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {check}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-6 flex justify-end">
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-colors text-sm"
        >
          Close Guide
        </button>
      </div>
      {type === 'fundamentals' && renderFundamentals()}
      {type === 'technicals' && renderTechnicals()}
      {type === 'checklist' && renderChecklist()}
    </div>
  );
};

export default InfoSections;
