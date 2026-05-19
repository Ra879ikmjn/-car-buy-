import React, { useState } from "react";
import { X, Check, CloudUpload, Sparkles } from "lucide-react";
import { Car } from "../types";

interface SellModalProps {
  onClose: () => void;
  onSubmit: (newCar: Partial<Car>) => Promise<void>;
  isOpen: boolean;
}

const PRESET_IMAGES = [
  { name: "Silver GT Coupe", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800" },
  { name: "Crimson Roadster", url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=800" },
  { name: "Supercar Teal", url: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=800" },
  { name: "Dark SUV Explorer", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" },
];

export default function SellModal({ onClose, onSubmit, isOpen }: SellModalProps) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [year, setYear] = useState(2023);
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [transmission, setTransmission] = useState("Automatic");
  const [fuelType, setFuelType] = useState("Petrol");
  const [description, setDescription] = useState("");
  const [selectedImg, setSelectedImg] = useState(PRESET_IMAGES[0].url);
  const [customImg, setCustomImg] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !price || !mileage) {
      alert("Please enter the brand, model, price, and mileage.");
      return;
    }

    setIsSubmitting(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const listingPayload: Partial<Car> = {
      brand: brand.trim(),
      model: model.trim(),
      trim: trim.trim() || "Standard Edition",
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      transmission,
      fuelType,
      description: description.trim(),
      tags: tags.length > 0 ? tags : ["Showroom Ready", "Warranty Included"],
      image: customImg ? customImg.trim() : selectedImg,
    };

    try {
      await onSubmit(listingPayload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
      {/* Background layer */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal headers */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg text-gray-900">List Your Vehicle</h2>
              <p className="text-xs text-gray-500">Exhibit your premium car to hundreds of buyers on AutoTrade.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal form */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto max-h-[75vh] p-6 space-y-5 hide-scrollbar">
          
          {/* Brand, Model, Trim row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">Brand Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. BMW" 
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">Model *</label>
              <input 
                type="text"
                required
                placeholder="e.g. X5" 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">Trim Series</label>
              <input 
                type="text"
                placeholder="e.g. xDrive40i M Sport" 
                value={trim}
                onChange={(e) => setTrim(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all text-xs"
              />
            </div>
          </div>

          {/* Pricing, Mileage, Year row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">Pricing ($ USD) *</label>
              <input 
                type="number"
                required
                min={1000}
                placeholder="e.g. 59900" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all font-semibold text-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">Mileage (Miles) *</label>
              <input 
                type="number"
                required
                min={0}
                placeholder="e.g. 15000" 
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">Production Year *</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all"
              >
                {Array.from({ length: 17 }, (_, i) => 2026 - i).map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Specs options row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="S-Tronic">S-Tronic (Dual Clutch)</option>
                <option value="PDK">PDK Porsche Gearbox</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">Fuel / Engine Layout</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid Plug-In</option>
                <option value="Electric">Electric EV</option>
                <option value="Mild Hybrid">Mild Hybrid (MHEV)</option>
              </select>
            </div>
          </div>

          {/* Preset design layout photos selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">Showroom Cover Image Preset</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_IMAGES.map((img) => (
                <div 
                  key={img.url}
                  onClick={() => { setSelectedImg(img.url); setCustomImg(""); }}
                  className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImg === img.url && !customImg 
                      ? "border-blue-600 scale-[1.02]" 
                      : "border-transparent opacity-80 hover:opacity-100 hover:scale-[1.01]"
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/10 flex items-end p-1.5">
                    <span className="text-[9px] font-bold text-white leading-none whitespace-nowrap bg-black/40 px-1 py-0.5 rounded">
                      {img.name}
                    </span>
                  </div>
                  {selectedImg === img.url && !customImg && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Check className="w-3 h-3 font-extrabold" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom Image Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">Or Paste Custom Image URL</label>
            <div className="flex gap-2">
              <input 
                type="url"
                placeholder="https://images.unsplash.com/..." 
                value={customImg}
                onChange={(e) => { setCustomImg(e.target.value); setSelectedImg(""); }}
                className="flex-1 bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all font-mono"
              />
            </div>
          </div>

          {/* Feature list / Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">Core Features (comma-separated list)</label>
            <input 
              type="text"
              placeholder="e.g. Heated Seats, Panoramic Roof, Head-Up Display" 
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-blue-600 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5 font-sans">Vehicle Story & Highlight Details</label>
            <textarea 
              rows={3}
              placeholder="Describe the vehicle's condition, upgrades, history..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-3 outline-none focus:bg-white focus:border-blue-600 transition-all leading-relaxed font-sans"
            />
          </div>

        </form>

        {/* Submit controls footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-200 text-xs font-bold rounded-xl text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 disabled:bg-blue-400 active:scale-95 transition-all flex items-center gap-1.5 shadow-md"
          >
            {isSubmitting ? "Publishing..." : "Publish Listing"}
          </button>
        </div>

      </div>
    </div>
  );
}
