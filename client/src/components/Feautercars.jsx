import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";
import {fadIn } from '../variant'
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";





// Featured Cars Section
const FeaturedCars = () => {

  const [cars , setCars] = useState([])
    useEffect(() => {
      const fetchCars = async () => {
        try {
          const response = await axios.get('/api/product/all-cars-public', {
            headers: {
              'Content-Type': 'application/json'
            }
          });
     
         if (response?.data?.success) {
           setCars(response?.data?.cars);
           console.log(cars);
          }
        } catch (error) {
          toast.error(error?.response?.data?.message);
        }
      };
  
      fetchCars();
    }, []);

  return (
    <section className=" p-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
            variants={fadIn('top', 0.1 , 0.1)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Luxury Cars</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of luxury vehicles for your next adventure
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars?.map((car, index) => (
            <ProductCard key={car?.id} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;