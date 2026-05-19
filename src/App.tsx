import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CarCard from "./components/CarCard";
import FilterSidebar from "./components/FilterSidebar";
import SellModal from "./components/SellModal";
import ValuationDrawer from "./components/ValuationDrawer";
import FinanceCalculator from "./components/FinanceCalculator";
import CarDetailsModal from "./components/CarDetailsModal";
import VirtualAgent from "./components/VirtualAgent";
import { Car } from "./types";
import { Search, SlidersHorizontal, Star, X, Sparkles, ChevronLeft, ChevronRight, HelpCircle, GraduationCap } from "lucide-react";

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Views state
  const [activeView, setActiveView] = useState<"buy" | "sell" | "valuation" | "finance" | "saved">("buy");
  const [savedCarIds, setSavedCarIds] = useState<string[]>([]);
  
  // Details Modal context
  const [selectedDetailCar, setSelectedDetailCar] = useState<Car | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [brandQuery, setBrandQuery] = useState<string[]>(["BMW", "Mercedes-Benz"]); // Default seed matching mockup: BMW & Mercedes-Benz
  const [priceRange, setPriceRange] = useState<[number, number]>([30000, 85000]); // Default mockup range: up to $85,000
  const [transmissionQuery, setTransmissionQuery] = useState<string[]>([]);
  const [fuelTypeQuery, setFuelTypeQuery] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("latest");
  const [minYearSelected, setMinYearSelected] = useState<number | null>(2021); // Default mockup: 2021+

  // Modal open triggers
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);

  // Pagination page state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load cars from backend
  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cars");
      const data = await response.json();
      setCars(data);
    } catch (e) {
      console.error("Error loading cars database: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    // Load favorites from local storage
    const saved = localStorage.getItem("saved_showroom");
    if (saved) {
      setSavedCarIds(JSON.parse(saved));
    }
  }, []);

  const handleToggleSave = (id: string) => {
    let nextSaved = [...savedCarIds];
    if (savedCarIds.includes(id)) {
      nextSaved = savedCarIds.filter((cid) => cid !== id);
    } else {
      nextSaved.push(id);
    }
    setSavedCarIds(nextSaved);
    localStorage.setItem("saved_showroom", JSON.stringify(nextSaved));
  };

  const handleSellSubmit = async (newCarData: Partial<Car>) => {
    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCarData)
      });
      if (response.ok) {
        await fetchCars(); // Refresh listing
        setActiveView("buy");
      }
    } catch (err) {
      console.error("Error listing car:", err);
    }
  };

  const handleResetFilters = () => {
    setBrandQuery([]);
    setPriceRange([30000, 160000]);
    setTransmissionQuery([]);
    setFuelTypeQuery([]);
    setMinYearSelected(null);
    setSearchQuery("");
  };

  // Dynamic filter lists matching mockup criteria
  const filteredCars = cars.filter((car) => {
    // Search query keyword matching
    if (searchQuery.trim().length > 0) {
      const keyword = searchQuery.toLowerCase();
      const matchesText = 
        car.brand.toLowerCase().includes(keyword) || 
        car.model.toLowerCase().includes(keyword) || 
        car.trim.toLowerCase().includes(keyword) || 
        (car.description && car.description.toLowerCase().includes(keyword));
      if (!matchesText) return false;
    }

    // Brands match
    if (brandQuery.length > 0 && !brandQuery.includes(car.brand)) {
      return false;
    }

    // Budget match
    if (car.price < priceRange[0] || car.price > priceRange[1]) {
      return false;
    }

    // Transmission match
    if (transmissionQuery.length > 0 && !transmissionQuery.includes(car.transmission)) {
      return false;
    }

    // Fuel match
    if (fuelTypeQuery.length > 0 && !fuelTypeQuery.includes(car.fuelType)) {
      return false;
    }

    // Production Year limit match
    if (minYearSelected !== null && car.year < minYearSelected) {
      return false;
    }

    // Saved showroom View limit
    if (activeView === "saved" && !savedCarIds.includes(car.id)) {
      return false;
    }

    return true;
  });

  // Sort logic
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    if (sortOption === "mileage-low") return a.mileage - b.mileage;
    if (sortOption === "year-new") return b.year - a.year;
    return 1; // "latest" - default backend alignment
  });

  // Pagination calculation
  const totalItems = sortedCars.length;
  const numPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedCars = sortedCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNavNavigation = (view: "buy" | "sell" | "valuation" | "finance" | "saved") => {
    if (view === "sell") {
      setSellModalOpen(true);
    } else {
      setActiveView(view);
      setCurrentPage(1); // reset pagination page
    }
  };

  const handleRemoveBrandFilter = (b: string) => {
    setBrandQuery(brandQuery.filter((item) => item !== b));
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans select-none pb-24 md:pb-0">
      
      {/* Visual Navigation Bar Header */}
      <Navbar 
        onNavClick={handleNavNavigation} 
        activeView={activeView} 
        savedCount={savedCarIds.length} 
      />

      {/* Main Content Areas */}
      <main className="flex-grow pt-24 pb-20 max-w-7xl w-full mx-auto px-4 md:px-8">
        
        {/* VIEW 1: Buy Cars Catalog Explorer */}
        {(activeView === "buy" || activeView === "saved") && (
          <div className="space-y-6">
            
            {/* Catalog Info & Grid title section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-2 border-b border-gray-100 pb-5">
              <div>
                <h2 className="font-display font-extrabold text-3xl tracking-tight text-[#131b2e]">
                  {activeView === "saved" ? "Your Saved Showroom" : "Available Inventory"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {activeView === "saved" 
                    ? `Reviewing ${sortedCars.length} of your customized selections` 
                    : `Showing ${sortedCars.length.toLocaleString()} premium vehicles matching your criteria`}
                </p>
              </div>

              {/* Sorting filter options */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex items-center bg-white border border-gray-150 rounded-xl px-3 py-1.5 shadow-sm text-xs">
                  <span className="text-gray-400 whitespace-nowrap mr-2">Sort by:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="font-bold text-gray-800 bg-transparent py-0.5 pr-6 cursor-pointer focus:outline-none"
                  >
                    <option value="latest">Latest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="mileage-low">Mileage: Low to High</option>
                    <option value="year-new">Year: Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interactive Filters & Chips strip */}
            <div className="flex flex-wrap items-center gap-2.5 pb-2">
              <button 
                onClick={() => setFiltersDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>

              <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>

              {/* Keyword text filter field */}
              <div className="relative max-w-xs w-full hidden sm:block">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Query brand, series, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-150 rounded-full pl-9 pr-4 py-1.5 text-xs outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              {/* Dynamic Filter Tag Chips row matching mockup styling */}
              {brandQuery.length > 0 && (
                <button 
                  onClick={() => setBrandQuery([])}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-50 transition-colors shadow-xs"
                >
                  <span className="font-semibold text-gray-800">{brandQuery.join(" & ")}</span>
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}

              {priceRange[1] < 160000 && (
                <button 
                  onClick={() => setPriceRange([30000, 160000])}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-50 transition-colors shadow-xs"
                >
                  <span className="font-semibold text-gray-800">Under ${priceRange[1].toLocaleString()}</span>
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}

              {minYearSelected !== null && (
                <button 
                  onClick={() => setMinYearSelected(null)}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-50 transition-colors shadow-xs"
                >
                  <span className="font-semibold text-gray-800">{minYearSelected}+</span>
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}

              {transmissionQuery.length > 0 && (
                <button 
                  onClick={() => setTransmissionQuery([])}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-50 transition-colors shadow-xs"
                >
                  <span className="font-semibold text-gray-800">{transmissionQuery.join(", ")}</span>
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}

              {/* Clear all triggers */}
              {(brandQuery.length > 0 || priceRange[1] < 160000 || minYearSelected !== null || transmissionQuery.length > 0 || searchQuery.trim().length > 0) && (
                <button 
                  onClick={handleResetFilters}
                  className="text-blue-600 hover:text-blue-700 text-xs font-bold ml-2 py-1"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Catalog Grid View */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 h-96 rounded-2xl" />
                ))}
              </div>
            ) : paginatedCars.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center max-w-md mx-auto my-12 bg-white">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#131b2e]">No Matching Luxury Vehicles</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Adjust your brand selection, budget caps, or fuel metrics to explore our broader premium catalog.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                >
                  Reset Showroom Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* Dynamically list vehicle cards */}
                {paginatedCars.map((car) => (
                  <CarCard 
                    key={car.id} 
                    car={car} 
                    isSaved={savedCarIds.includes(car.id)}
                    onToggleSave={handleToggleSave}
                    onViewDetails={(c) => setSelectedDetailCar(c)}
                  />
                ))}

                {/* SKELETON PLACEHOLDER - EXACT REPLICA OF SCREENSHOT MOCKUP */}
                <div className="bg-white rounded-2xl overflow-hidden p-5 opacity-40 animate-pulse border border-gray-300 border-dashed flex flex-col justify-between h-[456px]">
                  <div>
                    <div className="bg-gray-200 h-56 rounded-xl mb-4"></div>
                    <div className="h-5 bg-gray-200 w-3/4 rounded-full mb-2"></div>
                    <div className="h-3.5 bg-gray-200 w-1/2 rounded-full mb-6"></div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="h-8 bg-gray-200 rounded-lg"></div>
                      <div className="h-8 bg-gray-200 rounded-lg"></div>
                      <div className="h-8 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                  <div className="h-11 bg-gray-200 rounded-xl"></div>
                </div>

                {/* PROMOTION CARD - DIRECT ACTION DESK LINK */}
                <div className="relative bg-[#131b2e] text-white rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-md group">
                  <div className="relative z-10 space-y-3">
                    <span className="text-[10px] text-blue-400 font-bold tracking-widest font-mono uppercase block">Partnership Rates</span>
                    <h3 className="font-display font-extrabold text-[#ffffff] text-xl leading-snug">Need financing?</h3>
                    <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
                      Get pre-approved in minutes with our highly competitive rates from premium lending desks. Lock your terms today.
                    </p>
                  </div>

                  <div className="pt-6 relative z-10">
                    <button 
                      onClick={() => handleNavNavigation("finance")}
                      className="px-5 py-2.5 bg-white text-gray-900 hover:bg-gray-100 text-xs font-bold rounded-xl transition-colors w-full sm:w-auto"
                    >
                      Apply Now
                    </button>
                  </div>

                  {/* Decorative mesh graphic circles background */}
                  <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />
                  <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                </div>

              </div>
            )}

            {/* Interactive Functional Pagination Bar matching mockup */}
            {!loading && numPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-12 py-4">
                <button 
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-blue-600 hover:bg-white text-gray-600 transition-colors disabled:opacity-40 disabled:hover:border-gray-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: numPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button 
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xs transition-all ${
                        currentPage === pNum 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                          : "border border-gray-200 hover:border-blue-600 bg-white text-gray-700"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                {numPages > 3 && (
                  <>
                    <span className="text-gray-400 px-1 text-xs">...</span>
                    <button 
                      onClick={() => setCurrentPage(12)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-blue-600 bg-white text-gray-700 font-bold text-xs"
                    >
                      12
                    </button>
                  </>
                )}

                <button 
                  onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                  disabled={currentPage === numPages}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-blue-600 hover:bg-white text-gray-600 transition-colors disabled:opacity-40 disabled:hover:border-gray-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}

          </div>
        )}

        {/* VIEW 2: Dynamic Trade-In Valuation Panel */}
        {activeView === "valuation" && <ValuationDrawer />}

        {/* VIEW 3: Mortgage & Financing Calculator Certificate panel */}
        {activeView === "finance" && (
          <FinanceCalculator cars={cars} />
        )}

      </main>

      {/* FOOTER AREA - SCREENSHOT DIRECT LAYOUT */}
      <footer className="bg-[#131b2e] text-white py-12 px-4 md:px-8 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h2 className="font-display font-extrabold text-[#ffffff] text-2xl tracking-tight mb-2">AutoTrade</h2>
            <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
              The world's most trusted marketplace for premium high-performance & bespoke executive automotive assets. Excellence in every transaction.
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-5">
            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookie Settings</span>
              <span className="hover:text-white cursor-pointer transition-colors">Press Kit</span>
            </div>
            <p className="text-gray-500 text-[10px] font-mono">
              © 2026 AutoTrade Marketplace. All rights reserved. Precision-Engineered.
            </p>
          </div>
        </div>
      </footer>

      {/* FILTER DRAWER SIDEBAR (OVERLAY) */}
      <FilterSidebar 
        isOpen={filtersDrawerOpen}
        onClose={() => setFiltersDrawerOpen(false)}
        brandQuery={brandQuery}
        setBrandQuery={setBrandQuery}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        transmissionQuery={transmissionQuery}
        setTransmissionQuery={setTransmissionQuery}
        fuelTypeQuery={fuelTypeQuery}
        setFuelTypeQuery={setFuelTypeQuery}
        sortOption={sortOption}
        setSortOption={setSortOption}
        onClearAll={handleResetFilters}
      />

      {/* SELL MODAL (OVERLAY) */}
      <SellModal 
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        onSubmit={handleSellSubmit}
      />

      {/* DETAILED CAR DRAWER SHEET (OVERLAY) */}
      {selectedDetailCar && (
        <CarDetailsModal 
          car={selectedDetailCar}
          onClose={() => setSelectedDetailCar(null)}
          isSaved={savedCarIds.includes(selectedDetailCar.id)}
          onToggleSave={handleToggleSave}
          onOpenFinanceCalculators={(carId) => {
            setSelectedDetailCar(null);
            setActiveView("finance");
          }}
        />
      )}

      {/* VIRTUAL AGENT CONCIERGE ASSISTANT FAB (PERSISTENT HELPER) */}
      <VirtualAgent 
        onSelectCar={(carId) => {
          const match = cars.find((c) => c.id === carId);
          if (match) setSelectedDetailCar(match);
        }} 
      />

    </div>
  );
}
