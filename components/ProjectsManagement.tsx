import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface ProjectsManagementProps {
  user: User;
  onDataChange: () => void;
}

const ProjectsManagement: React.FC<ProjectsManagementProps> = ({ user, onDataChange }) => {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !location || !farmSize) {
      setError('All fields are required.');
      return;
    }
    if (Number(farmSize) <= 0) {
      setError('Farm size must be a positive number.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await api.addProject(user.id, {
        name: projectName,
        location,
        farmSize: Number(farmSize),
      });
      // Clear form
      setProjectName('');
      setLocation('');
      setFarmSize('');
      // Trigger global refresh
      onDataChange();
    } catch (apiError) {
      console.error(apiError);
      setError('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Project Name</label>
            <input 
              type="text" 
              placeholder="e.g., Tambacounda Farm" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Location</label>
            <input 
              type="text" 
              placeholder="e.g., Tambacounda, Senegal" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Farm Size (Acres)</label>
            <input 
              type="number" 
              placeholder="100"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              min="1"
              className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-green-500 focus:border-green-500" />
          </div>
          {error && <p className="text-sm text-red-500 md:col-span-3 -mb-2 mt-2">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="md:col-span-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mt-4 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Your Projects</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Farm Size (Acres)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Crops</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Investments</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {user.projects.map(proj => (
                <tr key={proj.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{proj.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{proj.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{proj.farmSize}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{proj.crops.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{proj.investments.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsManagement;