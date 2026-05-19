import React, { useState, useEffect } from "react";
import { Car } from "../types";
import { DollarSign, ShieldCheck, Award, FileText, CheckCircle2, ChevronRight, Calculator } from "lucide-react";

interface FinanceCalculatorProps {
  cars: Car[];
  selectedCarId?: string;
}

export default function FinanceCalculator({ cars, selectedCarId }: FinanceCalculatorProps) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [carPrice, setCarPrice] = useState(60000);
  const [downPayment, setDownPayment] = useState(12000);
  const [interestRate, setInterestRate] = useState(4.9);
  const [loanTerm, setLoanTerm] = useState(60); // months
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Application pre-approval fields
  const [fullName, setFullName] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [creditScore, setCreditScore] = useState("good"); // excellent, good, fair
  const [applied, setApplied] = useState(false);
  const [approvalId, setApprovalId] = useState("");

  // Sync selected car if any
  useEffect(() => {
    if (selectedCarId) {
      const match = cars.find((c) => c.id === selectedCarId);
      if (match) {
        setSelectedCar(match);
        setCarPrice(match.price);
        setDownPayment(Math.round(match.price * 0.2));
      }
    } else if (cars.length > 0 && !selectedCar) {
      setSelectedCar(cars[0]);
      setCarPrice(cars[0].price);
      setDownPayment(Math.round(cars[0].price * 0.2));
    }
  }, [selectedCarId, cars]);

  // Compute monthly payment mathematically
  useEffect(() => {
    const loanAmount = carPrice - downPayment;
    if (loanAmount <= 0) {
      setMonthlyPayment(0);
      return;
    }

    const r = interestRate / 100 / 12;
    const n = loanTerm;

    if (r === 0) {
      setMonthlyPayment(Math.round(loanAmount / n));
    } else {
      const payment = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setMonthlyPayment(Math.round(payment));
    }
  }, [carPrice, downPayment, interestRate, loanTerm]);

  const handleCarSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const carId = e.target.value;
    if (carId === "custom") {
      setSelectedCar(null);
      setCarPrice(50000);
      setDownPayment(10000);
    } else {
      const match = cars.find((c) => c.id === carId);
      if (match) {
        setSelectedCar(match);
        setCarPrice(match.price);
        setDownPayment(Math.round(match.price * 0.2));
      }
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !annualIncome) {
      alert("Please specify your name and income.");
      return;
    }
    
    // Create random unique certificate ID
    const randomId = "APV-" + Math.floor(Math.random() * 900000 + 100000);
    setApprovalId(randomId);
    setApplied(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 font-sans" id="finance-calculator-portal">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold tracking-wider font-mono">FINANCE CENTER</span>
        <h2 className="font-display font-extrabold text-3xl text-gray-900 mt-3 tracking-tight">Financing & Pre-Approval</h2>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Configure adaptive terms, calculate precise monthly installments, and obtain custom pre-approval certs in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Parameters Slider Panel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0px_8px_24px_rgba(15,23,42,0.02)] flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#131b2e] mb-4 flex items-center gap-2">
              <Calculator className="w-4.5 h-4.5 text-blue-600" />
              Configure Budget Sliders
            </h3>

            <div className="space-y-5">
              {/* Car selection list */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Selected Inventory Vehicle</label>
                <select
                  value={selectedCar ? selectedCar.id : "custom"}
                  onChange={handleCarSelect}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 outline-none font-semibold focus:border-blue-600 focus:bg-white"
                >
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.brand} {c.model} {c.trim} ({c.year}) — ${c.price.toLocaleString()}
                    </option>
                  ))}
                  <option value="custom">-- Custom Vehicle Pricing --</option>
                </select>
              </div>

              {/* Slider for Car Price */}
              {!selectedCar && (
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Retail Purchase Price</span>
                    <span className="font-bold text-[#131b2e]">${carPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={180000}
                    step={2500}
                    value={carPrice}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setCarPrice(val);
                      if (downPayment > val) setDownPayment(val);
                    }}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}

              {/* Slider for Down Payment */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Down Payment Amount</span>
                  <span className="font-bold text-[#131b2e]">${downPayment.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={carPrice}
                  step={500}
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Slider for Interest Rate */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Annual APR Interest Rate (%)</span>
                  <span className="font-bold text-[#131b2e]">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min={1.9}
                  max={12.9}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Term selects buttons */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">Loan Repayment Term</label>
                <div className="grid grid-cols-4 gap-2">
                  {[36, 48, 60, 72].map((term) => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        loanTerm === term
                          ? "bg-[#131b2e] text-white border-[#131b2e] shadow-sm"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {term} mo <span className="font-normal block text-[9px] opacity-75">({Math.round(term / 12)} Yrs)</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">Estimated Installment</span>
              <span className="font-display text-2xl font-extrabold block mt-0.5">${monthlyPayment} <span className="text-xs font-medium opacity-80">/ monthly</span></span>
            </div>
            <div className="text-right text-[10px] opacity-75 font-mono max-w-[140px]">
              Principal Amount:<br/>
              ${(carPrice - downPayment).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive pre-approval Certificate form */}
        <div className="lg:col-span-5 h-full">
          {!applied ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0px_8px_24px_rgba(15,23,42,0.02)] h-full flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-gray-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  Pre-Approval Desk
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Provide soft-pull financial details to qualify for instant, risk-free pre-approval vouchers valid for 30 days. No hard inquiries list.
                </p>

                <form onSubmit={handleApply} className="space-y-4 mt-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Applicant Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Chanan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Gross Annual Income ($ USD)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 115000"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Estimated Credit Profile</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Excellent (740+)", val: "excellent" },
                        { label: "Good (680-739)", val: "good" },
                        { label: "Fair (600-679)", val: "fair" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setCreditScore(item.val)}
                          className={`py-2 rounded-xl text-[9px] font-bold border transition-all ${
                            creditScore === item.val
                              ? "bg-blue-50 border-blue-600 text-blue-600"
                              : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </form>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  onClick={handleApply}
                  className="w-full py-3 bg-[#131b2e] text-white rounded-xl text-xs font-bold hover:bg-blue-950 transition-all font-display duration-200 flex items-center justify-center gap-1.5 active:scale-95 shadow"
                >
                  Request Pre-Approval Guarantee
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            // Pre-Approval Certificate Card
            <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Decorative graphic background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -z-1" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#131b2e]">Instantly Pre-Approved</h4>
                    <p className="text-[10px] text-emerald-700 font-mono">ID: {approvalId}</p>
                  </div>
                </div>

                {/* Guarantee certificate design */}
                <div className="border border-gray-100 p-4 rounded-xl space-y-4 bg-gray-50/50">
                  <div className="text-center pb-2 border-b border-gray-100">
                    <span className="font-display font-bold text-xs uppercase tracking-widest text-gray-400">Velocity Prime Financial</span>
                    <h5 className="font-display font-extrabold text-sm text-gray-800 uppercase mt-0.5">Approval Certificate</h5>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                    <div>
                      <span className="block text-[9px] text-gray-400 font-mono">APPLICANT</span>
                      <span className="font-bold text-gray-800">{fullName}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-400 font-mono">SELECTED CAR</span>
                      <span className="font-bold text-gray-800">{selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "Custom Purchase Option"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-400 font-mono">PRE-APPROVED APR</span>
                      <span className="font-bold text-emerald-600">{creditScore === "excellent" ? "3.9%" : creditScore === "good" ? "4.9%" : "6.9%"} Fixed APR</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-400 font-mono">GUARANTEED MONTHLY</span>
                      <span className="font-bold text-blue-600">${monthlyPayment} / mo</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[10px] text-gray-400 font-mono italic leading-normal border-t border-gray-100 italic">
                    Certified underwrite generated dynamically on 2026-05-19. Locked pricing rate.
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setApplied(false)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
                >
                  Configure Another Budget Plan
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
