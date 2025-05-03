import React from 'react';
import { Battery, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Battery className="w-6 h-6 text-green-400" />
            <span className="text-lg font-semibold">E-Bike Battery Optimizer</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 items-center text-sm text-gray-300">
            <a 
              href="#" 
              className="hover:text-green-400 transition-colors mb-2 md:mb-0"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="hover:text-green-400 transition-colors mb-2 md:mb-0"
            >
              Terms of Service
            </a>
            <a 
              href="https://github.com" 
              className="flex items-center space-x-1 hover:text-green-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} E-Bike Battery Optimizer. All rights reserved.</p>
          <p className="mt-1">Using NASA Battery Dataset for optimization algorithms.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;