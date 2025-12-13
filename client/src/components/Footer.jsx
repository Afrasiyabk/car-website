import React from 'react';
import { motion } from "framer-motion";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:pr-4">
            <h3 className="text-2xl font-bold mb-4">Luxury<span className="text-blue-500">Wheels</span></h3>
            <p className="text-gray-400 mb-4">
              Premium car rental service offering luxury vehicles for your special occasions and business needs.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                whileHover={{ scale: 1.1, y: -3 }}
                href="#" 
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors"
              >
                <FaFacebookF />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -3 }}
                href="#" 
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors"
              >
                <FaTwitter />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -3 }}
                href="#" 
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors"
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -3 }}
                href="#" 
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors"
              >
                <FaLinkedinIn />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="lg:pl-4">
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Our Fleet', 'Pricing', 'Testimonials', 'Blog', 'Contact'].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <FaArrowRight className="text-blue-500 mr-2 text-xs" />
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3" />
                <span className="text-gray-400">123 Luxury Avenue, City Center, 10001</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-blue-500 mr-3" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-500 mr-3" />
                <span className="text-gray-400">info@luxurywheels.com</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and special offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-r-lg transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 mb-4 md:mb-0">
            © {currentYear} LuxuryWheels. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service', 'FAQ'].map((item, index) => (
              <motion.a
                key={index}
                whileHover={{ color: '#FFFFFF' }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;