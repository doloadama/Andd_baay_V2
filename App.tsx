
import React, { useState, useCallback, useMemo } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FarmerManagement from './components/FarmerManagement';
import CropTracking from './components/CropTracking';
import Marketplace from './components/Marketplace';
import { Farmer } from './types';
import { MOCK_FARMERS } from './services/api';

type View = 'dashboard' | 'farmers' | 'crops' | 'market';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Farmer | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');

  const handleLogin = useCallback((username: string) => {
    // In a real app, you'd fetch user data after JWT validation.
    // Here we simulate finding the user from mock data.
    const user = MOCK_FARMERS.find(f => f.name.toLowerCase().replace(' ', '') === username.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      // For demo purposes, log in with the first farmer if user not found
      setCurrentUser(MOCK_FARMERS[0]);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveView('dashboard');
  }, []);

  const renderContent = useMemo(() => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'farmers':
        return <FarmerManagement />;
      case 'crops':
        return currentUser ? <CropTracking farmer={currentUser} /> : <div>Please select a farmer.</div>;
      case 'market':
        return <Marketplace />;
      default:
        return <Dashboard />;
    }
  }, [activeView, currentUser]);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white capitalize">{activeView}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-300">Welcome, {currentUser.name}</span>
            <img className="w-10 h-10 rounded-full" src={`https://i.pravatar.cc/150?u=${currentUser.id}`} alt="User avatar" />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-6">
          {renderContent}
        </main>
      </div>
    </div>
  );
};

export default App;
