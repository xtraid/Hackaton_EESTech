import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Battery, Map, Home, Activity, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/route-analysis', label: 'Route Analysis', icon: <Map className="w-5 h-5" /> },
    { path: '/battery-optimizer', label: 'Battery Optimizer', icon: <Battery className="w-5 h-5" /> },
    { path: '/real-time', label: 'Real-Time', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Battery className="w-8 h-8 text-green-500" />
            <span className="font-bold text-xl text-gray-800 dark:text-white">E-Bike Optimizer</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 ${
                  isActive(item.path) 
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 font-medium' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;