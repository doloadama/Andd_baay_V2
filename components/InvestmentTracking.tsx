import React, { useState, useEffect } from 'react';
import { Project, Investment } from '../types';

interface InvestmentTrackingProps {
  activeProject: Project;
}

const InvestmentTracking: React.FC<InvestmentTrackingProps> = ({ activeProject }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    // Data is now passed via props.
    setInvestments(activeProject.investments);
  }, [activeProject]);
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Add New Investment for <span className="text-green-500">{activeProject.name}</span></h2>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Type</label>
            <select className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
              <option>Seeds</option>
              <option>Fertilizer</option>
              <option>Equipment</option>
              <option>Labor</option>
              <option>Other</option>
            </select>
          </div>
           <div className="flex flex-col">
             <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Description</label>
            <input type="text" placeholder="e.g., Hybrid Seeds" className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
          </div>
           <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Amount ($)</label>
            <input type="number" placeholder="500" className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
          </div>
          <div className="flex flex-col">
             <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Date</label>
            <input type="date" placeholder="Date" className="p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
          </div>
          <button type="submit" className="md:col-span-2 lg:col-span-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mt-4">
            Add Investment
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Investment Log for <span className="text-green-500">{activeProject.name}</span></h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {investments.map(inv => (
                <tr key={inv.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{inv.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{inv.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(inv.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestmentTracking;
