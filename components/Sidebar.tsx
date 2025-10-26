import React from 'react';
import { View, Role } from '../App';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
  activeRole: Role;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-3 my-1 w-full text-left rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-green-600 text-white shadow-md'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="mx-4 font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout, activeRole }) => {
  const iconClass = "w-6 h-6";

  const farmerNav = (
    <>
      <NavItem
        label="Dashboard"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
        isActive={activeView === 'dashboard'}
        onClick={() => setActiveView('dashboard')}
      />
      <NavItem
        label="My Projects"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
        isActive={activeView === 'projects'}
        onClick={() => setActiveView('projects')}
      />
      <NavItem
        label="Crop Tracking"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>}
        isActive={activeView === 'crops'}
        onClick={() => setActiveView('crops')}
      />
       <NavItem
          label="Investment Tracking"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
          isActive={activeView === 'investments'}
          onClick={() => setActiveView('investments')}
      />
      <NavItem
        label="Marketplace"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        isActive={activeView === 'market'}
        onClick={() => setActiveView('market')}
      />
    </>
  );

  const sellerNav = (
     <>
      <NavItem
        label="Dashboard"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
        isActive={activeView === 'dashboard'}
        onClick={() => setActiveView('dashboard')}
      />
      <NavItem
        label="Farmer Directory"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.284-.24-1.887M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.084-1.284.24-1.887m10.42-3.125a3 3 0 11-5.356 0M7.24 14.875a3 3 0 10-5.356 0m10.42 0a3 3 0 11-5.356 0M7.24 14.875a3 3 0 10-5.356 0" /></svg>}
        isActive={activeView === 'farmers'}
        onClick={() => setActiveView('farmers')}
      />
      <NavItem
        label="Marketplace"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        isActive={activeView === 'market'}
        onClick={() => setActiveView('market')}
      />
    </>
  );

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-900 shadow-xl">
      <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
        <h1 className="text-3xl font-bold text-green-600">Andd Baay</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        {activeRole === 'farmer' ? farmerNav : sellerNav}
      </nav>
      <div className="px-4 py-4 border-t dark:border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center p-3 w-full text-left rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-800/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="mx-4 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
