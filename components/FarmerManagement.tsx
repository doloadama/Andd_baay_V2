
import React, { useState } from 'react';
import { User } from '../types';
import ContactFarmerModal from './ContactFarmerModal';

interface FarmerManagementProps {
  users: User[];
}

const FarmerManagement: React.FC<FarmerManagementProps> = ({ users }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<User | null>(null);

  const handleContactClick = (farmer: User) => {
    setSelectedFarmer(farmer);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Farmer Directory</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Primary Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Number of Projects</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.projects[0]?.location || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.projects.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleContactClick(user)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
                    >
                      Contact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedFarmer && (
        <ContactFarmerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          farmer={selectedFarmer}
        />
      )}
    </>
  );
};

export default FarmerManagement;
