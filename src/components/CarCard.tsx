import React from "react";
import { Car } from "../types";
import { Heart, Gauge, ShieldCheck, Cpu, Zap, Star } from "lucide-react";

interface CarCardProps {
  key?: string;
  car: Car;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onViewDetails: (car: Car) => void;
}

export default function CarCard({ car, isSaved, onToggleSave, onViewDetails }: CarCardProps) {
  // Translate transmission icons
  const getTransText = (val: string) => {
    return val;
  };

  return (
    <article 
      className="bg-white rounded-2xl overflow-hidden shadow-[0px_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0px_16px_36px_rgba(15,23,42,0.08)] border border-gray-100 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
      id={`car-card-${car.id}`}
    >
      {/* Visual Header / Cover Image */}
      <div className="relative h-60 overflow-hidden">
        <img 
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          src={car.image}
          referrerPolicy="no-referrer"
        />
        
        {/* Dynamic Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {car.isTopDeal && (
            <span className="bg-[#ffddb8] text-[#2a1700] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <Star className="w-3 h-3 text-[#b87500] fill-[#b87500]" />
              TOP DEAL
            </span>
          )}
          {car.isNewListing && (
            <span className="bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              NEW LISTING
            </span>
          )}
        </div>

        {/* Favorite Trigger */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(car.id);
          }}
          className={`absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm z-10 ${
            isSaved ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-red-500"
          }`}
          id={`favorite-btn-${car.id}`}
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Specifications & Price Info */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start mb-2 gap-2">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                {car.brand} {car.model}
              </h3>
              <p className="text-xs text-gray-500 font-medium font-mono mt-0.5">
                {car.trim} • {car.year}
              </p>
            </div>
            
            <div className="text-right flex-shrink-0">
              <div className="font-display font-extrabold text-lg text-blue-600">
                ${car.price.toLocaleString()}
              </div>
              {car.originalPrice && (
                <div className="text-[11px] text-gray-400 font-mono line-through">
                  ${car.originalPrice.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Icons strip */}
          <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-gray-100 my-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <Gauge className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-semibold text-gray-800">{car.mileage.toLocaleString()} mi</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-semibold text-gray-800">{getTransText(car.transmission)}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-semibold text-gray-800">{car.fuelType}</span>
            </div>
          </div>

          {/* Tag Badges list */}
          <div className="flex flex-wrap gap-1.5 mb-5 h-6 overflow-hidden">
            {car.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded font-medium transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* View Details Call to Action */}
        <button 
          onClick={() => onViewDetails(car)}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
          id={`view-details-${car.id}`}
        >
          View Details
        </button>
      </div>
    </article>
  );
}
