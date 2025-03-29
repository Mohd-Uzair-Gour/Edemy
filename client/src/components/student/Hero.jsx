import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
      <div className='flex flex-col justify-center items-center w-full md:pt-16 pt-16 space-y-7 px-7 md:px-0  text-center bg-gradient-to-b from-cyan-100/70'>
        <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto'>
          Empower your future with the courses designed by <span className='text-blue-600'>the best educators.</span><img src={assets.sketch} alt="skecth" className='md:block hidden absolute -bottom-7 right-0' />
        </h1>
        <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>here are world class educator,interactive content,and a supportive community to help you achieve your personal and professional goals.</p>

        <p className='md:hidden text-gray-500 max-w-sm mx-auto'> we bring together world class instructor to help you achieve your professional goals.</p>

        <SearchBar/>
      </div>  
      )
}

export default Hero