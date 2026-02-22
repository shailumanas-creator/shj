
import React from 'react';

interface Props {
  onNavClick: (section: 'fundamentals' | 'technicals' | 'checklist') => void;
  onLogoClick: () => void;
}

const Header: React.FC<Props> = ({ onNavClick, onLogoClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-4 group transition-all"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:scale-110 group-hover:shadow-blue-200 transition-all duration-300 ring-2 ring-gray-50 group-hover:ring-blue-100">
            <img 
              src="logo.png" 
              alt="Shailu's Screener Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image not found
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=UL';
              }}
            />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
            SHAILU'S <span className="text-blue-600">SCREENER</span>
          </h1>
        </button>
        
        <nav className="hidden md:flex items-center space-x-2">
          <NavButton onClick={() => onNavClick('fundamentals')} label="Fundamentals" color="blue" />
          <NavButton onClick={() => onNavClick('technicals')} label="Technicals" color="green" />
          <NavButton onClick={() => onNavClick('checklist')} label="Checklist" color="slate" />
          <div className="h-8 w-px bg-gray-100 mx-2"></div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-50 border border-green-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Live Feed</span>
          </div>
        </nav>

        <div className="md:hidden flex items-center gap-4">
           {/* Mobile indicator */}
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavButton = ({ onClick, label, color }: { onClick: () => void, label: string, color: string }) => {
  const styles = {
    blue: 'hover:text-blue-600 hover:bg-blue-50',
    green: 'hover:text-green-600 hover:bg-green-50',
    slate: 'hover:text-slate-900 hover:bg-slate-50'
  };
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest transition-all ${styles[color as keyof typeof styles]}`}
    >
      {label}
    </button>
  );
};

export default Header;
