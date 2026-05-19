import React, { useState } from "react";
import { Sparkles, HelpCircle, Activity, ChevronRight, RefreshCw } from "lucide-react";
import { ValuationResult } from "../types";

export default function ValuationDrawer() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2021);
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState<"excellent" | "good" | "fair" | "poor">("good");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);

  const handleAppraisal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !mileage) {
      alert("Please enter the brand, model, and mileage details.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          model,
          year,
          mileage: Number(mileage),
          condition
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 font-sans" id="valuation-system">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold tracking-wider font-mono">APPRAISAL ENGINE</span>
        <h2 className="font-display font-extrabold text-3xl text-gray-900 mt-3 tracking-tight">Instant Trade-In Valuation</h2>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Determine the precise luxury market value of your vehicle in real-time under-pinned by active showroom transactions & Gemini appraisal logic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Appraisal Form fields */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0px_8px_24px_rgba(15,23,42,0.02)]">
          <h3 className="font-display font-bold text-base text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Vehicle Spec Form
          </h3>

          <form onSubmit={handleAppraisal} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1">Make / Brand</label>
              <input 
                type="text"
                required
                placeholder="e.g. BMW"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1">Model Name</label>
              <input 
                type="text"
                required
                placeholder="e.g. 5 Series"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all"
                >
                  {Array.from({ length: 16 }, (_, i) => 2026 - i).map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1">Mileage</label>
                <input 
                  type="number"
                  required
                  min={0}
                  placeholder="e.g. 12000"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Condition multi-select */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">Overall Wear Condition</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["excellent", "good", "fair", "poor"] as const).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`py-2 rounded-xl text-[10px] uppercase font-bold border transition-all ${
                      condition === cond 
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:bg-blue-400 font-display transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Appraising Market Data...
                </>
              ) : (
                <>
                  Generate Appraisal Value
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Appraisal Result dashboard */}
        <div className="lg:col-span-7 h-full flex flex-col justify-between">
          {!loading && !result ? (
            <div className="border border-dashed border-gray-200 rounded-3xl h-80 flex flex-col items-center justify-center p-6 text-center bg-white/50">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-display font-bold text-sm text-[#131b2e]">Your Valuation Report is Ready</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Fill out the left appraisal spec form to compute immediate, AI-grounded valuation thresholds on our visual telemetry dashboard.
              </p>
            </div>
          ) : loading ? (
            <div className="bg-white border border-gray-100 rounded-3xl h-80 p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
              <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin flex items-center justify-center" />
              <div className="mt-6">
                <h4 className="font-display font-semibold text-[#131b2e] text-sm animate-pulse">Scanning live trade indexes</h4>
                <p className="text-[11px] text-gray-400 mt-1 max-w-xs">
                  Running machine matching against luxury vehicle depreciation algorithms and real-time dealer auctions...
                </p>
              </div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
            </div>
          ) : (
            <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-[0px_16px_36px_rgba(37,99,235,0.04)] h-full flex flex-col justify-between space-y-4 animate-in slide-in-from-bottom duration-300">
              
              {/* Appraisal range display */}
              <div className="p-5 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/20 rounded-2xl border border-blue-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider font-mono">Market Valuation Report</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100">Live Appraisal</span>
                </div>
                <div className="font-display font-extrabold text-[13px] text-gray-400 font-mono mt-1 uppercase">ESTIMATED MEDIAN</div>
                <div className="font-display font-extrabold text-4xl text-[#131b2e] leading-tight">
                  ${result?.estimatedValue.toLocaleString()}
                </div>
                
                {/* Horizontal Range Visualization bar */}
                <div className="mt-5">
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-[30%] right-[30%] h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono mt-2 text-gray-500">
                    <div>
                      <span className="block text-[9px] text-gray-400">LOW RANGE</span>
                      <span>${result?.lowRange.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] text-gray-400">HIGH RANGE</span>
                      <span>${result?.highRange.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gemini Professional expert advice block */}
              <div className="bg-gray-50 rounded-2xl p-4.5 border border-gray-100 flex-grow">
                <h5 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-display">
                  <Sparkles className="w-3.5 h-3.5 text-[#b87500]" />
                  Sales Advisory Summary
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed font-sans mt-1">
                  {result?.advice}
                </p>
              </div>

              {/* Action list buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 text-center">
                  <span className="block text-[9px] text-gray-400 uppercase tracking-wider">Estimated Trade Value</span>
                  <span className="font-display text-xs font-extrabold text-blue-600 mt-0.5 block">Excellent Deal</span>
                </div>
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-center">
                  <span className="block text-[9px] text-gray-400 uppercase tracking-wider">Market Demand Score</span>
                  <span className="font-display text-xs font-extrabold text-indigo-600 mt-0.5 block">High Interest (9.2/10)</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
