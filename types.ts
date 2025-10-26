
export type View = 'dashboard' | 'projects' | 'crops' | 'investments' | 'market' | 'farmers';
export type Role = 'farmer' | 'seller';

export interface User {
  id: string;
  name: string;
  contact: string;
  roles: Role[];
  projects: Project[];
}

export interface Project {
  id: string;
  name: string;
  location: string;
  farmSize: number; // in acres
  crops: Crop[];
  investments: Investment[];
}

export interface Crop {
  id: string;
  projectId: string;
  type: string;
  plantingDate: string; // ISO string format
  soilCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  expectedYield: number; // in tons
  status: 'Planting' | 'Growing' | 'Harvesting' | 'Harvested';
}

export interface Investment {
  id: string;
  projectId: string;
  type: 'Seeds' | 'Fertilizer' | 'Equipment' | 'Labor' | 'Other';
  description: string;
  amount: number; // cost in USD
  date: string; // ISO string format
}

export interface Harvest {
  id: string;
  farmer: Pick<User, 'id' | 'name' | 'contact'>;
  project: Pick<Project, 'id' | 'name' | 'location'>;
  cropType: string;
  quantity: number; // in tons
  listingDate: string; // ISO string format
  pricePerTon: number; // in USD
  status: 'Listed' | 'Sold';
  buyer?: Pick<User, 'id' | 'name'>;
}

export interface YieldData {
  year: number;
  yield: number; // in tons
}

export interface CropDistribution {
  name: string;
  value: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
