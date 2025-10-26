
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/1600/900?image=1056')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg max-w-md w-full text-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Andd Baay</h1>
          <p className="text-gray-200 mt-2">Empowering Farmers, Together.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., adamagueye"
              className="w-full px-4 py-2 bg-white/20 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300"
            />
             <p className="text-xs text-gray-400 mt-2">Hint: Try 'adamagueye', 'fatoudiop', or 'moussasow'.</p>
          </div>
          <div className="mb-6">
            <label htmlFor="password" aria-label="Password" className="block text-sm font-medium mb-2 text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              defaultValue="password123" // Dummy password for demo
              className="w-full px-4 py-2 bg-white/20 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
