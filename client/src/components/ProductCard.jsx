// Product Card Component
import { Button, Card, CardContent, CardActions, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { MdLocalOffer, MdLocationOn, MdEventAvailable } from "react-icons/md";
import { FaGasPump, FaCogs, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";


const ProductCard = ({ car, index }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.5 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <Card className="h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <div className="relative">
         <Link to={`/product-details/${car._id}`} className="cupsor-pointer block w-full h-48">
          <div className="relative w-full h-48">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg" />
            )}
            <img
              src={car?.images && car?.images?.length > 0 ? car?.images[0]?.url : '/placeholder-car.jpg'}
              alt={car?.title}
              className="w-full h-48 object-cover"
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />
          </div>
            </Link>
          <Chip
            label={`$${car?.pricePerDay}/${car.currency || 'USD'}/day`}
            color="primary"
            className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-lg"
            icon={<MdLocalOffer />}
          />
          {car.available && (
            <Chip
              label="Available"
              color="success"
              className="absolute top-4 left-4 bg-green-500 text-white font-bold"
              icon={<MdEventAvailable />}
            />
          )}
        </div>

        <CardContent className="p-6">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{car.title}</h3>
            <p className="text-sm text-gray-600 font-medium">{car.make} {car.model}</p>
          </div>

          <p className="text-gray-600 mb-4 text-sm line-clamp-2">{car.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-700">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              {car.year}
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <FaUsers className="mr-2 text-blue-500" />
              {car.seats} Seats
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <FaCogs className="mr-2 text-blue-500" />
              {car.transmission}
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <FaGasPump className="mr-2 text-blue-500" />
              {car.fuelType}
            </div>
          </div>

          {car.location && (
            <div className="flex items-center text-sm text-gray-700 mb-3">
              <MdLocationOn className="mr-2 text-red-500" />
              {car.location}
            </div>
          )}

          {car.features && car.features.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">Features:</p>
              <div className="flex flex-wrap gap-1">
                {car.features.slice(0, 3).map((feature, i) => (
                  <Chip
                    key={i}
                    label={feature}
                    size="small"
                    className="bg-blue-100 text-blue-800 text-xs"
                  />
                ))}
                {car.features.length > 3 && (
                  <Chip
                    label={`+${car.features.length - 3} more`}
                    size="small"
                    className="bg-gray-100 text-gray-800 text-xs"
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardActions className="p-6 pt-0">
          <Link to={`/product-details/${car._id}`} className="w-full">
          <Button
            fullWidth
            variant="contained"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
            Rent Now
          </Button>
          </Link>
        </CardActions>
      </Card> 
    </motion.div>
  );
};

export default ProductCard;
