import React from 'react';
import { motion } from "framer-motion";
import { FaCheckCircle, FaCalendarAlt, FaStar } from "react-icons/fa";
import {fadIn , fatIn} from '../variant'
const Thumbnail = () => {
 
  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
            variants={fatIn('scale', 0.2 , 0.4)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
          className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left content */}
            <motion.div 
                variants={fadIn('right', 0.4 , 0.8)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
              className="p-8 md:p-12 flex flex-col justify-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Special Summer Offer
              </h2>
              <p className="text-gray-600 mb-6">
                Book now and get <span className="text-blue-600 font-bold">15% off</span> on all luxury car rentals. Limited time offer for our premium customers.
              </p>
              
              <div className="space-y-3 mb-6">
                {['Free cancellation up to 24 hours', 'No hidden fees', 'Premium insurance included'].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center mb-6">
                <div className="flex items-center mr-6">
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-gray-700 ml-2">4.9/5</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-2" />
                  <span className="text-gray-700">Valid until August 31</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full w-full md:w-auto transition-colors"
              >
                Book Now
              </motion.button>
            </motion.div>

            {/* Right image */}
            <motion.div
              variants={fadIn('left', 0.4 , 0.8)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
              className="relative h-64 lg:h-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-blue-500 to-indigo-700 opacity-20 lg:opacity-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                alt="Luxury car rental special offer" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-white py-2 px-4 rounded-full shadow-md">
                <span className="text-blue-600 font-bold text-lg">15% OFF</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional info cards */}
        <motion.div  
          variants={fadIn('', 0.2 , 0.4)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {[
            {
              title: "Premium Service",
              description: "24/7 customer support and concierge service",
              icon: "👑"
            },
            {
              title: "Flexible Booking",
              description: "Change or cancel your reservation easily",
              icon: "🔄"
            },
            {
              title: "Best Rates",
              description: "Guanteed lowest prices for luxury rentals",
              icon: "💰"
            }
          ].map((item, index) => (
            <div key={index}
             className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-blue-100">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Thumbnail;