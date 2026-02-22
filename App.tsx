
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AnalysisDashboard from './components/AnalysisDashboard';
import CategoryView from './components/CategoryView';
import ComparisonDashboard from './components/ComparisonDashboard';
import { analyzeStock, fetchTopPicks } from './services/geminiService';
import { StockAnalysis, StockSummary } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [activeCategory, setActiveCategory] = useState<'fundamentals' | 'technicals' | 'checklist' | null>(null);
  const [categoryStocks, setCategoryStocks] = useState<StockSummary[]>([]);
  const [topPicks, setTopPicks] = useState<StockSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [discoveryLoading, setDiscoveryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comparison State
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareData, setCompareData] = useState<StockAnalysis[]>([]);

  useEffect(() => {
    loadDiscovery();
  }, []);

  const loadDiscovery = async () => {
    setDiscoveryLoading(true);
    try {
      const picks = await fetchTopPicks('HOME');
      setTopPicks(picks);
    } catch (err) {
      console.error("Discovery error:", err);
    } finally {
      setDiscoveryLoading(false);
    }
  };

  const loadCategoryResults = async (cat: 'fundamentals' | 'technicals' | 'checklist') => {
    setCategoryLoading(true);
    setCategoryStocks([]);
    try {
      const typeMap = {
        'fundamentals': 'FUNDAMENTAL',
        'technicals': 'TECHNICAL',
        'checklist': 'CHECKLIST'
      };
      const backendType = typeMap[cat] as 'FUNDAMENTAL' | 'TECHNICAL' | 'CHECKLIST';
      const results = await fetchTopPicks(backendType);
      setCategoryStocks(results);
    } catch (err) {
      console.error("Category fetch error:", err);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent, manualQuery?: string) => {
    if (e) e.preventDefault();
    const targetQuery = manualQuery || query;
    if (!targetQuery.trim()) return;

    setLoading(true);
    setError(null);
    setActiveCategory(null);
    setCompareMode(false);
    
    try {
      const result = await analyzeStock(targetQuery);
      setAnalysis(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. Try a specific ticker like 'HDFCBANK' or 'RELIANCE'.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (selectedForComparison.length < 2) return;
    setLoading(true);
    setError(null);
    setCompareMode(true);
    setAnalysis(null);
    setActiveCategory(null);

    try {
      const results = await Promise.all(
        selectedForComparison.map(symbol => analyzeStock(symbol))
      );
      setCompareData(results);
    } catch (err) {
      setError("Failed to fetch comparison data. Some symbols might be invalid.");
      setCompareMode(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (symbol: string) => {
    setSelectedForComparison(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol].slice(-4) // Max 4
    );
  };

  const handleNavClick = (section: 'fundamentals' | 'technicals' | 'checklist') => {
    setActiveCategory(section);
    setAnalysis(null);
    setCompareMode(false);
    setQuery('');
    setError(null);
    loadCategoryResults(section);
  };

  const handleBack = () => {
    setAnalysis(null);
    setActiveCategory(null);
    setCompareMode(false);
    setQuery('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Header onNavClick={handleNavClick} onLogoClick={handleBack} />
      
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {/* Landing View */}
        {!analysis && !activeCategory && !compareMode && (
          <div className="max-w-4xl mx-auto text-center mb-16 mt-6">
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-2xl animate-in zoom-in-50 duration-500 hover:scale-105 transition-transform cursor-pointer" onClick={handleBack}>
                <img src="logo.png" alt="Branding" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100 mb-6">
              Official Analyst Workstation
            </div>
            <h2 className="text-5xl font-black text-gray-900 sm:text-7xl mb-6 tracking-tighter leading-tight">
              Indian Market <br/><span className="text-blue-600">checkout System</span>
            </h2>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Applying Shailu's 16 strict conditions for long-term compounders. 
              Real-time checkout with <span className="text-blue-600 font-bold underline decoration-blue-200 decoration-4">Trendlyne Deep-Links</span>.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-16">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Stock Symbol (e.g. RELIANCE, TITAN)..."
                className="w-full px-8 py-5 text-xl rounded-3xl border-2 border-transparent bg-white shadow-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none pr-36 font-bold"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-3 top-3 bottom-3 px-8 rounded-2xl bg-gray-900 text-white font-black hover:bg-black disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
              >
                {loading ? 'WAIT' : 'ANALYZE'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-black animate-pulse">
                {error}
              </div>
            )}

            {/* Top Picks List */}
            <div className="text-left">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                    <img src="logo.png" className="w-full h-full object-cover" alt="S" />
                  </div>
                  Market Quality Picks
                </h3>
                <div className="flex items-center gap-4">
                  <button onClick={loadDiscovery} className="text-xs font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest flex items-center gap-1 transition-colors">
                    <svg className={`w-4 h-4 ${discoveryLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                  </button>
                </div>
              </div>

              {discoveryLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse shadow-sm"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {topPicks.map((stock) => (
                    <div key={stock.symbol} className="relative group">
                      <button
                        onClick={() => handleSearch(undefined, stock.symbol)}
                        className={`w-full bg-white p-6 rounded-3xl border shadow-sm hover:shadow-2xl transition-all text-left flex flex-col h-full overflow-hidden ${selectedForComparison.includes(stock.symbol) ? 'border-blue-400 ring-2 ring-blue-50' : 'border-gray-100'}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md uppercase tracking-wider">{stock.sector}</span>
                          <span className="text-xs font-black text-gray-400 group-hover:text-blue-500 transition-colors">#{stock.symbol}</span>
                        </div>
                        <h4 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-3 leading-tight">{stock.name}</h4>
                        <p className="text-[11px] font-medium text-gray-500 line-clamp-3 leading-relaxed mb-6 italic">"{stock.reason}"</p>
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                           <div className="flex gap-2">
                             <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded">F:{stock.fundamentalScore}</span>
                             <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">T:{stock.technicalScore}</span>
                           </div>
                           <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleSelect(stock.symbol); }}
                        className={`absolute top-4 right-4 p-2 rounded-full border shadow-sm transition-all ${selectedForComparison.includes(stock.symbol) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-300 border-gray-100 hover:border-blue-200'}`}
                        title="Add to Compare"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Specific View */}
        {activeCategory && (
          <CategoryView 
            type={activeCategory} 
            stocks={categoryStocks} 
            loading={categoryLoading} 
            selectedStocks={selectedForComparison}
            onToggleSelect={toggleSelect}
            onStockClick={(sym) => handleSearch(undefined, sym)}
            onClose={handleBack} 
          />
        )}

        {/* Detailed Analysis View */}
        {analysis && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <button 
              onClick={handleBack}
              className="mb-8 flex items-center gap-2 text-sm font-black text-gray-400 hover:text-blue-600 transition-all group uppercase tracking-widest"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
              Return to Screener
            </button>
            <AnalysisDashboard analysis={analysis} onRefresh={() => handleSearch(undefined, analysis.symbol)} isRefreshing={loading} />
          </div>
        )}

        {/* Comparison Dashboard */}
        {compareMode && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <button 
              onClick={handleBack}
              className="mb-8 flex items-center gap-2 text-sm font-black text-gray-400 hover:text-blue-600 transition-all group uppercase tracking-widest"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
              Return to Screener
            </button>
            <ComparisonDashboard stocks={compareData} />
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center max-w-2xl mx-auto">
            <div className="relative mb-10 scale-125">
               <div className="w-24 h-24 border-8 border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                 <img src="logo.png" alt="Scanning" className="w-12 h-12 animate-pulse" />
               </div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
              {compareMode ? 'Comparing Assets...' : 'Scrutiny in Progress...'}
            </h3>
            <p className="text-gray-500 mt-4 text-lg font-medium">
              {compareMode 
                ? `Running parallel audits for ${selectedForComparison.length} companies.`
                : 'Verifying Trendlyne metrics, 200-DMA trend, and OCF vs Profit ratios.'}
            </p>
          </div>
        )}

        {/* Floating Comparison Bar */}
        {selectedForComparison.length > 0 && !compareMode && !analysis && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-20 duration-500">
            <div className="bg-gray-900 text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-8 border border-gray-800 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {selectedForComparison.map((sym, i) => (
                    <div key={sym} className="w-10 h-10 rounded-full bg-blue-600 border-2 border-gray-900 flex items-center justify-center text-[10px] font-black" style={{ zIndex: 10 - i }}>
                      {sym.slice(0, 2)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Selected Assets</p>
                  <p className="text-sm font-black text-blue-400">{selectedForComparison.length} / 4</p>
                </div>
              </div>
              <div className="h-10 w-px bg-gray-800"></div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedForComparison([])}
                  className="text-xs font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Clear
                </button>
                <button 
                  onClick={handleCompare}
                  disabled={selectedForComparison.length < 2 || loading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                >
                  Compare Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left items-center">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-gray-100 cursor-pointer" onClick={handleBack}>
                <img src="logo.png" alt="U Learn Everything" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900 leading-none">SHAILU'S <span className="text-blue-600">SCREENER</span></h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Analyst-Grade Audit Tool</p>
              </div>
            </div>
            <div className="flex justify-center gap-10">
              <FooterStat label="Sources" value="NSE/BSE" />
              <FooterStat label="Intelligence" value="Gemini 3 Pro" />
              <FooterStat label="Data" value="Live 2025" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xs ml-auto">
                Educational tool for analysts. This is not financial advice. 
                Perform your own due diligence before investing.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FooterStat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">{label}</p>
    <p className="text-xs font-black text-gray-900 uppercase">{value}</p>
  </div>
);

export default App;
