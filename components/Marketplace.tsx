import React, { useState, useEffect, useMemo } from 'react';
// FIX: Import `Role` from the central `types.ts` file.
import { Harvest, User, Role } from '../types';
import { api } from '../services/api';
import ContactFarmerModal from './ContactFarmerModal';
import ListHarvestModal from './ListHarvestModal';

interface MarketplaceProps {
  currentUser: User;
  role: Role;
  onDataChange: () => void;
}

const getStatusPill = (status: Harvest['status']) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
  if (status === 'Listed') {
    return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
  }
  return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
};

const Marketplace: React.FC<MarketplaceProps> = ({ currentUser, role, onDataChange }) => {
  const [listings, setListings] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isBuyingId, setIsBuyingId] = useState<string | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await api.getMarketListings();
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch market listings:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchListings();
  }, [refreshKey]);
  
  const handleContact = (listing: Harvest) => {
    const farmer: User = { 
        id: listing.farmer.id, 
        name: listing.farmer.name, 
        contact: listing.farmer.contact,
        roles: ['farmer'],
        projects: []
    };
    setSelectedFarmer(farmer);
    setIsContactModalOpen(true);
  };

  const handleHarvestListed = () => {
    setRefreshKey(prevKey => prevKey + 1);
    onDataChange();
  };

  const handleBuy = async (listing: Harvest) => {
    setIsBuyingId(listing.id);
    try {
        const updatedHarvest = await api.buyHarvest(listing.id, { id: currentUser.id, name: currentUser.name });
        if (updatedHarvest) {
            // Immediately update the local state for instant UI feedback
            setListings(prevListings => 
                prevListings.map(l => (l.id === updatedHarvest.id ? updatedHarvest : l))
            );
            onDataChange(); // Trigger global data refresh for dashboard
        } else {
            alert('Purchase failed. The item may no longer be available.');
            setRefreshKey(prevKey => prevKey + 1); // Refresh to get latest status
        }
    } catch (error) {
        console.error("Failed to buy harvest:", error);
        alert("An error occurred during purchase.");
    } finally {
        setIsBuyingId(null);
    }
  };
  
  const purchaseHistory = useMemo(() => 
    listings.filter(l => l.buyer?.id === currentUser.id)
  , [listings, currentUser]);

  if (loading) {
    return <div>Loading marketplace...</div>;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Marketplace</h1>
          {currentUser.roles.includes('farmer') && (
             <button onClick={() => setIsListModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
                + List New Harvest
            </button>
          )}
        </div>

        {role === 'seller' && purchaseHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Your Purchase History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Crop Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Farmer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity (Tons)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {purchaseHistory.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.cropType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.farmer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${(item.quantity * item.pricePerTon).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(item.listingDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map(listing => {
            const isBuyButtonDisabled = 
              listing.status === 'Sold' ||
              listing.farmer.id === currentUser.id ||
              !!isBuyingId;

            return (
              <div key={listing.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col">
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{listing.cropType}</h3>
                    <span className={getStatusPill(listing.status)}>{listing.status}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{listing.project.name}, {listing.project.location}</p>
                  
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold text-gray-600 dark:text-gray-300">Quantity:</span> {listing.quantity} Tons</p>
                    <p><span className="font-semibold text-gray-600 dark:text-gray-300">Price:</span> ${listing.pricePerTon}/Ton</p>
                    <p><span className="font-semibold text-gray-600 dark:text-gray-300">Farmer:</span> {listing.farmer.name}</p>
                    <p><span className="font-semibold text-gray-600 dark:text-gray-300">Listed:</span> {new Date(listing.listingDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3 flex items-center gap-2">
                  <button 
                    onClick={() => handleContact(listing)}
                    disabled={listing.farmer.id === currentUser.id}
                    className="w-full text-sm bg-transparent hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold py-2 px-4 border border-green-500 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Contact
                  </button>
                   {role === 'seller' && (
                    <button 
                      onClick={() => handleBuy(listing)}
                      disabled={isBuyButtonDisabled}
                      className="w-full text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 border border-green-600 rounded transition duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                      {isBuyingId === listing.id ? 'Processing...' : listing.status === 'Sold' ? 'Sold' : 'Buy Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selectedFarmer && (
        <ContactFarmerModal 
            isOpen={isContactModalOpen} 
            onClose={() => setIsContactModalOpen(false)} 
            farmer={selectedFarmer} 
        />
      )}
      {currentUser && (
        <ListHarvestModal
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
          farmer={currentUser}
          onHarvestListed={handleHarvestListed}
        />
      )}
    </>
  );
};

export default Marketplace;