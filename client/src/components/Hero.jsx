import React, { useState, useRef } from 'react';
import { Button, TextField, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import blue from '../assets/blue.png';
import red from '../assets/red.png'
import white from '../assets/white.png'

import {fadIn , fatIn} from '../variant'

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const animationTrigger = useRef(0);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
    animationTrigger.current += 1;
  };

  const handleSearch = () => {
    console.log("Searching with:", { location, pickupDate, returnDate });
    alert(`Searching for cars in ${location} from ${pickupDate} to ${returnDate}`);
  };

  const carImages = {
    blue: blue,
    red: red,
    white: white
  };

  const slides = [
    {
      bgColor: "bg-gradient-to-r from-blue-50 to-indigo-100",
      textColor: "text-blue-600",
      circleColor: "bg-blue-200",
      image: carImages.blue,
      title: "Premium Luxury Cars",
      subtitle: "Experience the ultimate driving experience"
    },
    {
      bgColor: "bg-gradient-to-r from-red-50 to-pink-100",
      textColor: "text-red-600",
      circleColor: "bg-red-200",
      image: carImages.red,
      title: "Sports Car Collection",
      subtitle: "Feel the adrenaline with our sports cars"
    },
    {
      bgColor: "bg-gradient-to-r from-gray-50 to-blue-gray-100",
      textColor: "text-gray-800",
      circleColor: "bg-gray-200",
      image: carImages.white,
      title: "Elegant & Sophisticated",
      subtitle: "Fek/dk@a.startenheat.wilherevep.yots.gars"
    }
  ];

  return (
    <div className="relative h-[100vh] overflow-hidden">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className='mySwiper'
        modules={[Pagination, Navigation]}
        onSlideChange={handleSlideChange}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={`flex flex-col md:flex-row pt-10 gap-2 items-center ${slide.bgColor}`}>
              <div className='flex flex-col items-start p-10'>
              <div className="flex flex-col max-w-3xl">
                <motion.h1
                  key={`title-${activeIndex}-${animationTrigger.current}`}
                  variants={fadIn('right', 0.2 , 0.4)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}}  
                  className={`hero-title nosifer font-bold text-4xl mb-2 md:text-5xl ${slide.textColor}`}
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  key={`subtitle-${activeIndex}-${animationTrigger.current}`}
                 variants={fadIn('right', 0.4 , 0.5)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
                  className="text-xl text-gray-600 mb-4"
                >
                  {slide.subtitle}
                </motion.p>
              </div>
              {/* Search Box */}
              <motion.div
                key={`search-${activeIndex}-${animationTrigger.current}`}
               variants={fadIn('right', 0.4 , 0.7)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rental Location
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      variant="outlined"
                      placeholder="Enter location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pick-up Date
                    </label>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Date
                    </label>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handleSearch}
                    className="h-10 w-full"
                    disabled={!location || !pickupDate || !returnDate}
                  >
                    Search
                  </Button>
                </div>
              </motion.div>
              </div>
              {/* Car Image */}
              <motion.div 
                key={`image-${activeIndex}-${animationTrigger.current}`} 
                className="relative mt-2 md:mt-4"
              >
                <motion.div
                  key={`circle-${activeIndex}-${animationTrigger.current}`}
                  variants={fatIn('scale', 0.4 , 0.8)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}}  
                  className={`absolute z-0 top-0 right-0 md:right-[10px] w-54 h-54 md:w-70 md:h-70 rounded-full ${slide.circleColor}`}
                ></motion.div>
                <motion.img
                  key={`car-${activeIndex}-${animationTrigger.current}`}
                  className="relative z-10 w-full max-w-md md:max-w-2xl"
                  variants={fadIn('right', 0.4 , 0.9)}
                   initial='hidden'
                   whileInView={'show'}
                   viewport={{once  : false , amount : 0.7}} 
                  src={slide.image}
                  alt="Luxury car"
                />
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;



