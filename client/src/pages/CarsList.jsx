import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
  FaStar,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'

const CarsList = () => {
   const {setFooter , loading, setLoading}  = useAuth();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fuelType: 'all',
    priceRange: 'all',
    transmission: 'all',
    sortBy: 'featured'
  });

      useEffect(()=>{
        setFooter(true);
        //scroll to top
        window.scrollTo(0, 0);
      },[]);


  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('/api/product/all-cars-public', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
         setLoading(false);
       if (response?.data?.success) {
         setCars(response?.data?.cars);
         setFilteredCars(response?.data?.cars);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError(error.message || 'Failed to fetch cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...cars];

    // Filter by fuel type
    if (filters.fuelType !== 'all') {
      result = result.filter(car => car.fuelType === filters.fuelType);
    }

    // Filter by price range
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(car => car.pricePerDay >= min && car.pricePerDay <= max);
    }

    // Filter by transmission
    if (filters.transmission !== 'all') {
      result = result.filter(car => car.transmission === filters.transmission);
    }

    // Sort results
    if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (filters.sortBy === 'year') {
      result.sort((a, b) => b.year - a.year);
    }

    setFilteredCars(result);
  }, [filters, cars]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    //if loader is true then show loader
    <>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Fleet</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our premium selection of luxury and economy vehicles
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-center mb-4">
            <FaFilter className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
              >
                <option value="all">All Fuels</option>
                <option value="petrol">Petrol</option>
                <option value="gasoline">Gasoline</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="0-100">Under $100</option>
                <option value="100-150">$100 - $150</option>
                <option value="150-200">$150 - $200</option>
                <option value="200-1000">$200+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
              >
                <option value="all">All Transmissions</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year">Year: Newest First</option>
              </select>
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading cars...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        )}

        {/* Cars Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCars?.map((car, index) => (
            <ProductCard key={car.id} car={car} index={index} />
          ))}
        </motion.div>

        {filteredCars.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FaSearch className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No cars match your filters</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </motion.div>
        )}
      </div>
    </div>
  </>

  );
};


export default CarsList