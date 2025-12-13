import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaGasPump, 
  FaCog, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaCheckCircle,
  FaTachometerAlt,
  FaCar,
  FaShieldAlt,
  FaTools,
  FaSnowflake,
  FaMusic,
  FaWifi,
  FaCamera
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';


const CarDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
   const {setFooter}  = useAuth();

       useEffect(()=>{
       setFooter(true);
       window.scrollTo(0,0);
       },[])

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/product/car-details/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        if (data.success && data.product) {
          const fetchedCar = {
            ...data.product,
            images: data.product.images ? data.product.images.map(img => img.url) : [],
            specifications: {
              year: data.product.year,
              fuelType: data.product.fuelType,
              transmission: data.product.transmission,
              seats: `${data.product.seats} seats`,
              price: `${data.product.currency || 'USD'} ${data.product.pricePerDay}/day`,
              location: data.product.location,
            },
            comfortFeatures: data.product.features || [],
            technologyFeatures: data.product.features || [],
            safetyFeatures: data.product.features || [],
          };
          setCar(fetchedCar);
          setSelectedImage(0);
        } else {
          setError('Car not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleCheckAvailability = () => {
    // In a real app, this would call an API to check availability
    if (pickupDate && returnDate) {
      // Mock availability check
      const available = Math.random() > 0.3; // 70% chance of being available
      setIsAvailable(available);
      setAvailabilityChecked(true);
      // Reset after 5 seconds
      setTimeout(() => {
        setAvailabilityChecked(false);
      }, 5000);
    }
  };

  const calculateTotal = () => {
    if (pickupDate && returnDate && car) {
      const pickup = new Date(pickupDate);
      const returnD = new Date(returnDate);
      const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
      return days * car.pricePerDay;
    }
    return 0;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 flex justify-center items-center"
      >
           <FaSpinner className="animate-spin text-7xl text-blue-600 mr-2" />
      </motion.div>
    );
  }

  if (error || !car) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 flex justify-center items-center"
      >
        <div className="text-xl text-red-500">{error || 'Car not found'}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back to Cars
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden shadow-lg mb-4"
            >
              <div className="relative w-full h-96">
                {!mainImageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
                )}
                <img
                  src={car?.images[selectedImage]}
                  alt={car?.title}
                  className="w-full h-96 object-cover"
                  onLoad={() => setMainImageLoaded(true)}
                  onError={() => setMainImageLoaded(true)}
                />
              </div>
            </motion.div>

            {/* add here skeleton */} 
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-4 gap-2"
            >
              {car?.images?.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden transition-all ${
                    selectedImage === index ? 'ring-2 ring-blue-500 ring-offset-2' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.title} ${index + 1}`}
                    className="w-full h-20 object-cover"
                    loading="lazy"
                  />
                </motion.button>
              ))}
            </motion.div> */}
            <div className="relative grid grid-cols-4 gap-2">
              
              {!mainImageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg grid grid-cols-4 gap-2 p-1">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="w-full h-20 bg-gray-300 rounded-lg" />
                  ))}
                </div>
              )}
           
              {car?.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden transition-all ${
                    selectedImage === index ? 'ring-2 ring-blue-500 ring-offset-2' : 'opacity-70 hover:opacity-100 ring-1 ring-blue-300 ring-offset-2'
                  } cursor-pointer`}
                >
                  <img
                    src={image}
                    alt={`${car?.title} ${index + 1}`}
                    className="w-full h-20 object-cover"
                    loading="lazy"
                    onload={() => setMainImageLoaded(true)}
                    onError={() => setMainImageLoaded(true)}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{car?.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="mr-2" />
                <span>{car?.location}</span>
              </div>

              <p className="text-gray-700 mb-6">{car?.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <FaGasPump className="text-blue-500 mr-3 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-medium">{car.fuelType}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCog className="text-blue-500 mr-3 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">Transmission</p>
                    <p className="font-medium">{car.transmission}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaUsers className="text-blue-500 mr-3 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">Seats</p>
                    <p className="font-medium">{car.seats} People</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-3 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium">{car.year}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">${car.pricePerDay} <span className="text-sm font-normal text-gray-600">/day ({car.currency})</span></p>
                </div>
              </div>
            </motion.div>

            {/* Tabs for additional information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <div className="flex border-b border-gray-200 mb-4">
                {['Overview', 'Specifications', 'Features', 'Safety'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-2 font-medium ${
                      activeTab === tab.toLowerCase()
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="pt-2"
                >
                  {activeTab === 'overview' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {car.features.map((feature, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                          >
                            {feature}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'specifications' && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {Object.entries(car.specifications).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          variants={itemVariants}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <FaTachometerAlt className="text-blue-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="font-medium">{value}</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'features' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <FaSnowflake className="text-blue-500 mr-2" />
                          Features
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {car.features.map((feature, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center text-sm"
                            >
                              <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'safety' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {car.features.filter(f => f.toLowerCase().includes('safety') || f.toLowerCase().includes('assist')).map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <FaShieldAlt className="text-blue-500 mr-3" />
                          <span className="text-sm">{feature}</span>
                        </motion.div>
                      ))}
                      {car.features.filter(f => !f.toLowerCase().includes('safety') && !f.toLowerCase().includes('assist')).length === 0 && (
                        <p>No specific safety features listed.</p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Availability Check */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Check Availability</h2>
              
              <AnimatePresence>
                {availabilityChecked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mb-4 p-3 rounded-lg ${
                      isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <FaCheckCircle className="mr-2" />
                      <span>
                        {isAvailable 
                          ? `This car is available for your selected dates! Total: $${calculateTotal()}`
                          : 'Sorry, this car is not available for your selected dates. Please try different dates.'
                        }
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckAvailability}
                disabled={!pickupDate || !returnDate}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  !pickupDate || !returnDate
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Check Availability
              </motion.button>

              {pickupDate && returnDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-gray-100 rounded-lg"
                >
                  <div className="flex justify-between">
                    <span>Estimated Total:</span>
                    <span className="font-semibold">${calculateTotal()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))} days × ${car.pricePerDay}/day
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarDetail;
