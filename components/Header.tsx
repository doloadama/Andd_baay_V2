import React from 'react';
import { User, Project, Role } from '../types';

interface HeaderProps {
  user: User;
  activeRole: Role;
  switchRole: (role: Role) => void;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
}

const mosaicImages = [
  'https://picsum.photos/400/300?image=1056', // Field
  'https://picsum.photos/400/300?image=1078', // Hands with soil
  'https://picsum.photos/400/300?image=995',  // Wheat
  'https://picsum.photos/400/300?image=835',  // Tractor
];

const Header: React.FC<HeaderProps> = ({ user, activeRole, switchRole, activeProject, setActiveProject }) => {
  return (
    <header className="relative bg-gray-800 text-white shadow-lg overflow-hidden">
      {/* Mosaic Background */}
      <div className="absolute inset-0 grid grid-cols-4 opacity-30">
        {mosaicImages.map((src, index) => (
          <div key={index} className="h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }}></div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Top Row: Welcome Message */}
        <div className="flex justify-end items-center mb-4">
          <div className="text-right">
            <span className="font-medium text-lg">Welcome, {user.name}</span>
            <p className="text-sm text-gray-300 capitalize">{activeRole} View</p>
          </div>
          <div className="w-12 h-12 ml-4 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl border-2 border-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Bottom Row: Controls */}
        <div className="flex items-center justify-between bg-black/20 backdrop-blur-sm p-3 rounded-lg">
          <div className="flex items-center">
            {user.roles.length > 1 && (
              <div className="flex items-center mr-6">
                <span className="text-sm font-medium mr-3 text-gray-300">Role:</span>
                {user.roles.map(role => (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`px-3 py-1 text-sm rounded-full capitalize transition-colors ${
                        activeRole === role ? 'bg-green-600 text-white font-semibold' : 'bg-gray-700/50 hover:bg-gray-600/50'
                    } mr-2`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
            {activeRole === 'farmer' && user.projects.length > 0 && (
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 text-gray-300">Project:</span>
                <select
                  value={activeProject?.id || ''}
                  onChange={(e) => setActiveProject(user.projects.find(p => p.id === e.target.value) || null)}
                  className="bg-gray-700/50 border border-gray-600 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2"
                >
                  {user.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;