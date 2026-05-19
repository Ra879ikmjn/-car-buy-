import React from "react";
import { X, Search, SlidersHorizontal, Check } from "lucide-react";

interface FilterSidebarProps {
  onClose?: () => void;
  brandQuery: string[];
  setBrandQuery: (brands: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  transmissionQuery: string[];
  setTransmissionQuery: (trans: string[]) => void;
  fuelTypeQuery: string[];
  setFuelTypeQuery: (fuels: string[]) => void;
  sortOption: string;
  setSortOption: (opt: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
}

const AVAILABLE_BRANDS = ["BMW", "Mercedes-Benz", "Audi", "Porsche", "Tesla", "Land Rover"];
const AVAILABLE_TRANSMISSIONS = ["Automatic", "S-Tronic", "PDK"];
const AVAILABLE_FUELS = ["Petrol", "Diesel", "Hybrid", "Electric", "Mild Hybrid"];

export default function FilterSidebar({
  onClose,
  brandQuery,
  setBrandQuery,
  priceRange,
  setPriceRange,
  transmissionQuery,
  setTransmissionQuery,
  fuelTypeQuery,
  setFuelTypeQuery,
  sortOption,
  setSortOption,
  onClearAll,
  isOpen
}: FilterSidebarProps) {
  
  const handleBrandToggle = (brand: string) => {
    if (brandQuery.includes(brand)) {
      setBrandQuery(brandQuery.filter(b => b !== brand));
    } else {
      setBrandQuery([...brandQuery, brand]);
    }
  };

  const handleTransToggle = (trans: string) => {
    if (transmissionQuery.includes(trans)) {
      setTransmissionQuery(transmissionQuery.filter(t => t !== trans));
    } else {
      setTransmissionQuery([...transmissionQuery, trans]);
    }
  };

  const handleFuelToggle = (fuel: string) => {
    if (fuelTypeQuery.includes(fuel)) {
      setFuelTypeQuery(fuelTypeQuery.filter(f => f !== fuel));
    } else {
      setFuelTypeQuery([...fuelTypeQuery, fuel]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex md:justify-end">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <h2 className="font-display font-semibold text-lg text-[#131b2e]">Filter Inventory</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 hide-scrollbar">
          
          {/* Sorting Option inside filtering */}
          <div>
            <h3 className="text-xs font-bold text-[#7c839b] tracking-wider uppercase mb-3">Sort Results</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="latest">Latest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="mileage-low">Mileage: Low to High</option>
              <option value="year-new">Year: Newest First</option>
            </select>
          </div>

          {/* Brands Selector */}
          <div>
            <h3 className="text-xs font-bold text-[#7c839b] tracking-wider uppercase mb-3">Brand Name</h3>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_BRANDS.map((brand) => {
                const isSelected = brandQuery.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => handleBrandToggle(brand)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected 
                        ? "bg-blue-50 border-blue-600 text-blue-600" 
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{brand}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Price Range slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-[#7c839b] tracking-wider uppercase">Budget Cap</h3>
              <span className="text-xs font-bold text-blue-600">${priceRange[1].toLocaleString()}</span>
            </div>
            
            <input 
              type="range"
              min={30000}
              max={160000}
              step={5000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            
            <div className="flex justify-between text-[11px] text-gray-400 font-mono mt-1">
              <span>$30,000</span>
              <span>$160,000+</span>
            </div>
          </div>

          {/* Transmission specifications */}
          <div>
            <h3 className="text-xs font-bold text-[#7c839b] tracking-wider uppercase mb-3">Transmission Type</h3>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_TRANSMISSIONS.map((trans) => {
                const isSelected = transmissionQuery.includes(trans);
                return (
                  <button
                    key={trans}
                    onClick={() => handleTransToggle(trans)}
                    className={`px-2 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                      isSelected 
                        ? "bg-blue-50 border-blue-600 text-blue-600" 
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {trans}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fuel selection */}
          <div>
            <h3 className="text-xs font-bold text-[#7c839b] tracking-wider uppercase mb-3">Fuel Engine</h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_FUELS.map((fuel) => {
                const isSelected = fuelTypeQuery.includes(fuel);
                return (
                  <button
                    key={fuel}
                    onClick={() => handleFuelToggle(fuel)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected 
                        ? "bg-blue-50 border-blue-600 text-blue-600" 
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {fuel}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer controls overlay */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 text-center">
          <button
            onClick={onClearAll}
            className="flex-1 py-3 bg-white border border-gray-200 text-xs font-bold rounded-xl text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Clear Filters
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
