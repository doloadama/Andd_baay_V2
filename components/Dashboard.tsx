import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
// FIX: Import `Role` type for consistency.
import { User, Project, YieldData, CropDistribution, Role } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Card: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

interface DashboardProps {
    user: User;
    // FIX: Use the shared `Role` type.
    role: Role;
    activeProject: Project | null;
    refreshKey: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user, role, activeProject, refreshKey }) => {
  // State for farmer-specific data
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [farmerCropDistribution, setFarmerCropDistribution] = useState<(CropDistribution & { [key: string]: any })[]>([]);

  // State for seller/global data
  const [yieldData, setYieldData] = useState<YieldData[]>([]);
  const [cropDistribution, setCropDistribution] = useState<(CropDistribution & { [key: string]: any })[]>([]);
  
  const [recommendation, setRecommendation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            if (role === 'farmer') {
                if (activeProject) {
                    const [harvests, weatherRes] = await Promise.all([
                        api.getMarketListings(),
                        api.getWeatherRecommendation(activeProject.location)
                    ]);
    
                    const projectSoldHarvests = harvests.filter(h => h.project.id === activeProject.id && h.status === 'Sold');
                    const revenue = projectSoldHarvests.reduce((acc, h) => acc + (h.quantity * h.pricePerTon), 0);
                    setTotalRevenue(revenue);
    
                    const investmentCost = activeProject.investments.reduce((acc, i) => acc + i.amount, 0);
                    setTotalInvestment(investmentCost);
    
                    const cropDist: { [key: string]: number } = {};
                    activeProject.crops.forEach(crop => {
                        cropDist[crop.type] = (cropDist[crop.type] || 0) + crop.expectedYield;
                    });
                    setFarmerCropDistribution(Object.entries(cropDist).map(([name, value]) => ({ name, value })));
    
                    setRecommendation(weatherRes);
                } else {
                  setTotalRevenue(0);
                  setTotalInvestment(0);
                  setFarmerCropDistribution([]);
                  setRecommendation("Please create or select a project to see recommendations.");
                }

            } else { // seller role
                const [yieldRes, cropRes, weatherRes] = await Promise.all([
                    api.getYieldAnalytics(),
                    api.getCropDistribution(),
                    api.getWeatherRecommendation('Senegal') // Generic location
                ]);
                setYieldData(yieldRes);
                setCropDistribution(cropRes);
                setRecommendation(weatherRes);
            }
        } catch (error) {
            console.error(`Failed to fetch ${role} dashboard data:`, error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [user, role, activeProject, refreshKey]);

  const netProfit = useMemo(() => totalRevenue - totalInvestment, [totalRevenue, totalInvestment]);
  
  if (loading) return <div className="text-center text-gray-600 dark:text-gray-300">Loading dashboard...</div>;

  if (role === 'farmer') {
      if (!activeProject) {
          return <div className="text-center text-gray-500 dark:text-gray-400">Please select a project from the header to view its dashboard.</div>
      }
      return (
          <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Project Dashboard: <span className="text-green-600">{activeProject.name}</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card title="Total Revenue (Sold)" value={`$${totalRevenue.toLocaleString()}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>} color="bg-green-500" />
                  <Card title="Total Investment" value={`$${totalInvestment.toLocaleString()}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>} color="bg-yellow-500" />
                  <Card title="Net Profit" value={`$${netProfit.toLocaleString()}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>} color={netProfit >= 0 ? "bg-blue-500" : "bg-red-500"} />
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Weather-Based Recommendation for {activeProject.location}</h3>
                <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 p-4 rounded-r-lg" role="alert">
                    <p className="font-bold">Today's Insight</p>
                    <p>{recommendation}</p>
                </div>
              </div>
               <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Crop Distribution by Expected Yield (Tons)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={farmerCropDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={({ name, percent }) => `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`}>
                        {farmerCropDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
          </div>
      );
  }

  return ( // Seller Dashboard
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Farmers" value="3" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.284-.24-1.887M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.084-1.284.24-1.887m10.42-3.125a3 3 0 11-5.356 0M7.24 14.875a3 3 0 10-5.356 0m10.42 0a3 3 0 11-5.356 0M7.24 14.875a3 3 0 10-5.356 0" /></svg>} color="bg-blue-500" />
        <Card title="Total Yield (2023)" value="410 Tons" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>} color="bg-green-500" />
        <Card title="Crops in Market" value="4" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} color="bg-yellow-500" />
        <Card title="Avg. Farm Size" value="133 Acres" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>} color="bg-indigo-500" />
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Weather-Based Recommendation</h3>
        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 p-4 rounded-r-lg" role="alert">
          <p className="font-bold">Today's Insight</p>
          <p>{recommendation}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Annual Yield Statistics (Tons)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}/>
              <Legend />
              <Bar dataKey="yield" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cropDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
              >
                {cropDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;