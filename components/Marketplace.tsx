import React, { useState, useEffect } from 'react';
import { Harvest } from '../types';
import { api } from '../services/api';

const Marketplace: React.FC = () => {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHarvests = async () => {
      setLoading(true);
      try {
        const harvestData = await api.getMarketListings();
        setHarvests(harvestData);
      } catch (error) {
        console.error("Failed to fetch market listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHarvests();
  }, []);

  if (loading) return <div className="text-center">Loading market listings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Marketplace Listings</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          List New Harvest
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {harvests.map(harvest => (
          <div key={harvest.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 relative">
            {harvest.status === 'Sold' && (
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">SOLD</div>
            )}
            <img src={`https://picsum.photos/400/200?random=${harvest.id}`} alt={harvest.cropType} className={`w-full h-40 object-cover ${harvest.status === 'Sold' ? 'filter grayscale' : ''}`} />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{harvest.cropType}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                From <span className="font-semibold">{harvest.project.name}</span> by <span className="font-semibold">{harvest.farmer.name}</span>
              </p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{harvest.quantity} Tons</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-lg font-semibold text-green-600">${harvest.pricePerTon} / Ton</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Listed on: {new Date(harvest.listingDate).toLocaleDateString()}
              </p>
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={harvest.status === 'Sold'}
              >
                {harvest.status === 'Sold' ? 'Sold' : 'Contact Farmer'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
