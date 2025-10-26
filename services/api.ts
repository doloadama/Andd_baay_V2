import { User, Project, Crop, Harvest, YieldData, CropDistribution, Investment } from '../types';

// Seed data to simulate a Django backend with PostgreSQL.

// PROJECTS
const MOCK_PROJECTS_FARMER_1: Project[] = [
  {
    id: 'proj1',
    name: 'Kaffrine Fields',
    location: 'Kaffrine, Senegal',
    farmSize: 70,
    crops: [
      { id: 'crop1', projectId: 'proj1', type: 'Maize', plantingDate: '2023-04-15T00:00:00.000Z', soilCondition: 'Excellent', expectedYield: 50, status: 'Harvested' },
      { id: 'crop3', projectId: 'proj1', type: 'Wheat', plantingDate: '2024-03-10T00:00:00.000Z', soilCondition: 'Good', expectedYield: 60, status: 'Growing' },
    ],
    investments: [
      { id: 'inv1', projectId: 'proj1', type: 'Seeds', description: 'Hybrid Maize Seeds', amount: 500, date: '2024-03-01T00:00:00.000Z' },
      { id: 'inv3', projectId: 'proj1', type: 'Labor', description: 'Planting labor costs', amount: 1200, date: '2024-03-10T00:00:00.000Z' },
    ],
  },
  {
    id: 'proj2',
    name: 'Kaolack Delta',
    location: 'Kaolack, Senegal',
    farmSize: 50,
    crops: [
      { id: 'crop2', projectId: 'proj2', type: 'Soybeans', plantingDate: '2023-05-20T00:00:00.000Z', soilCondition: 'Good', expectedYield: 40, status: 'Harvested' },
    ],
    investments: [
       { id: 'inv2', projectId: 'proj2', type: 'Fertilizer', description: 'NPK Fertilizer', amount: 800, date: '2024-03-05T00:00:00.000Z' },
    ],
  },
];

const MOCK_PROJECTS_FARMER_2: Project[] = [
  {
    id: 'proj3',
    name: 'Thiès Gardens',
    location: 'Thiès, Senegal',
    farmSize: 80,
    crops: [
        { id: 'crop4', projectId: 'proj3', type: 'Tomatoes', plantingDate: '2024-04-01T00:00:00.000Z', soilCondition: 'Excellent', expectedYield: 25, status: 'Growing' },
        { id: 'crop5', projectId: 'proj3', type: 'Potatoes', plantingDate: '2024-03-25T00:00:00.000Z', soilCondition: 'Fair', expectedYield: 30, status: 'Harvesting' },
    ],
    investments: [
        { id: 'inv4', projectId: 'proj3', type: 'Equipment', description: 'New irrigation pump', amount: 1500, date: '2024-02-20T00:00:00.000Z' },
        { id: 'inv5', projectId: 'proj3', type: 'Seeds', description: 'Tomato and Potato seeds', amount: 400, date: '2024-03-15T00:00:00.000Z' },
    ]
  }
];

const MOCK_PROJECTS_FARMER_3: Project[] = [
    {
        id: 'proj4',
        name: 'River Side Farm',
        location: 'Saint-Louis, Senegal',
        farmSize: 200,
        crops: [
            { id: 'crop6', projectId: 'proj4', type: 'Rice', plantingDate: '2023-06-01T00:00:00.000Z', soilCondition: 'Good', expectedYield: 100, status: 'Harvested' },
            { id: 'crop7', projectId: 'proj4', type: 'Cotton', plantingDate: '2024-05-15T00:00:00.000Z', soilCondition: 'Good', expectedYield: 80, status: 'Planting' },
        ],
        investments: [
            { id: 'inv6', projectId: 'proj4', type: 'Labor', description: 'Harvesting labor for rice', amount: 2000, date: '2023-11-01T00:00:00.000Z'},
        ]
    }
];


// USERS
export const MOCK_USERS: User[] = [
  { id: 'farmer1', name: 'Adama Gueye', contact: '+221771234567', roles: ['farmer', 'seller'], projects: MOCK_PROJECTS_FARMER_1 },
  { id: 'farmer2', name: 'Fatou Diop', contact: '+221777654321', roles: ['farmer'], projects: MOCK_PROJECTS_FARMER_2 },
  { id: 'farmer3', name: 'Moussa Sow', contact: '+221772345678', roles: ['farmer', 'seller'], projects: MOCK_PROJECTS_FARMER_3 },
];

// HARVESTS
export const MOCK_HARVESTS: Harvest[] = [
  { id: 'harvest1', farmer: MOCK_USERS[0], project: MOCK_PROJECTS_FARMER_1[0], cropType: 'Maize', quantity: 48, listingDate: '2023-09-01T00:00:00.000Z', pricePerTon: 150, status: 'Sold' },
  { id: 'harvest2', farmer: MOCK_USERS[0], project: MOCK_PROJECTS_FARMER_1[1], cropType: 'Soybeans', quantity: 38, listingDate: '2023-10-15T00:00:00.000Z', pricePerTon: 300, status: 'Sold' },
  { id: 'harvest3', farmer: MOCK_USERS[2], project: MOCK_PROJECTS_FARMER_3[0], cropType: 'Rice', quantity: 95, listingDate: '2023-11-20T00:00:00.000Z', pricePerTon: 220, status: 'Sold' },
  { id: 'harvest4', farmer: MOCK_USERS[1], project: MOCK_PROJECTS_FARMER_2[0], cropType: 'Potatoes', quantity: 28, listingDate: '2024-07-05T00:00:00.000Z', pricePerTon: 400, status: 'Listed' },
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
  getUsers: (): Promise<User[]> => Promise.resolve(MOCK_USERS),
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
