import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini SDK
let genAIInstance: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI {
  if (!genAIInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chat features will run in mock mode.");
      // We will create a fallback mock or throw a clear error on first actual usage
    }
    genAIInstance = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAIInstance;
}

// Global In-Memory Car Database
let cars = [
  {
    id: "bmw-5",
    brand: "BMW",
    model: "5 Series",
    trim: "530i M Sport",
    year: 2022,
    price: 52900,
    originalPrice: 54500,
    mileage: 12400,
    transmission: "Automatic",
    fuelType: "Hybrid",
    tags: ["Sunroof", "Navigation", "Leather"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_hv_6uRZKkwedXmC4cWwbUQnvRIeCXVeAdgKeO2n5SDA1OhkUON2MPhdlSowRAwXeS6NIqMjW5DHagYFEmR948CT-4KMJMOatQJzeUYTKl120sUZKXYUXapE0nS5hfnFRxnkCH6wI8TcIpnHPnbP8vBsh-EInzskQ0uFYGM_nLIK_DqFz2kr6Km1yEtnLEJTzr5qfKBFDdQLpuURI0r_73pg7DLcshEzw6lpllKRrnT7R-6yglI9ucWs8I-Esj2_kV-au1Po9eus",
    isTopDeal: true,
    color: "Sophisto Grey Metallic",
    owners: 1,
    engine: "2.0L 4-Cylinder Turbo",
    horsepower: 248,
    description: "An exceptional luxury executive sedan that offers the perfect balance of performance, high-tech features, and plug-in hybrid efficiency. Fully serviced at authorized BMW dealerships and in immaculate condition."
  },
  {
    id: "merc-e",
    brand: "Mercedes-Benz",
    model: "E-Class",
    trim: "E450 AMG Line",
    year: 2023,
    price: 68200,
    mileage: 5800,
    transmission: "Automatic",
    fuelType: "Petrol",
    tags: ["Heated Seats", "Burmester Sound"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlalFOqsiUpC59TBF1Hj7E87YAzSu5Y1W2D1MI-2xDDPsoNq7fAfD3TWZYacRn5lPc6a6iLre3_2aK3C_nAq4TwxMQIm85CVI1u398ITsmy_2QcQFQVS5Ex6QtHhF9lZB67QMif4rckvKPggX5lJtKRmpbxvyAb9qhS8OqxZe8afPUOwXb0e2NLYAWIWoT7mACSowLpcLOSowSgDlgVVdZxoGRHq5RnrR1KVtRTqSMoNY20XW0fSJSYi7MQe_iHaOzUfIepu9AxV4",
    isNewListing: true,
    color: "Polar White",
    owners: 1,
    engine: "3.0L Inline-6 Turbo with Mild Hybrid",
    horsepower: 362,
    description: "The Mercedes-Benz E-Class Coupe combines sweeping lines, high-grade AMG Line enhancements, and a silky inline-six engine. Fitted with state-of-the-art sensory safety systems and Burmester surround audio."
  },
  {
    id: "audi-a6",
    brand: "Audi",
    model: "A6 Quattro",
    trim: "Black Edition",
    year: 2021,
    price: 45500,
    mileage: 24100,
    transmission: "S-Tronic",
    fuelType: "Diesel",
    tags: ["360 Cam", "Matrix LED"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDowavULgPhfYrevznwsRjEGABPlQSZMR12ZbFfT2WEXevbGBOSA5ulIaELJRCbya7Y0bSPZhY_l_MLMk5VlO3ygS7BoXVXxlGJbXu8U4XssmEEYIMiBxnMMZVyufXq9ZHQimV1RJf2oZRXS5C0lBNC4MMZkPRZrAHefR-70yQ_FI8GwKlwu1TEoNowxMfwyZz4imkBD0iqpQ9omEd1H2rjshXe_JLilKtKqiw_hWbBWdzscvwQOFysO5_jRlil1WoebL8XgLGczfE",
    isTopDeal: true,
    color: "Daytona Gray Pearl",
    owners: 2,
    engine: "2.0L TDI 4-Cylinder",
    horsepower: 204,
    description: "With its Black Edition package, this Audi A6 boasts a aggressive dark visual tone combined with Daytona Gray pearlescent paint. High-definition LED Matrix lights adapt seamlessly to traffic paths."
  },
  {
    id: "porsche-911",
    brand: "Porsche",
    model: "911",
    trim: "Carrera S",
    year: 2020,
    price: 105000,
    mileage: 18200,
    transmission: "PDK",
    fuelType: "Petrol",
    tags: ["Sport Chrono", "PASM"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2qx7HHqPE8k490YIlmFeJ5fqw4c7EBd0MikZ1qW9UR-xh_1bjU_BlNzNsjn3jlVCeyKVbISYX6WhmgCYUqJV44aPC55Opk7CxGjUlmqkLnzGq6RP9NYgbou0kBQ5tzKKRVKLUZZDsQnKhDOcz7XKJw9PZZTEWZRtP_lQEsTpxX7wir7MTTYm1gpS5XVxXKhc35eTVDV0AA18XI1IZ6kS6kO8MWbxe5L9qOQp37cc-vsC1RMFES_VQ-iK8WjocuVTvrH8gleVJ6_w",
    color: "Gentian Blue Metallic",
    owners: 1,
    engine: "3.0L Twin-Turbo Flat-6",
    horsepower: 443,
    description: "The quintessential sports car. This Gentian Blue Porsche 911 Coupe comes heavily equipped with the desirable Sport Chrono Package and Porsche Active Suspension Management (PASM)."
  },
  {
    id: "tesla-s",
    brand: "Tesla",
    model: "Model S",
    trim: "Plaid",
    year: 2022,
    price: 79900,
    originalPrice: 89900,
    mileage: 15400,
    transmission: "Automatic",
    fuelType: "Electric",
    tags: ["Autopilot", "Plaid Mode", "Yoke Steer"],
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800",
    isNewListing: true,
    color: "Solid Black",
    owners: 1,
    engine: "Tri-Motor AWD Electric",
    horsepower: 1020,
    description: "Unparalleled acceleration. Plaid delivers 1,020 peak horsepower with rocket-like response. Fitted with premium black interior and the iconic yoke steering layout."
  },
  {
    id: "rover-def",
    brand: "Land Rover",
    model: "Defender",
    trim: "110 D250 SE",
    year: 2021,
    price: 64500,
    mileage: 32200,
    transmission: "Automatic",
    fuelType: "Mild Hybrid",
    tags: ["4WD", "Panoramic Roof", "Air Suspension"],
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=800",
    isTopDeal: false,
    color: "Pangea Green Metallic",
    owners: 1,
    engine: "3.0L Twin-Turbo Diesel I6 MHEV",
    horsepower: 249,
    description: "The ultimate modern explorer. Finished in signature Pangea Green, this Defender is the SE specification featuring air suspension, premium survival gear mounts, and luxury off-road capability."
  },
  {
    id: "bmw-m4",
    brand: "BMW",
    model: "M4",
    trim: "Competition Coupé",
    year: 2023,
    price: 89000,
    mileage: 4200,
    transmission: "Automatic",
    fuelType: "Petrol",
    tags: ["Carbon Pack", "Laserlights", "Heads-Up Display"],
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800",
    isTopDeal: true,
    color: "Isle of Man Green",
    owners: 1,
    engine: "3.0L Twin-Turbo Inline-6",
    horsepower: 503,
    description: "Pure driving adrenaline. Isle of Man Green metallic coordinates beautifully with individual Tartufo Merino leather. Equipped with exterior Carbon Fiber pack and M Drivers Package."
  }
];

// API: Get all cars
app.get("/api/cars", (req, res) => {
  res.json(cars);
});

// API: Create new car listing (Sell Yours)
app.post("/api/cars", (req, res) => {
  try {
    const { brand, model, trim, year, price, mileage, transmission, fuelType, tags, image, color, engine, horsepower, description } = req.body;
    
    if (!brand || !model || !year || !price || !mileage) {
      return res.status(400).json({ error: "Missing required fields (brand, model, year, price, mileage)" });
    }

    const newCar = {
      id: `${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      brand,
      model,
      trim: trim || "Standard",
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      transmission: transmission || "Automatic",
      fuelType: fuelType || "Petrol",
      tags: Array.isArray(tags) ? tags : [],
      image: image || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      color: color || "Unknown",
      owners: 1,
      engine: engine || "Standard Hybrid/Petrol",
      horsepower: horsepower ? Number(horsepower) : 200,
      description: description || `A pristine ${year} ${brand} ${model} offering comfort, reliability, and excellent driving dynamic.`,
      isNewListing: true
    };

    cars.unshift(newCar);
    res.status(201).json(newCar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: Valuation Endpoint
app.post("/api/valuation", async (req, res) => {
  const { brand, model, year, mileage, condition } = req.body;

  if (!brand || !model || !year) {
    return res.status(400).json({ error: "Brand, model, and year are required" });
  }

  const baseValues: { [key: string]: number } = {
    bmw: 45000,
    mercedes: 50000,
    audi: 40000,
    porsche: 90000,
    tesla: 55000,
    toyota: 22000,
    honda: 20000,
    ford: 25000,
  };

  const cleanBrand = brand.toLowerCase().trim();
  let baseValue = baseValues[cleanBrand] || 30000;

  // Simple math calculation fallback in case Gemini is offline or not key-mapped
  const age = new Date().getFullYear() - Number(year);
  let depreciatedValue = baseValue * Math.pow(0.88, Math.max(0, age));

  // Mileage penalty
  const miles = Number(mileage) || 0;
  depreciatedValue -= (miles / 10000) * 1200;

  // Condition multiplier
  let condMult = 1.0;
  if (condition === "excellent") condMult = 1.08;
  if (condition === "good") condMult = 1.0;
  if (condition === "fair") condMult = 0.85;
  if (condition === "poor") condMult = 0.65;

  let estimatedValue = Math.max(8000, Math.round(depreciatedValue * condMult));
  let lowRange = Math.round(estimatedValue * 0.94);
  let highRange = Math.round(estimatedValue * 1.06);

  let advice = `Based on current market conditions for the ${year} ${brand} ${model}, the value is heavily dictated by its low wear-and-tear. Keeping standard service records is highly recommended to preserve value.`;

  // Try to query Gemini the perfect response to give it elite premium feel
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiAI();
      const prompt = `Give me a professional, high-end automated valuation summary of a ${year} ${brand} ${model} with ${mileage} miles, and rated in "${condition}" condition. 
Estimate the market value range in US dollars. Keep your advice brief, insightful, tailored to this model, and extremely professional (maximum 3 sentences). Ensure the estimated price is realistic between $${lowRange} and $${highRange}.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      if (response.text) {
        advice = response.text.trim();
        // Extract any number matching price range if found, or just keep ours
        const matches = response.text.match(/\$(\d{2,3}),(\d{3})/g);
        if (matches && matches.length >= 2) {
          const parsed1 = parseInt(matches[0].replace(/[$,]/g, ''));
          const parsed2 = parseInt(matches[1].replace(/[$,]/g, ''));
          lowRange = Math.min(parsed1, parsed2);
          highRange = Math.max(parsed1, parsed2);
          estimatedValue = Math.round((lowRange + highRange) / 2);
        }
      }
    } catch (e) {
      console.error("Gemini valuation advice generation failed, using fallback metrics:", e);
    }
  }

  res.json({
    estimatedValue,
    lowRange,
    highRange,
    advice
  });
});

// API: Assistant Chat (Sales Agent / Chat bot)
app.post("/api/chat", async (req, res) => {
  const { messages, carContextId } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  const latestMessage = messages[messages.length - 1]?.text || "Hello";

  // If a context car is specified, grab its detail
  const contextCar = carContextId ? cars.find(c => c.id === carContextId) : null;

  // Let's print out the inventory for Gemini to make it dynamic
  const formattedInventory = cars.map(c => 
    `- ${c.brand} ${c.model} ${c.trim} (${c.year}): $${c.price} (${c.mileage} miles, ${c.transmission}, ${c.fuelType}, features: ${c.tags.join(', ')})`
  ).join("\n");

  const systemPrompt = `You are "Velocity Prime Sales Agent", an elite, personalized virtual assistant for the high-end AutoTrade marketplace. 
You correspond in a precise, hospitable, helpful, and sophisticated manner.
You must help the user search correct cars, answer vehicle questions, estimate financing budgets, or explain specifications.

Here is the current real-time inventory of AutoTrade:
${formattedInventory}

${contextCar ? `The user is currently viewing detailed specs for: ${contextCar.brand} ${contextCar.model} ${contextCar.trim} (${contextCar.year}), priced at $${contextCar.price}, with ${contextCar.mileage} miles, running a ${contextCar.engine} engine with ${contextCar.horsepower} horsepower. Color: ${contextCar.color}. Description: ${contextCar.description}. Please personalize your reply regarding this car if they ask about it or ask related questions!` : ""}

If they ask to recommend a car, look through the real-time inventory above and suggest the absolute best match with its price!
Keep responses concise, beautiful, readable (using Markdown), with a premium dealership feel. Make recommendations clear.`;

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiAI();
      
      // Let's format the chat history for Gemini
      const contents = messages.map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      // Append systemInstruction / generate content
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: latestMessage,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I am here to assist you with finding your perfect vehicle.";
      return res.json({ text: replyText });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return res.status(200).json({ text: `I encountered a connection error, but here is some premium automated advice:\n\nBased on our collection of upscale high-performance models like the BMW 5 Series ($52,900) or Porsche 911 ($105,000), we recommend a test drive or submitting a pre-approval finance application. Let me know if you would like me to set up a dealer appointment!` });
    }
  } else {
    // Elegant simulated fallback
    let responseText = "Greetings. I am currently running in showroom companion mode. How can I assist you with our catalog today?";
    const msgLower = latestMessage.toLowerCase();
    if (msgLower.includes("bmw") || msgLower.includes("german")) {
      responseText = "Excellent taste. We have a pristine **2022 BMW 5 Series 530i M Sport** ($52,900) with only 12,400 miles, and an aggressive **2023 BMW M4 Competition** ($89,000) in Isle of Man Green. They offer breathtaking performance and sophisticated driving technology. Would you like to schedule a private viewing?";
    } else if (msgLower.includes("budget") || msgLower.includes("under") || msgLower.includes("price") || msgLower.includes("cheap")) {
      responseText = "If you are looking for outstanding value, we highly recommend our **2021 Audi A6 Quattro Black Edition** ($45,500) with Daytona Gray shell or the **2022 BMW 5 Series** ($52,900). Both represent top tier executive deals with custom specification packaging.";
    } else if (contextCar) {
      responseText = `The ${contextCar.year} ${contextCar.brand} ${contextCar.model} is standard-equipped with an exceptional ${contextCar.engine} offering ${contextCar.horsepower} HP. Our showroom has inspectable records of its ${contextCar.owners} previous owner. Would you like me to connect you with our financing desk to calculate loan options?`;
    }
    
    return res.json({ text: responseText });
  }
});

// Setup Vite development middleware or production server static paths
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
