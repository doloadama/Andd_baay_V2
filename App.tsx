import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FarmerManagement from './components/FarmerManagement';
import CropTracking from './components/CropTracking';
import Marketplace from './components/Marketplace';
import InvestmentTracking from './components/InvestmentTracking';
import ProjectsManagement from './components/ProjectsManagement';
import { User, Project } from './types';
import { MOCK_USERS } from './services/api';

export type View = 'dashboard' | 'farmers' | 'crops' | 'market' | 'investments' | 'projects';
export type Role = 'farmer' | 'seller';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [activeRole, setActiveRole] = useState<Role>('farmer');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const handleLogin = useCallback((username: string) => {
    const user = MOCK_USERS.find(f => f.name.toLowerCase().replace(' ', '') === username.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      const initialRole = user.roles.includes('farmer') ? 'farmer' : user.roles[0];
      setActiveRole(initialRole);
      if (initialRole === 'farmer' && user.projects.length > 0) {
        setActiveProject(user.projects[0]);
      }
    } else {
      const defaultUser = MOCK_USERS[0];
      setCurrentUser(defaultUser);
      setIsAuthenticated(true);
      const initialRole = defaultUser.roles.includes('farmer') ? 'farmer' : defaultUser.roles[0];
      setActiveRole(initialRole);
       if (initialRole === 'farmer' && defaultUser.projects.length > 0) {
        setActiveProject(defaultUser.projects[0]);
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveView('dashboard');
    setActiveRole('farmer');
    setActiveProject(null);
  }, []);
  
  // When role changes, reset project if new role is not farmer
  useEffect(() => {
    if (activeRole === 'seller') {
      setActiveProject(null);
    } else if (currentUser && currentUser.projects.length > 0) {
      setActiveProject(currentUser.projects[0]);
    }
  }, [activeRole, currentUser]);

  const renderContent = useMemo(() => {
    if (!currentUser) return <div>Loading...</div>;

    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={currentUser} role={activeRole} activeProject={activeProject} />;
      case 'farmers':
        return activeRole === 'seller' ? <FarmerManagement /> : <div className="text-red-500">Access denied for this role.</div>;
      case 'crops':
        return activeRole === 'farmer' && activeProject ? <CropTracking activeProject={activeProject} /> : <div className="text-gray-500">{activeRole === 'farmer' ? 'Please select a project to view crops.' : 'Access denied for this role.'}</div>;
      case 'investments':
        return activeRole === 'farmer' && activeProject ? <InvestmentTracking activeProject={activeProject} /> : <div className="text-gray-500">{activeRole === 'farmer' ? 'Please select a project to view investments.' : 'Access denied for this role.'}</div>;
      case 'projects':
        return activeRole === 'farmer' ? <ProjectsManagement user={currentUser} /> : <div className="text-red-500">Access denied for this role.</div>;
      case 'market':
        return <Marketplace />;
      default:
        return <Dashboard user={currentUser} role={activeRole} activeProject={activeProject}/>;
    }
  }, [activeView, currentUser, activeRole, activeProject]);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} activeRole={activeRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white capitalize">{activeView === 'farmers' ? 'Farmer Directory' : activeView}</h1>
          <div className="flex items-center space-x-4">
            {activeRole === 'farmer' && currentUser.projects.length > 0 && (
               <div className="relative">
                <select 
                  value={activeProject?.id || ''}
                  onChange={(e) => {
                    const project = currentUser.projects.find(p => p.id === e.target.value);
                    setActiveProject(project || null);
                  }}
                  className="appearance-none bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500"
                  aria-label="Switch active project"
                >
                  {currentUser.projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            )}

            {currentUser.roles.length > 1 && (
              <div className="relative">
                <select 
                  value={activeRole}
                  onChange={(e) => {
                    setActiveRole(e.target.value as Role);
                    setActiveView('dashboard'); // Reset to dashboard on role change
                  }}
                  className="appearance-none bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500"
                  aria-label="Switch user role"
                >
                  {currentUser.roles.map(role => (
                    <option key={role} value={role} className="capitalize">{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            )}
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
