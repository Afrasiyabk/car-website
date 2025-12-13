import React, { useEffect, useState } from 'react';
import {AnimatePresence } from 'framer-motion';
import DashboardHome from '../../components/DashComponents/DashboardHome'
import AddCar from '../../components/DashComponents/Addcar'
import ManageCars from '../../components/DashComponents/Managecar'
import ManageBookings from '../../components/DashComponents/ManageBooking'
import DashboardLayout from '../../components/DashComponents/DashboardLayout'
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
   const {setFooter}  = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  
  useEffect(()=>{
    setFooter(false)
  },[])
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'add-car':
        return <AddCar />;
      case 'manage-cars':
        return <ManageCars />;
      case 'manage-bookings':
        return <ManageBookings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout activePage={activePage} setActivePage={setActivePage}>
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;