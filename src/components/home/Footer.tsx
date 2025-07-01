import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full text-center py-6 border-t border-gray-200 mt-auto">
      <p className="text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Taskiya. All rights reserved.
      </p>
    </footer>
  );
}; 