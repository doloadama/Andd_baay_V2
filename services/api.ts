
import { Farmer, Crop, Harvest, YieldData, CropDistribution } from '../types';

// Seed data to simulate a Django backend with PostgreSQL.

export const MOCK_CROPS_FARMER_1: Crop[] = [
  { id: 'crop1', type: 'Maize', plantingDate: '2023-04-15T00:00:00.000Z', soilCondition: 'Excellent', expectedYield: 50, status: 'Harvested' },
  { id: 'crop2', type: 'Soybeans', plantingDate: '2023-05-20T00:00:00.000Z', soilCondition: 'Good', expectedYield: 40, status: 'Harvested' },
  { id: 'crop3', type: 'Wheat', plantingDate: '2024-03-10T00:00:00.000Z', soilCondition: 'Good', expectedYield: 60, status: 'Growing' },
];

export const MOCK_CROPS_FARMER_2: Crop[] = [
  { id: 'crop4', type: 'Tomatoes', plantingDate: '2024-04-01T00:00:00.000Z', soilCondition: 'Excellent', expectedYield: 25, status: 'Growing' },
  { id: 'crop5', type: 'Potatoes', plantingDate: '2024-03-25T00:00:00.000Z', soilCondition: 'Fair', expectedYield: 30, status: 'Harvesting' },
];

export const MOCK_CROPS_FARMER_3: Crop[] = [
  { id: 'crop6', type: 'Rice', plantingDate: '2023-06-01T00:00:00.000Z', soilCondition: 'Good', expectedYield: 100, status: 'Harvested' },
  { id: 'crop7', type: 'Cotton', plantingDate: '2024-05-15T00:00:00.000Z', soilCondition: 'Good', expectedYield: 80, status: 'Planting' },
];

export const MOCK_FARMERS: Farmer[] = [
  { id: 'farmer1', name: 'Adama Gueye', location: 'Kaolack, Senegal', contact: '+221771234567', farmSize: 120, crops: MOCK_CROPS_FARMER_1 },
  { id: 'farmer2', name: 'Fatou Diop', location: 'Thiès, Senegal', contact: '+221777654321', farmSize: 80, crops: MOCK_CROPS_FARMER_2 },
  { id: 'farmer3', name: 'Moussa Sow', location: 'Saint-Louis, Senegal', contact: '+221772345678', farmSize: 200, crops: MOCK_CROPS_FARMER_3 },
];

export const MOCK_HARVESTS: Harvest[] = [
  { id: 'harvest1', farmer: MOCK_FARMERS[0], cropType: 'Maize', quantity: 48, listingDate: '2023-09-01T00:00:00.000Z', pricePerTon: 150 },
  { id: 'harvest2', farmer: MOCK_FARMERS[0], cropType: 'Soybeans', quantity: 38, listingDate: '2023-10-15T00:00:00.000Z', pricePerTon: 300 },
  { id: 'harvest3', farmer: MOCK_FARMERS[2], cropType: 'Rice', quantity: 95, listingDate: '2023-11-20T00:00:00.000Z', pricePerTon: 220 },
  { id: 'harvest4', farmer: MOCK_FARMERS[1], cropType: 'Potatoes', quantity: 28, listingDate: '2024-07-05T00:00:00.000Z', pricePerTon: 400 },
];

// Mock analytics data
export const MOCK_YIELD_DATA: YieldData[] = [
  { year: 2020, yield: 280 },
  { year: 2021, yield: 350 },
  { year: 2022, yield: 320 },
  { year: 2023, yield: 410 },
  { year: 2024, yield: 250 }, // In progress
];

export const MOCK_CROP_DISTRIBUTION: CropDistribution[] = [
  { name: 'Maize', value: 400 },
  { name: 'Rice', value: 300 },
  { name: 'Soybeans', value: 250 },
  { name: 'Wheat', value: 200 },
  { name: 'Others', value: 150 },
];

// In a real application, these would be async functions making API calls.
export const api = {
  getFarmers: (): Promise<Farmer[]> => Promise.resolve(MOCK_FARMERS),
  getCropsByFarmer: (farmerId: string): Promise<Crop[]> => {
    const farmer = MOCK_FARMERS.find(f => f.id === farmerId);
    return Promise.resolve(farmer ? farmer.crops : []);
  },
  getMarketListings: (): Promise<Harvest[]> => Promise.resolve(MOCK_HARVESTS),
  getYieldAnalytics: (): Promise<YieldData[]> => Promise.resolve(MOCK_YIELD_DATA),
  getCropDistribution: (): Promise<CropDistribution[]> => Promise.resolve(MOCK_CROP_DISTRIBUTION),
  getWeatherRecommendation: (location: string): Promise<string> => {
    // This would call a weather API and a Gemini model for recommendations
    const recommendations = [
      `Sunny spells expected in ${location}. Ideal for harvesting mature crops. Consider irrigating young plants in the evening.`,
      `High humidity in ${location}. Monitor for fungal diseases on tomato and potato plants. Ensure good air circulation.`,
      `Light showers predicted for ${location}. Good time for planting new seeds. Hold off on pesticide application.`,
    ];
    return Promise.resolve(recommendations[Math.floor(Math.random() * recommendations.length)]);
  },
};
