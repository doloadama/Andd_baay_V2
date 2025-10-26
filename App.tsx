import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FarmerManagement from './components/FarmerManagement';
import Marketplace from './components/Marketplace';
import ProjectsManagement from './components/ProjectsManagement';
import CropTracking from './components/CropTracking';
import InvestmentTracking from './components/InvestmentTracking';
import Chatbot from './components/Chatbot';
import { User, Project, Harvest, View, Role } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [marketListings, setMarketListings] = useState<Harvest[]>([]);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [activeRole, setActiveRole] = useState<Role>('farmer');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshDataKey, setRefreshDataKey] = useState(0);

  const triggerDataRefresh = () => setRefreshDataKey(prev => prev + 1);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const [allUsers, allListings] = await Promise.all([
            api.getUsers(),
            api.getMarketListings()
        ]);
        
        setUsers(allUsers);
        setMarketListings(allListings);

        // If a user is logged in, refresh their data from the new list
        if (user) {
          const updatedUser = allUsers.find(u => u.id === user.id);
          if (updatedUser) {
            setUser(updatedUser);
          } else {
            // User might have been deleted in a real scenario, so log out
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshDataKey]);
  
  useEffect(() => {
    if (user && user.projects.length > 0 && !activeProject) {
      setActiveProject(user.projects[0]);
    } else if (user && user.projects.length === 0) {
      setActiveProject(null);
    } else if (user && activeProject) {
        // Ensure active project is still valid after a data refresh
        const updatedActiveProject = user.projects.find(p => p.id === activeProject.id);
        setActiveProject(updatedActiveProject || (user.projects.length > 0 ? user.projects[0] : null));
    }
  }, [user, activeProject]);

  const handleLogin = (username: string) => {
    const foundUser = users.find(u => u.name.toLowerCase().replace(' ', '') === username.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      // Default to the first role, or 'farmer' if available
      const defaultRole = foundUser.roles.includes('farmer') ? 'farmer' : foundUser.roles[0];
      setActiveRole(defaultRole);
      setActiveView('dashboard');
    } else {
      alert('User not found!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveProject(null);
  };

  const switchRole = (role: Role) => {
    if (user?.roles.includes(role)) {
      setActiveRole(role);
      setActiveView('dashboard'); // Reset to dashboard on role switch
    }
  };
  
  const renderContent = () => {
    if (!user) return null;

    if (activeRole === 'farmer' && !activeProject && (activeView === 'dashboard' || activeView === 'crops' || activeView === 'investments')) {
        return (
             <div className="text-center p-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Welcome, {user.name}!</h2>
                <p className="text-gray-500 dark:text-gray-400">You don't have any projects yet. Please go to "My Projects" to create one.</p>
            </div>
        );
    }
    
    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={user} role={activeRole} activeProject={activeProject} refreshKey={refreshDataKey} />;
      case 'projects':
        return <ProjectsManagement user={user} onDataChange={triggerDataRefresh} />;
      case 'crops':
        return activeProject ? <CropTracking activeProject={activeProject} /> : null;
      case 'investments':
        return activeProject ? <InvestmentTracking activeProject={activeProject} /> : null;
      case 'market':
        return <Marketplace currentUser={user} role={activeRole} onDataChange={triggerDataRefresh} />;
      case 'farmers':
        return <FarmerManagement users={users.filter(u => u.roles.includes('farmer'))} />;
      default:
        return <Dashboard user={user} role={activeRole} activeProject={activeProject} refreshKey={refreshDataKey} />;
    }
  };

  if (isLoading && !user) { // Only show initial full-screen loading
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"><p>Loading application...</p></div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        activeRole={activeRole}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
            user={user}
            activeRole={activeRole}
            switchRole={switchRole}
            activeProject={activeProject}
            setActiveProject={setActiveProject}
        />
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
       {user && (
          <Chatbot 
            currentUser={user}
            allUsers={users}
            marketListings={marketListings}
          />
        )}
    </div>
  );
};

export default App;