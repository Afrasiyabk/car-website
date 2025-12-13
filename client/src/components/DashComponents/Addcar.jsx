import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaUpload, FaTrash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddCar = () => {
  const [formData, setFormData] = useState({
    title: '',
    make: '',
    model: '',
    year: '',
    description: '',
    pricePerDay: '',
    transmission: 'automatic',
    seats: '',
    features: [],
    fuelType: 'petrol', // Changed to match backend enum
    currency: 'USD',
    location: ''
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [currentFeature, setCurrentFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Define MAX_FILE_SIZE constant
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFeatureAdd = () => {
    if (currentFeature.trim() && !formData.features.includes(currentFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, currentFeature.trim()]
      });
      setCurrentFeature('');
    }
  };

  const handleFeatureRemove = (featureToRemove) => {
    setFormData({
      ...formData,
      features: formData.features.filter(feature => feature !== featureToRemove)
    });
  };

  const handleFeatureKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFeatureAdd();
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    
    if (imagePreviews.length + files.length > 4) {
      toast.error('You can only upload up to 4 images');
      return;
    }

    const newImagePreviews = [];
    const oversizedFiles = [];
    const invalidFiles = [];
    
    files.forEach((file, index) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(file.name);
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + index,
          url: e.target.result,
          file: file
        };
        newImagePreviews.push(newImage);
        
        // When all valid files are processed
        if (newImagePreviews.length === (files.length - oversizedFiles.length - invalidFiles.length)) {
          setImagePreviews(prev => [...prev, ...newImagePreviews]);
        }
      };
      
      reader.onerror = () => {
        toast.error(`Failed to read file: ${file.name}`);
      };
      
      reader.readAsDataURL(file);
    });
    
    // Show error messages
    if (oversizedFiles.length > 0) {
      toast.error(`The following files exceed 10MB: ${oversizedFiles.join(', ')}`);
    }
    if (invalidFiles.length > 0) {
      toast.error(`The following files are not images: ${invalidFiles.join(', ')}`);
    }
    
    // Reset file input to allow uploading same files again
    e.target.value = '';
  };

  const handleImageRemove = (id) => {
    setImagePreviews(prev => prev.filter(image => image.id !== id));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (imagePreviews.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (formData.description.length > 300) {
      toast.error('Maximum 300 characters are allowd');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData object
      const submitData = new FormData();
      
      // Append all form fields
      submitData.append("title", formData.title);
      submitData.append("make", formData.make);
      submitData.append("model", formData.model);
      submitData.append("description", formData.description);
      submitData.append("year", formData.year.toString());
      submitData.append("fuelType", formData.fuelType);
      submitData.append("location", formData.location);
      submitData.append("transmission", formData.transmission);
      submitData.append("currency", formData.currency);
      submitData.append("pricePerDay", formData.pricePerDay.toString());
      submitData.append("seats", formData.seats.toString());
      
      // Append features as JSON string
      submitData.append("features", JSON.stringify(formData.features));
      
      // Append each image file
      imagePreviews.forEach((image, index) => {
        submitData.append("images", image.file, `car-image-${index}.jpg`);
      });

      // Log FormData contents for debugging
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/product/create-car`, 
        submitData, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message || 'Car added successfully!');
        
        // Reset form
        setFormData({
          title: '',
          make: '',
          model: '',
          year: '',
          pricePerDay: '',
          transmission: 'automatic',
          seats: '',
          description: '',
          features: [],
          fuelType: 'petrol',
          currency: 'USD',
          location: ''
        });
        setImagePreviews([]);
        setCurrentFeature('');
        
      } else {
        toast.error(response?.data?.message || 'Failed to add car');
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'An error occurred while adding the car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 sm:p-6"
    >
      
      <motion.form 
        onSubmit={handleSubmit} 
        className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Car Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="e.g., BMW 7 Series Luxury Sedan"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Make (Brand) *</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="e.g., BMW, Audi, Toyota"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="e.g., 7 Series, Q7, Camry"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1990"
              max={new Date().getFullYear() + 1}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full p-3 border  ${formData.description.length > 300 ? 'border-red-500  focus:ring-red-500 focus:border-red-500' : 'border-gray-300  focus:ring-blue-500 focus:border-blue-500'}  rounded-lg focus:ring-2 transition-colors`}
              placeholder="Enter car description"
            />
            <small className={`flex justify-end ${formData.description.length > 300 ? 'text-red-500' : 'text-black'}`}>{formData.description.length}/300</small>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day ($) *</label>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              min="1"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Seats *</label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="e.g., New York, NY"
            />
          </div>
        </div>

        {/* Features Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              onKeyPress={handleFeatureKeyPress}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter a feature (e.g., Sunroof)"
            />
            <button
              type="button"
              onClick={handleFeatureAdd}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors flex items-center justify-center sm:justify-start disabled:bg-gray-400"
            >
              <FaPlus className="mr-1" /> Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <AnimatePresence>
              {formData.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleFeatureRemove(feature)}
                    disabled={loading}
                    className="ml-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                  >
                    <FaTimes />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Images (Max 4) *
            <span className="text-sm text-gray-500 ml-2">Supported: JPG, PNG, WEBP. Max 10MB per image</span>
          </label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
          />
          
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={imagePreviews.length >= 4 || loading}
            className={`w-full p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
              imagePreviews.length >= 4 || loading
                ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                : 'border-blue-300 text-blue-500 hover:border-blue-500 hover:text-blue-700'
            }`}
          >
            <FaUpload className="text-2xl mb-2" />
            <span>Click to upload images</span>
            <span className="text-sm text-gray-500 mt-1">
              {imagePreviews.length}/4 images selected
            </span>
          </button>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <AnimatePresence>
              {imagePreviews.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <img
                    src={image?.url}
                    alt="Car preview"
                    className="w-full h-24 sm:h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(image.id)}
                    disabled={loading}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-70 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    <FaTrash size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <motion.button
            type="submit"
            disabled={loading || imagePreviews.length === 0}
            whileHover={!loading && imagePreviews.length > 0 ? { scale: 1.05 } : {}}
            whileTap={!loading && imagePreviews.length > 0 ? { scale: 0.95 } : {}}
            className={`flex items-center justify-center font-medium py-3 px-8 rounded-lg transition-colors text-lg w-full sm:w-auto ${
              loading || imagePreviews.length === 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Adding Car...
              </>
            ) : (
              `Add Car ${imagePreviews.length > 0 ? `(${imagePreviews.length} images)` : ''}`
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default AddCar;