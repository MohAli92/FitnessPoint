import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  CalculatorIcon,
  FireIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">FitnessPoint</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/') ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Home
              </Link>
              <Link
                to="/calculator"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/calculator') ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <CalculatorIcon className="w-5 h-5 mr-2" />
                Calorie Calculator
              </Link>
              <Link
                to="/fitness"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/fitness') ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FireIcon className="w-5 h-5 mr-2" />
                Fitness Tips
              </Link>
              <Link
                to="/profile"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/profile') ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserIcon className="w-5 h-5 mr-2" />
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-4 hidden sm:block">{user?.username}</span>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
