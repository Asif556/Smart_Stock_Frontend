import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package2, Plus, BarChart3, Home, Menu, X, Newspaper, Activity, Minus, LogOut, Calculator, Apple } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import VoiceAssistant from './VoiceAssistant';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home, active: true },
    { name: 'Dashboard', href: '/dashboard', icon: Activity, active: true },
    { name: 'Add Item', href: '/add-item', icon: Plus, active: true },
    { name: 'Retrieve Items', href: '/retrieve', icon: Minus, active: true },
    { name: 'Display Items', href: '/items', icon: Package2, active: true },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, active: true },
    { name: 'Financial Reports', href: '/financial', icon: Calculator, active: true },
    { name: 'Fruit Freshness', href: '/fruit-freshness', icon: Apple, active: true },
    { name: 'News', href: '/news', icon: Newspaper, active: true },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <header className="lg:hidden bg-gray-900 border-b border-gray-700 p-4 relative z-50">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-indigo-600 p-2 border border-indigo-500">
              <Package2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">SMART STOCK</span>
          </motion.div>
          <div className="flex items-center space-x-3">
            {currentUser && (
              <div className="text-white text-sm">
                Hello, {currentUser.displayName || currentUser.email}
              </div>
            )}
            <motion.button
              onClick={toggleMenu}
              className="bg-gray-800 border border-gray-600 p-3 text-white hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-gray-800 h-full w-80 border-r border-gray-700 pt-20 p-6"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <nav className="space-y-4">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  const isCurrentPage = location.pathname === item.href;
                  
                  return item.active ? (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 p-4 border border-gray-600 font-semibold text-lg transition-all hover:scale-105 ${
                          isCurrentPage
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={item.name}
                      className="flex items-center space-x-3 p-4 border border-gray-700 font-semibold text-lg text-gray-500 cursor-not-allowed"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Icon className="h-6 w-6" />
                      <span>{item.name}</span>
                      <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1">SOON</span>
                    </motion.div>
                  );
                })}
                
                {/* Logout Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: navigation.length * 0.1 }}
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-4 border border-red-600 font-semibold text-lg transition-all hover:scale-105 text-red-400 hover:bg-red-600/20 hover:text-red-300 w-full"
                  >
                    <LogOut className="h-6 w-6" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72 lg:bg-gray-900 lg:border-r lg:border-gray-700">
        <motion.div 
          className="flex h-16 items-center justify-center border-b border-gray-700 flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 border border-indigo-500">
              <Package2 className="h-8 w-8 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">SMART STOCK</span>
          </div>
        </motion.div>
        
        <div className="flex flex-col h-full">
          {/* User Info */}
          {currentUser && (
            <motion.div
              className="p-4 border-b border-gray-700 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-white">
                <div className="font-semibold text-sm">
                  {currentUser.displayName || 'User'}
                </div>
                <div className="text-gray-400 text-xs">
                  {currentUser.email}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Navigation - Scrollable */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isCurrentPage = location.pathname === item.href;
              
              return item.active ? (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 p-4 border border-gray-600 font-semibold text-lg transition-all hover:scale-105 ${
                      isCurrentPage
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key={item.name}
                  className="flex items-center space-x-3 p-4 border border-gray-700 font-semibold text-lg text-gray-500 cursor-not-allowed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Icon className="h-6 w-6" />
                  <span>{item.name}</span>
                  <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1">SOON</span>
                </motion.div>
              );
            })}
          </nav>
          
          {/* Logout Button - Fixed at bottom */}
          <div className="p-4 border-t border-gray-700 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: navigation.length * 0.1 }}
            >
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 border border-red-600 font-semibold text-sm transition-all hover:scale-105 text-red-400 hover:bg-red-600/20 hover:text-red-300 w-full"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </motion.div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72">
        <VoiceAssistant />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;