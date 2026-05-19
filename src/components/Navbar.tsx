import React from "react";
import { Menu, Search, Compass, PlusCircle, Heart, User, DollarSign, Calculator, Activity } from "lucide-react";

interface NavbarProps {
  onNavClick: (view: "buy" | "sell" | "valuation" | "finance" | "saved") => void;
  activeView: string;
  savedCount: number;
}

export default function Navbar({ onNavClick, activeView, savedCount }: NavbarProps) {
  return (
    <>
      {/* Top Desktop Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b border-gray-100 shadow-[0px_8px_24px_rgba(15,23,42,0.02)]">
        <div className="flex justify-between items-center w-full px-4 md:px-8 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              id="nav-menu-btn"
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 active:scale-95 text-gray-700"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div 
              id="nav-logo"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onNavClick("buy")}
            >
              <h1 className="font-display font-extrabold text-xl tracking-tight text-[#131b2e] flex items-center gap-1.5">
                <span className="text-blue-600 uppercase tracking-widest text-xs font-mono font-normal">Velocity</span> 
                AutoTrade
              </h1>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-buy-cars"
              onClick={() => onNavClick("buy")}
              className={`px-4 py-2 rounded-lg font-display text-sm font-semibold transition-all duration-200 ${
                activeView === "buy" 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Buy Cars
            </button>
            <button
              id="nav-sell-yours"
              onClick={() => onNavClick("sell")}
              className={`px-4 py-2 rounded-lg font-display text-sm font-semibold transition-all duration-200 ${
                activeView === "sell" 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Sell Yours
            </button>
            <button
              id="nav-valuation"
              onClick={() => onNavClick("valuation")}
              className={`px-4 py-2 rounded-lg font-display text-sm font-semibold transition-all duration-200 ${
                activeView === "valuation" 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Valuation
            </button>
            <button
              id="nav-finance"
              onClick={() => onNavClick("finance")}
              className={`px-4 py-2 rounded-lg font-display text-sm font-semibold transition-all duration-200 ${
                activeView === "finance" 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Finance
            </button>
            <button
              id="nav-saved"
              onClick={() => onNavClick("saved")}
              className={`relative px-4 py-2 rounded-lg font-display text-sm font-semibold transition-all duration-200 ${
                activeView === "saved" 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span>Saved Showroom</span>
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white animate-pulse">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              id="nav-search-search"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors hidden md:block"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 border-l pl-3 border-gray-100">
              <div id="nav-user-profile" className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white overflow-hidden shadow-sm">
                <img 
                  alt="User avatar" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtMMUuQjaxIUNeDEIAK_Ksghg_GVoPBtV4YcqD5ihgazABJcEfFx07MnI7lPGI72qKfaUeIi1JS6Xg3D0238ASiqANwFgpCZnas8y2vnGsLxfMAWmTAJNbujlkJs5N85rd_2sYW0gLz4A5DtGesa9hHH9kZjSoEfbF73t09cmrvGi5cr2CsRzo3wL0vaux5vECLDGzm4shwqu9oqs1ArryGcMt9KEXYytaDw-NxvthR8_oFnOpWXx4Fo8K318ZfeJWwLMlm6xpkaQ"
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 hidden lg:inline-block">Rahul C.</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-16 bg-white pb-safe shadow-[0px_-8px_24px_rgba(15,23,42,0.06)] md:hidden border-t border-gray-100">
        <button
          id="mobile-nav-explore"
          onClick={() => onNavClick("buy")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeView === "buy" ? "text-blue-600 font-semibold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Explore</span>
        </button>
        <button
          id="mobile-nav-sell"
          onClick={() => onNavClick("sell")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeView === "sell" ? "text-blue-600 font-semibold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Sell</span>
        </button>
        <button
          id="mobile-nav-saved"
          onClick={() => onNavClick("saved")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            activeView === "saved" ? "text-blue-600 font-semibold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Heart className="w-5 h-5" />
          {savedCount > 0 && (
            <span className="absolute top-1 right-5 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {savedCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Saved</span>
        </button>
        <button
          id="mobile-nav-valuation"
          onClick={() => onNavClick("valuation")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeView === "valuation" ? "text-blue-600 font-semibold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Value</span>
        </button>
        <button
          id="mobile-nav-finance"
          onClick={() => onNavClick("finance")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeView === "finance" ? "text-blue-600 font-semibold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Finance</span>
        </button>
      </nav>
    </>
  );
}
