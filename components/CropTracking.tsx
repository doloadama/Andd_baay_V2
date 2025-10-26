
import React, { useState, useEffect } from 'react';
import { Farmer, Crop } from '../types';
import { api } from '../services/api';

interface CropTrackingProps {
  farmer: Farmer;
}

const getStatusColor = (status: Crop['status']) => {
  switch (status) {
    case 'Planting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'Growing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case 'Harvesting': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
    case 'Harvested': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const CropTracking: React.FC<CropTrackingProps> = ({ farmer }) => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      try {
        const cropsData = await api.getCropsByFarmer(farmer.id);
        setCrops(cropsData);
      } catch (error) {
        console.error("Failed to fetch crops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, [farmer.id]);
  
  if (loading) return <div className="text-center">Loading your crops...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Add New Crop</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" placeholder="Crop Type (e.g., Millet)" className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
          <input type="date" placeholder="Planting Date" className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
          <select className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
          </select>
          <input type="number" placeholder="Expected Yield (Tons)" className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
          <button type="submit" className="md:col-span-2 lg:col-span-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Add Crop
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Your Crop Log</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Crop Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Planting Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Soil Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expected Yield (Tons)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {crops.map(crop => (
                <tr key={crop.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{crop.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(crop.plantingDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{crop.soilCondition}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{crop.expectedYield}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(crop.status)}`}>
                      {crop.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CropTracking;
