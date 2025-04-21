import React from 'react';

export const HeroSection = () => {
  return (
    <div className="max-w-3xl mx-auto pt-20 md:pt-24">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
        The everything app,<br /> for work
      </h1>
      <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-10">
        Get everyone working in a single platform designed to manage any type of work.
      </p>

      <a
        href="#"
        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white text-base font-medium hover:bg-gray-700 transition-colors shadow-md mb-3"
      >
        Get Started. It&apos;s FREE
        <span aria-hidden="true" className="ml-2">→</span>
      </a>

      <p className="text-xs text-gray-400">
        Free Forever. No Credit Card.
      </p>
    </div>
  );
}; 