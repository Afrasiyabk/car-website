import React from 'react';
import { motion } from "framer-motion";
import { 
  FaShieldAlt, 
  FaHeadset, 
  FaTrophy, 
  FaGasPump, 
  FaCar, 
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";
import { fadIn } from '../variant';

const Features = () => {
  const features = [
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Premium Insurance",
      description: "All our rentals include comprehensive insurance coverage for your peace of mind."
    },
    {
      icon: <FaHeadset className="text-2xl" />,
      title: "24/7 Support",
      description: "Our customer service team is available around the clock to assist you."
    },
    {
      icon: <FaTrophy className="text-2xl" />,
      title: "Premium Fleet",
      description: "Choose from our selection of luxury vehicles maintained to the highest standards."
    },
    {
      icon: <FaGasPump className="text-2xl" />,
      title: "Free Fuel",
      description: "Enjoy a full tank of gas with every rental, with no extra charges."
    },
    {
      icon: <FaCar className="text-2xl" />,
      title: "Various Models",
      description: "From economy to luxury, we have the perfect car for every need and budget."
    },
    {
      icon: <FaMoneyBillWave className="text-2xl" />,
      title: "Best Prices",
      description: "Competitive pricing with no hidden fees or unexpected charges."
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "Multiple Locations",
      description: "Convenient pickup and drop-off locations across major cities."
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: "Quick Process",
      description: "Fast and efficient rental process to get you on the road quickly."
    }
  ];

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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
           variants={fadIn('down', 0.2 , 0.2)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the benefits of renting with our premium car rental service
          </p>
        </motion.div>
        
        <motion.div
          variants={fadIn('right', 0.2 , 0.4)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
                variants={fadIn('right',index * 0.1 , 0.1)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="text-blue-600 mb-4 p-3 bg-blue-50 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;