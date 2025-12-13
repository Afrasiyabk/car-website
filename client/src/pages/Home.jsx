import React from 'react'
import Hero from '../components/Hero'
import FeaturedCars from '../components/Feautercars'
import Features from '../components/Features'
import Thumbnail from '../components/Thumbnail'
import Testimonials from '../components/Testimonial'

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedCars />
      <Features />
      <Testimonials />
      <Thumbnail/>
    </>
  )
}

export default Home
