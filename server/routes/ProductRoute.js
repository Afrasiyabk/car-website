// routes/ProductRoute.js
import express from 'express';
import authenticat from '../middleware/Authentication.js';
import upload from '../config/Upload.js';
import Product from '../modules/ProductModule.js';
import connectCloudinary from '../config/Cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

connectCloudinary();

const ProductRouter = express.Router();

// Error handling middleware for multer errors
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB per image.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 4 images allowed.'
      });
    }
  }
  next(error);
};

// create car api
ProductRouter.post('/create-car', authenticat, upload.array('images', 4), handleMulterError, async (req, res) => {
    // Declare images variable at the top so it's accessible in catch block
    let images = [];
    
    try {
        const {
            title,
            make,
            model,
            year,
            pricePerDay,
            seats,
            transmission,
            fuelType,
            currency,
            features,
            location,
            description
        } = req.body;

        const userId = req.user._id;
        if (!userId) return res.status(401).json({ success: false, message: 'User not found' });

        const files = req.files || [];

        if (description.length > 300) {
            return res.status(400).json({ success: false, message: 'Maximum 300 characters are allowd ' });
        }
        
        // Check if files were uploaded
        if (files.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one image is required' });
        }

        // Upload files to cloudinary
        for (const file of files) {
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'car-website/cars',
                    use_filename: true,
                    unique_filename: false,
                    resource_type: 'image',
                });
                images.push({ url: result.secure_url, public_id: result.public_id });
                
                // Remove temp file
                fs.unlinkSync(file.path);
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                // Clean up remaining files
                files.forEach(f => {
                    if (fs.existsSync(f.path)) {
                        fs.unlinkSync(f.path);
                    }
                });
                return res.status(500).json({ 
                    success: false, 
                    message: 'Failed to upload image to Cloudinary' 
                });
            }
        }

        // Parse features if it's a string
        let featuresArray = [];
        if (features) {
            try {
                featuresArray = typeof features === 'string' ? 
                    JSON.parse(features) : 
                    (Array.isArray(features) ? features : []);
            } catch (parseError) {
                console.error('Features parse error:', parseError);
                featuresArray = Array.isArray(features) ? features : [];
            }
        }

        // Create product
        const product = await Product.create({
            user: userId,
            title,
            make,
            model,
            year: year ? Number(year) : undefined,
            pricePerDay: pricePerDay ? Number(pricePerDay) : undefined,
            seats: seats ? Number(seats) : undefined,
            transmission,
            fuelType, // Make sure this matches your enum values
            currency,
            features: featuresArray,
            location,
            description: description || '',
            images,
            available: true,
        });

        res.status(201).json({ 
            success: true, 
            message: 'Car created successfully',
            product 
        });
    } catch (error) {
        console.error('Create car error:', error);
        
        // Clean up any uploaded Cloudinary images if product creation fails
        if (images && images.length > 0) {
            for (const img of images) {
                try {
                    await cloudinary.uploader.destroy(img.public_id);
                } catch (deleteError) {
                    console.error('Failed to delete Cloudinary image:', deleteError);
                }
            }
        }
        
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: errors,
                errors 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error' 
        });
    }
});

// edit car - replace images (optional) and update fields
ProductRouter.put('/edit-car/:id', authenticat, upload.fields([
    { name: 'newImages', maxCount: 4 }
]), async (req, res) => {
    const { id } = req.params;
    const update = { ...req.body };
    
    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        
        // only owner can edit
        if (String(product.user) !== String(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const files = req.files.newImages || [];
        const imagesToDelete = req.body.imagesToDelete ? JSON.parse(req.body.imagesToDelete) : [];

        // Delete specified images from Cloudinary
        if (imagesToDelete.length > 0) {
            for (const imageUrl of imagesToDelete) {
                const image = product.images.find(img => img.url === imageUrl);
                if (image && image.public_id) {
                    try {
                        await cloudinary.uploader.destroy(image.public_id);
                        console.log(`Deleted image: ${imageUrl}`);
                    } catch (e) {
                        console.warn('Failed to delete image from Cloudinary', e);
                    }
                }
            }
            // Remove deleted images from product's images array
            product.images = product.images.filter(img => !imagesToDelete.includes(img.url));
        }

        // Upload new images if provided
        if (files.length > 0) {
            const newImages = [];
            for (const file of files) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'car-website/cars'
                    });
                    newImages.push({ url: result.secure_url, public_id: result.public_id });
                    // Remove temp file
                    fs.unlinkSync(file.path);
                } catch (uploadError) {
                    console.error('Cloudinary upload error:', uploadError);
                    // Clean up temp file even if upload fails
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to upload image to Cloudinary'
                    });
                }
            }
            // Add new images to product's images array
            product.images = [...product.images, ...newImages];
        }

        // Update other fields
        if (update.features) {
            update.features = Array.isArray(update.features)
                ? update.features
                : update.features.split(',').map((f) => f.trim());
        }
        if (update.year) update.year = Number(update.year);
        if (update.pricePerDay) update.pricePerDay = Number(update.pricePerDay);
        if (update.seats) update.seats = Number(update.seats);

        // Merge with existing images
        update.images = product.images;

        const updated = await Product.findByIdAndUpdate(id, update, { new: true });
        res.json({ success: true, car: updated });
    } catch (error) {
        console.error('Edit car error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});


// get all cars for authenticated user
ProductRouter.get('/all-cars', authenticat, async (req, res) => {
    try {
        const userId = req.user?._id;
       const cars = await Product.find({ user: userId });
        return res.status(200).json({ success: true, message: 'Cars retrieved successfully', cars });
    } catch (error) {
        console.error('Get all cars error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// delete car (owner only) -> deletes product and its images from Cloudinary
ProductRouter.delete('/delete-car/:id', authenticat, async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        if (String(product.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'Forbidden' });

        // delete images from Cloudinary
        const imgs = product.images || [];
        for (const img of imgs) {
            if (img && img.public_id) {
                try {
                    await cloudinary.uploader.destroy(img.public_id);
                } catch (e) {
                    console.warn('Failed to delete Cloudinary image during product delete', e);
                }
            }
        }

        await Product.findByIdAndDelete(id);
        return res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Delete car error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// get single car details (public)
ProductRouter.get('/car-details/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id).populate('user', 'name email');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.json({ success: true, product });
    } catch (error) {
        console.error('Get car details error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Public - no authentication required
ProductRouter.get('/all-cars-public', async (req, res) => {
    try {
        const cars = await Product.find({}); // no user filter
        return res.status(200).json({ success: true, cars });
    } catch (error) {
        console.error('All cars error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});



export default ProductRouter;