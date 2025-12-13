import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaImage,
  FaPlus,
  FaMinus
} from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Checkbox,
  FormControlLabel,
  Grid
} from '@mui/material';

// Manage Cars Page
const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImagesToDelete, setSelectedImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const handleEditClick = (car) => {
    setEditingCar(car._id);
    setEditFormData({
      ...car,
      features: Array.isArray(car.features) ? car.features.join(', ') : car.features
    });
    setSelectedImagesToDelete([]);
    setNewImages([]);
    setOpenDialog(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`/api/product/all-cars`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          setCars(response.data.cars);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching cars');
      }
    };
    fetchCars();
  }, []);

  const handleSaveClick = async () => {
    try {
      const updatedData = {
        ...editFormData,
        features: editFormData.features.split(',').map(feature => feature.trim()),
        imagesToDelete: JSON.stringify(selectedImagesToDelete),
        newImages: newImages
      };

      const formData = new FormData();
      Object.keys(updatedData).forEach(key => {
        if (key === 'newImages') {
          updatedData.newImages.forEach(file => {
            formData.append('newImages', file);
          });
        } else if (key !== 'images') {
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(
        `/api/product/edit-car/${editingCar}`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setCars(cars.map(car => 
          car?._id === editingCar ? response?.data?.car : car
        ));
        toast.success('Car updated successfully');
        setOpenDialog(false);
        setEditingCar(null);
        setSelectedImagesToDelete([]);
        setNewImages([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating car');
    }
  };

  const handleDeleteClick = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        const response = await axios.delete(
          `/api/product/delete-car/${carId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );

        if (response?.data?.success) {
          setCars(cars.filter(car => car._id !== carId));
          toast.success(response?.data?.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting car');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCar(null);
    setSelectedImagesToDelete([]);
    setNewImages([]);
  };

  const handleImageSelection = (imageUrl) => {
    setSelectedImagesToDelete(prev =>
      prev.includes(imageUrl) ? prev.filter(url => url !== imageUrl) : [...prev, imageUrl]
    );
  };

  const handleNewImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-6">Manage Cars</h1>
      {cars.length > 0 && (
      <TableContainer component={Paper} className="shadow-lg bg-amber-950">
        <Table sx={{ minWidth: 1200 }}>
          <TableHead className="bg-blue-200">
            <TableRow>
              <TableCell className="font-bold" style={{ width: '80px' }}> <span className='text-blue-600 font-semibold'> Image</span></TableCell>
              <TableCell className="font-bold" style={{ width: '200px' }}> <span className='text-blue-600 font-semibold'> Title</span></TableCell>
              <TableCell className="font-bold" style={{ width: '180px' }}> <span className='text-blue-600 font-semibold'> Make/Model/Year</span></TableCell>
              <TableCell className="font-bold" style={{ width: '100px' }}>
                <span className='text-blue-600 font-semibold'>
                Price/Day
                </span>
                </TableCell>
              <TableCell className="font-bold" style={{ width: '120px' }}>
                <span className='text-blue-600 font-semibold'>
                Transmission
                </span>
                </TableCell>
              <TableCell className="font-bold" style={{ width: '100px' }}>
                <span className='text-blue-600 font-semibold'>
                Seats
                </span>
                </TableCell>
              <TableCell className="font-bold truncate" style={{ width: '120px' }}>
                <span className='text-blue-600 font-semibold'>
                Fuel Type
                </span>
                </TableCell>
              <TableCell className="font-bold" style={{ width: '150px' }}>
                <span className='text-blue-600 font-semibold'>
                Location
                </span>
                </TableCell>
              <TableCell className="font-semibold" style={{ width: '200px' }}>
                <span className='text-blue-600 font-semibold'>
                Features
                </span>
                </TableCell>
              <TableCell className="font-bold" style={{ width: '120px' }}>
                <span className='text-blue-600 font-semibold'>
                Actions
                </span>
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars?.map((car) => (
              <TableRow 
                key={car?._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell style={{ width: '80px' }}>
                  <div className="w-16 h-12 rounded overflow-hidden">
                    {car?.images && car?.images[0] ? (
                      <img 
                        src={car?.images[0]?.url} 
                        alt={car?.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FaImage className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell style={{ width: '200px' }}>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate" style={{ 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      lineHeight: '1.2',
                      marginBottom: '4px'
                    }}>
                      {car?.title}
                    </div>
                    <div className="text-sm text-gray-600 truncate" style={{ 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      lineHeight: '1.2'
                    }}>
                      {car?.description?.substring(0, 30)}...
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ width: '180px' }}>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between p-2 rounded-full bg-blue-200">
                      <small className="text-black">Make:</small>
                      <small className="font-medium text-gray-500">{car?.make}</small>
                    </div>
                    <div className="flex justify-between  p-2 rounded-full bg-blue-200">
                      <small className="text-black">Model:</small>
                      <small className="font-medium text-gray-500">{car?.model}</small>
                    </div>
                    <div className="flex justify-between  p-2 rounded-full bg-blue-200">
                      <small className="text-black">Year:</small>
                      <small className="font-medium text-gray-500">{car?.year}</small>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ width: '100px' }}>
                  <span className="font-bold text-blue-600 text-lg bg-blue-100 p-2 rounded-2xl">
                    ${car?.pricePerDay}
                  </span>
                </TableCell>
                <TableCell style={{ width: '120px' }}>
                  <span className="capitalize px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {car?.transmission}
                  </span>
                </TableCell>
                <TableCell  style={{ width: '100px' }}>
                  <p className="block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium" style={{
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis'
                  }}>
                    {car?.seats } seats
                  </p>
                </TableCell>
                <TableCell style={{ width: '120px' }}>
                  <span className="capitalize px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    {car?.fuelType}
                  </span>
                </TableCell>
                <TableCell style={{ width: '150px' }} className="text-sm font-medium ">
                  <span style={{
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis'
                  }}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                    >
                  {car?.location}
                  </span>
                </TableCell>
                <TableCell style={{ width: '200px' }}>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(car?.features) && car?.features.slice(0, 3).map((feature, index) => (
                      <Chip 
                        key={index}
                        label={feature}
                        size="small"
                        className="text-xs mb-1"
                        variant="outlined"
                      />
                    ))}
                    {car?.features && car?.features?.length > 3 && (
                      <Chip 
                        label={`+${car?.features?.length - 3}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell style={{ width: '120px' }}>
                  <div className="flex space-x-1">
                    <IconButton 
                      onClick={() => handleEditClick(car)}
                      className="text-blue-600 hover:bg-blue-50"
                      size="small"
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteClick(car?._id)}
                      className="text-red-600 hover:bg-red-50"
                      size="small"
                    >
                      <FaTrash />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
       )}

      {/* Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="bg-blue-50">
          <div className="flex justify-between items-center">
            <span className="font-bold">Edit Car Details</span>
            <IconButton onClick={handleCloseDialog} size="small">
              <FaTimes />
            </IconButton>
          </div>
        </DialogTitle>
        
        <DialogContent className="p-6">
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Title"
              name="title"
              value={editFormData.title || ''}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Make"
              name="make"
              value={editFormData.make || ''}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Model"
              name="model"
              value={editFormData.model || ''}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Year"
              name="year"
              type="number"
              value={editFormData.year || ''}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price Per Day"
              name="pricePerDay"
              type="number"
              value={editFormData.pricePerDay || ''}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Transmission</InputLabel>
              <Select
                name="transmission"
                value={editFormData.transmission || 'automatic'}
                onChange={handleEditFormChange}
                label="Transmission"
              >
                <MenuItem value="automatic">Automatic</MenuItem>
                <MenuItem value="manual">Manual</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Seats"
              name="seats"
              type="number"
              value={editFormData.seats || ''}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Fuel Type</InputLabel>
              <Select
                name="fuelType"
                value={editFormData.fuelType || 'petrol'}
                onChange={handleEditFormChange}
                label="Fuel Type"
              >
                <MenuItem value="petrol">Petrol</MenuItem>
                <MenuItem value="diesel">Diesel</MenuItem>
                <MenuItem value="electric">Electric</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Location"
              name="location"
              value={editFormData.location || ''}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
              className="md:col-span-2"
            />
            <TextField
              label="Description"
              name="description"
              value={editFormData.description || ''}
              onChange={handleEditFormChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              className="md:col-span-2"
            />
            <TextField
              label="Features (comma separated)"
              name="features"
              value={editFormData.features || ''}
              onChange={handleEditFormChange}
              fullWidth
              margin="normal"
              className="md:col-span-2"
              helperText="Separate features with commas"
            />
          </Box>

          {/* Existing Images Section */}
          {editFormData.images && editFormData.images.length > 0 && (
            <Box className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Existing Images</h3>
              <Grid container spacing={2}>
                {editFormData.images.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <div className="relative">
                      <img
                        src={image.url}
                        alt={`Car ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedImagesToDelete.includes(image.url)}
                            onChange={() => handleImageSelection(image.url)}
                            color="secondary"
                          />
                        }
                        label="Delete"
                        className="absolute top-2 left-2"
                      />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* New Images Section */}
          <Box className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Upload New Images</h3>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleNewImageUpload}
              className="mb-2"
            />
            {newImages.length > 0 && (
              <Grid container spacing={2}>
                {newImages.map((file, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <IconButton
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2"
                        size="small"
                        color="error"
                      >
                        <FaMinus />
                      </IconButton>
                    </div>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions className="p-4 border-t">
          <Button 
            onClick={handleCloseDialog}
            startIcon={<FaTimes />}
            color="secondary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveClick}
            startIcon={<FaSave />}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {cars.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No cars found. Add some cars to see them here.
        </div>
      )}
    </motion.div>
  );
};

export default ManageCars;