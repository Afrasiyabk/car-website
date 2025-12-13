import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTachometerAlt, 
  FaPlus, 
  FaCar, 
  FaCalendarAlt,
  FaSignOutAlt,
  FaTimes,
  FaBars
} from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';

// Dashboard Layout Component
const DashboardLayout = ({ children, activePage, setActivePage }) => {
  const { setFooter, logout , user} = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'add-car', label: 'Add Car', icon: <FaPlus /> },
    { id: 'manage-cars', label: 'Manage Cars', icon: <FaCar /> },
    { id: 'manage-bookings', label: 'Manage Bookings', icon: <FaCalendarAlt /> },
  ];

  useEffect(() => {
    setFooter(false);
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // On desktop, keep sidebar open by default
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setFooter]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = (itemId) => {
    setActivePage(itemId);
    // On mobile, close sidebar after clicking a menu item
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-row bg-gray-100 pt-1 h-[90vh] overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : (isMobile ? -300 : 0)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed to-0% left-0 lg:relative  bg-gray-900 text-white w-64 z-40 shadow-lg"
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Luxury Wheels</h1>
            <p className="text-gray-400 text-sm">Admin Dashboard</p>
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <FaTimes size={20} />
            </button>
          )}
        </div>
        
        <nav className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activePage === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button 
            className="flex items-center text-gray-300 hover:text-white w-full p-3 cursor-pointer rounded-lg hover:bg-gray-800"
            onClick={logout}
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1  transition-all duration-300  overflow-hidden overflow-y-auto p-2 }`}>
        <div className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 lg:hidden"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="nosifer text-gray-700 hidden sm:block capitalize">{user?.name}</span>
            <div className="nosifer w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              {user?.name.charAt(0)}
            </div>
          </div>
        </div>
        
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;