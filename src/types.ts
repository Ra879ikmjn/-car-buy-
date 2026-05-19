export interface Car {
  id: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  tags: string[];
  image: string;
  isTopDeal?: boolean;
  isNewListing?: boolean;
  color?: string;
  owners?: number;
  engine?: string;
  horsepower?: number;
  description?: string;
}

export interface ChatMessage {
  sender: "user" | "agent";
  text: string;
  timestamp: string;
}

export interface ValuationRequest {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: "excellent" | "good" | "fair" | "poor";
}

export interface ValuationResult {
  estimatedValue: number;
  lowRange: number;
  highRange: number;
  advice: string;
}
