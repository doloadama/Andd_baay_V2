import { GoogleGenAI, Chat } from "@google/genai";
import { User, Harvest, YieldData, CropDistribution, Project, Crop, Investment } from '../types';

// --- MOCK DATA ---

const crops1: Crop[] = [
  { id: 'c1', projectId: 'p1', type: 'Millet', plantingDate: '2023-06-15T00:00:00.000Z', soilCondition: 'Good', expectedYield: 150, status: 'Harvested' },
  { id: 'c2', projectId: 'p1', type: 'Sorghum', plantingDate: '2023-07-01T00:00:00.000Z', soilCondition: 'Excellent', expectedYield: 100, status: 'Harvested' },
];
const investments1: Investment[] = [
  { id: 'i1', projectId: 'p1', type: 'Seeds', description: 'High-yield millet seeds', amount: 2000, date: '2023-06-01T00:00:00.000Z' },
  { id: 'i2', projectId: 'p1', type: 'Fertilizer', description: 'NPK fertilizer', amount: 3500, date: '2023-07-10T00:00:00.000Z' },
  { id: 'i3', projectId: 'p1', type: 'Labor', description: 'Harvesting labor costs', amount: 5000, date: '2023-10-05T00:00:00.000Z' },
];
const project1: Project = { id: 'p1', name: 'Tambacounda Fields', location: 'Tambacounda, Senegal', farmSize: 250, crops: crops1, investments: investments1 };

const crops2: Crop[] = [
  { id: 'c3', projectId: 'p2', type: 'Peanuts', plantingDate: '2023-06-20T00:00:00.000Z', soilCondition: 'Excellent', expectedYield: 80, status: 'Harvested' },
];
const investments2: Investment[] = [
    { id: 'i4', projectId: 'p2', type: 'Seeds', description: 'Groundnut seeds', amount: 1500, date: '2023-06-05T00:00:00.000Z' },
    { id: 'i5', projectId: 'p2', type: 'Equipment', description: 'Tractor rental', amount: 1000, date: '2023-06-10T00:00:00.000Z' },
];
const project2: Project = { id: 'p2', name: 'Kaolack Grounds', location: 'Kaolack, Senegal', farmSize: 100, crops: crops2, investments: investments2 };

const users: User[] = [
  { id: 'u1', name: 'Adama Gueye', contact: 'adama@example.com', roles: ['farmer'], projects: [project1] },
  { id: 'u2', name: 'Fatou Diop', contact: 'fatou@example.com', roles: ['farmer', 'seller'], projects: [project2] },
  { id: 'u3', name: 'Moussa Sow', contact: 'moussa@example.com', roles: ['seller'], projects: [] },
];

const harvests: Harvest[] = [
  { id: 'h1', farmer: { id: 'u1', name: 'Adama Gueye', contact: 'adama@example.com' }, project: { id: 'p1', name: 'Tambacounda Fields', location: 'Tambacounda' }, cropType: 'Millet', quantity: 145, listingDate: '2023-10-20T00:00:00.000Z', pricePerTon: 350, status: 'Sold', buyer: { id: 'u3', name: 'Moussa Sow' } },
  { id: 'h2', farmer: { id: 'u1', name: 'Adama Gueye', contact: 'adama@example.com' }, project: { id: 'p1', name: 'Tambacounda Fields', location: 'Tambacounda' }, cropType: 'Sorghum', quantity: 98, listingDate: '2023-11-01T00:00:00.000Z', pricePerTon: 320, status: 'Listed' },
  { id: 'h3', farmer: { id: 'u2', name: 'Fatou Diop', contact: 'fatou@example.com' }, project: { id: 'p2', name: 'Kaolack Grounds', location: 'Kaolack' }, cropType: 'Peanuts', quantity: 80, listingDate: '2023-10-15T00:00:00.000Z', pricePerTon: 800, status: 'Sold', buyer: {id: 'u3', name: 'Moussa Sow'} },
];

const yieldData: YieldData[] = [
    { year: 2021, yield: 350 },
    { year: 2022, yield: 380 },
    { year: 2023, yield: 410 },
];

const cropDistribution: CropDistribution[] = [
    { name: 'Millet', value: 400 },
    { name: 'Peanuts', value: 300 },
    { name: 'Sorghum', value: 200 },
    { name: 'Rice', value: 150 },
    { name: 'Other', value: 100 },
];


// --- API Abstraction ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const mockFetch = <T>(data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), 500));

export const api = {
  getUsers: (): Promise<User[]> => mockFetch(JSON.parse(JSON.stringify(users))),
  
  getMarketListings: (): Promise<Harvest[]> => mockFetch([...harvests]),

  getYieldAnalytics: (): Promise<YieldData[]> => mockFetch(yieldData),

  getCropDistribution: (): Promise<CropDistribution[]> => mockFetch(cropDistribution),
  
  addProject: (userId: string, newProjectData: { name: string; location: string; farmSize: number }): Promise<Project> => {
    const user = users.find(u => u.id === userId);
    if (user) {
        const newProject: Project = {
            ...newProjectData,
            id: `p${Date.now()}`,
            crops: [],
            investments: [],
        };
        user.projects.push(newProject);
        return mockFetch(newProject);
    }
    return Promise.reject(new Error('User not found'));
  },

  addHarvest: (newHarvestData: Omit<Harvest, 'id' | 'listingDate' | 'status'>): Promise<Harvest> => {
    const newHarvest: Harvest = {
      ...newHarvestData,
      id: `h${Date.now()}`,
      listingDate: new Date().toISOString(),
      status: 'Listed',
    };
    harvests.push(newHarvest);
    return mockFetch(newHarvest);
  },

  buyHarvest: (harvestId: string, buyer: Pick<User, 'id' | 'name'>): Promise<Harvest | null> => {
    const harvestIndex = harvests.findIndex(h => h.id === harvestId);
    if (harvestIndex !== -1) {
        if (harvests[harvestIndex].status === 'Listed') {
            harvests[harvestIndex].status = 'Sold';
            harvests[harvestIndex].buyer = buyer;
            return mockFetch(harvests[harvestIndex]);
        }
    }
    return mockFetch(null);
  },

  getWeatherRecommendation: async (location: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide a short, actionable farming recommendation for today based on the weather in ${location}. Focus on one key activity. For example: 'Weather is clear and sunny. Ideal for harvesting millet.' or 'High humidity today. Monitor crops for fungal diseases.'`
      });
      return response.text;
    } catch (error) {
      console.error("Failed to get weather recommendation:", error);
      return "Could not fetch weather recommendation. Please check your connection or API key.";
    }
  },

  startChatSession: (currentUser: User, allUsers: User[], marketListings: Harvest[]): Chat => {
    // Sanitize data for the prompt
    const currentUserData = {
        id: currentUser.id,
        name: currentUser.name,
        roles: currentUser.roles,
        projects: currentUser.projects.map(p => ({
            id: p.id,
            name: p.name,
            location: p.location,
            farmSize: p.farmSize,
            crops: p.crops.map(c => ({ type: c.type, status: c.status, expectedYield: c.expectedYield })),
            investments: p.investments.map(i => ({ type: i.type, amount: i.amount }))
        }))
    };

    const systemInstruction = `You are "Andd Baay Helper", a friendly and expert assistant for an agricultural platform in Senegal. Your goal is to help users manage their farm data and navigate the marketplace.

    **CONTEXT:**
    - Today's Date: ${new Date().toLocaleDateString()}
    - The current user's data is: ${JSON.stringify(currentUserData, null, 2)}
    - The complete list of all farmers on the platform is: ${JSON.stringify(allUsers.filter(u => u.roles.includes('farmer')).map(u => ({ id: u.id, name: u.name, projectCount: u.projects.length })), null, 2)}
    - The current marketplace listings are: ${JSON.stringify(marketListings.map(l => ({ crop: l.cropType, quantity: l.quantity, price: l.pricePerTon, status: l.status, farmer: l.farmer.name })), null, 2)}

    **INSTRUCTIONS:**
    1.  Always be concise, helpful, and friendly.
    2.  Answer questions based *only* on the provided context. Do not invent data.
    3.  If asked about personal data (like revenue, profit, investments), only use the data for the currently logged-in user.
    4.  You can perform calculations like summing investments, calculating total revenue from sold items, or finding available crops.
    5.  When asked a question you cannot answer from the context, politely state that you don't have that information.
    `;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction
        }
    });

    return chat;
  }
};
