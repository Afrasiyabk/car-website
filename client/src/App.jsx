import React, { useEffect, useState } from 'react'
import './App.css'
//import route and Routes
import { Navigate, Route, Routes } from 'react-router-dom'
//import Home
import Home from './pages/Home.jsx'
//import Navbar
import Navbar from './components/Navbar.jsx';
//import CarsList
import CarsList from './pages/CarsList.jsx';
// import bookmark list
import BookmarkList from './pages/Bookmark.jsx';
// product details
import ProductDetails from './pages/ProductDetails.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Footer from './components/Footer.jsx';
import Dashboard from './pages/DashPages/Dashboard.jsx'
import { ToastContainer } from 'react-toastify';
import { useAuth } from './context/AuthContext';
import {FaSpinner } from 'react-icons/fa';

const App = () => {
 const {setFooter , footer , loading, setLoading}  = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
     useEffect(()=>{
      setFooter(true);
      window.scrollTo(0, 0);
     },[])

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cars-list' element={<CarsList />} />
         <Route path='product-details/:id' element={<ProductDetails />} />
        <Route path='/bookmarks' element={<BookmarkList />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
         <Route 
            path="/dashboard/*" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
      </Routes>
      { footer && <Footer /> }
    </div>
  )
}

export default App
