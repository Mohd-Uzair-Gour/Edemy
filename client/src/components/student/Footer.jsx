import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
          <img src={assets.logo_dark} alt="logo" />
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>
          Empowering learners with high-quality, accessible, and practical education. Join us on your journey to mastering new skills and achieving your goals — one course at a time.
          </p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80'>
            The latest news, articles, and resources, sent to your inbox weekly
          </p>
          <div className='flex items-center gap-2 pt-4'>
            <input
              className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'
              type="email"
              placeholder='Write your email'
            />
            <button className='bg-blue-600 w-24 h-9 text-white rounded'>Subscribe</button>
          </div>
        </div>
      </div>
      <div className='py-4 flex flex-col md:flex-row justify-between items-center px-8 md:px-0 text-white/60'>
        <p className='text-xs md:text-sm'>
          Copyright 2025 © Edemy All Rights Reserved
        </p>
        <div className='flex gap-4 mt-2 md:mt-0'>
          <a href="https://instagram.com/uzair_gour_?igsh=MTI5bzhibGE0YWFvbw==" target="_blank" rel="noopener noreferrer" className='hover:opacity-80 transition-opacity'>
            <svg className='w-6 h-6 fill-current text-white' viewBox="0 0 24 24">
              <path d="M7.75 2h8.5A5.25 5.25 0 0121.5 7.25v8.5A5.25 5.25 0 0116.25 21h-8.5A5.25 5.25 0 012.5 15.75v-8.5A5.25 5.25 0 017.75 2zm6.5 2.5a1 1 0 100 2 1 1 0 000-2zm-2.5 2.5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
            </svg>
          </a>
          <a href="https://github.com/Mohd-Uzair-Gour" target="_blank" rel="noopener noreferrer" className='hover:opacity-80 transition-opacity'>
            <svg className='w-6 h-6 fill-current text-white' viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
          <a href="https://youtube.com/your_id" target="_blank" rel="noopener noreferrer" className='hover:opacity-80 transition-opacity'>
            <svg className='w-6 h-6 fill-current text-white' viewBox="0 0 24 24">
              <path d="M23.498 6.186a2.997 2.997 0 00-2.115-2.116C19.888 3.659 12 3.659 12 3.659s-7.888 0-9.383.411a2.997 2.997 0 00-2.115 2.116C.092 7.682.092 12 .092 12s0 4.318.411 5.814a2.997 2.997 0 002.115 2.116c1.495.411 9.383.411 9.383.411s7.888 0 9.383-.411a2.997 2.997 0 002.115-2.116c.411-1.496.411-5.814.411-5.814s0-4.318-.411-5.814zM9.658 15.659V8.341l6.234 3.659-6.234 3.659z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;