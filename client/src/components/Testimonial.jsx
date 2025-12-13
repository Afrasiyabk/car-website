import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  FaStar, 
  FaQuoteLeft, 
  FaFilter, 
  FaSearch,
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaFacebook
} from "react-icons/fa";

// Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      role: "Business Executive",
      content: "The luxury car rental experience was exceptional. The vehicle was in perfect condition and the service was impeccable.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Travel Influencer",
      content: "I've rented cars from many companies, but this was by far the best experience. The online process was smooth and the car was stunning.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Software Engineer",
      content: "Perfect service for a weekend getaway. The car was delivered on time and exactly as described. Will definitely use again!",
      rating: 4,
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied customers
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="flex mr-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
              </div>
              
              <FaQuoteLeft className="text-blue-500 text-2xl mb-4" />
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default Testimonials ;