// Dashboard Home Page
import React, { useState } from 'react';
import { motion} from 'framer-motion';


const DashboardHome = () => {
  const stats = [
    { label: 'Total Cars', value: '24', change: '+3', changeType: 'positive' },
    { label: 'Active Bookings', value: '12', change: '+2', changeType: 'positive' },
    { label: 'Pending Requests', value: '5', change: '-1', changeType: 'negative' },
    { label: 'Total Revenue', value: '$8,240', change: '+12%', changeType: 'positive' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.label}</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold mr-2">{stat.value}</span>
              <span className={`text-sm ${
                stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className=" bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">BMW 7 Series</p>
                  <p className="text-sm text-gray-500">John Doe • Aug 12-15, 2023</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Cars Added</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" 
                  alt="Car" 
                  className="w-12 h-12 rounded-md object-cover mr-3"
                />
                <div>
                  <p className="font-medium">Audi Q7</p>
                  <p className="text-sm text-gray-500">Added 2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardHome