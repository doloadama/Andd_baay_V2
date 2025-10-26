import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface ListHarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: User;
  onHarvestListed: () => void;
}

const ListHarvestModal: React.FC<ListHarvestModalProps> = ({ isOpen, onClose, farmer, onHarvestListed }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedCropId, setSelectedCropId] = useState<string>('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && farmer.projects.length > 0) {
      setSelectedProjectId(farmer.projects[0].id);
    }
    if (!isOpen) {
      setSelectedProjectId('');
      setSelectedCropId('');
      setQuantity('');
      setPrice('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen, farmer.projects]);

  const availableCrops = useMemo(() => {
    if (!selectedProjectId) return [];
    const project = farmer.projects.find(p => p.id === selectedProjectId);
    return project ? project.crops.filter(c => c.status === 'Harvested') : [];
  }, [selectedProjectId, farmer.projects]);
  
  useEffect(() => {
    if (availableCrops.length > 0) {
      setSelectedCropId(availableCrops[0].id);
    } else {
      setSelectedCropId('');
    }
  }, [availableCrops]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedProjectId || !selectedCropId || !quantity || !price) {
      setError('Please fill out all fields.');
      return;
    }
    
    if (Number(quantity) <= 0 || Number(price) <= 0) {
        setError('Quantity and Price must be positive numbers.');
        return;
    }

    setIsLoading(true);

    const project = farmer.projects.find(p => p.id === selectedProjectId);
    const crop = project?.crops.find(c => c.id === selectedCropId);

    if (!project || !crop) {
      setError('Selected project or crop not found.');
      setIsLoading(false);
      return;
    }
    
    try {
      await api.addHarvest({
        farmer: { id: farmer.id, name: farmer.name, contact: farmer.contact },
        project: { id: project.id, name: project.name, location: project.location },
        cropType: crop.type,
        quantity: Number(quantity),
        pricePerTon: Number(price),
      });
      onHarvestListed();
      onClose();
    } catch (apiError) {
      setError('Failed to list harvest. Please try again.');
      console.error(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <svg xmlns="http://www.w.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">List a New Harvest</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-md">{error}</p>}
          
          {farmer.projects.length === 0 ? (
            <div className="text-sm text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 p-3 rounded-md">
                You must create a project before you can list a harvest.
            </div>
           ) : availableCrops.length === 0 && selectedProjectId ? (
             <div className="text-sm text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 p-3 rounded-md">
                There are no harvested crops available to list in this project.
            </div>
           ) : null}

          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Project</label>
            <select
              id="project"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={farmer.projects.length === 0}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-200 dark:disabled:bg-gray-700"
            >
              {farmer.projects.length > 0 ? (
                farmer.projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.location})</option>)
              ) : (
                <option disabled>No projects available</option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Harvested Crop</label>
            <select
              id="cropType"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              disabled={availableCrops.length === 0}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-200 dark:disabled:bg-gray-700"
            >
              {availableCrops.length > 0 ? (
                availableCrops.map(c => <option key={c.id} value={c.id}>{c.type}</option>)
              ) : (
                <option disabled>No harvested crops in this project</option>
              )}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity (Tons)</label>
              <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="100" min="0.01" step="0.01" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price per Ton ($)</label>
              <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} placeholder="350" min="0.01" step="0.01" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" disabled={farmer.projects.length === 0 || availableCrops.length === 0 || isLoading} className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed">
              {isLoading ? 'Listing...' : 'List Item on Marketplace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListHarvestModal;