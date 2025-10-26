
export interface Farmer {
  id: string;
  name: string;
  location: string;
  contact: string;
  farmSize: number; // in acres
  crops: Crop[];
}

export interface Crop {
  id: string;
  type: string;
  plantingDate: string; // ISO string format
  soilCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  expectedYield: number; // in tons
  status: 'Planting' | 'Growing' | 'Harvesting' | 'Harvested';
}

export interface Harvest {
  id: string;
  farmer: Pick<Farmer, 'id' | 'name' | 'location' | 'contact'>;
  cropType: string;
  quantity: number; // in tons
  listingDate: string; // ISO string format
  pricePerTon: number; // in USD
}

export interface YieldData {
  year: number;
  yield: number; // in tons
}

export interface CropDistribution {
  name: string;
  value: number;
}
