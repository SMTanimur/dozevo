'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className='w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl mt-auto'>
      <div className='max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* Brand */}
          <div className='space-y-4'>
            <h3 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Dozevo
            </h3>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              The modern task management platform for teams and individuals.
            </p>
            <div className='flex items-center gap-3'>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href='#'
                className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all'
              >
                <Twitter className='h-4 w-4' />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href='#'
                className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all'
              >
                <Github className='h-4 w-4' />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href='#'
                className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all'
              >
                <Linkedin className='h-4 w-4' />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href='#'
                className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all'
              >
                <Mail className='h-4 w-4' />
              </motion.a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className='font-semibold text-slate-800 dark:text-slate-200 mb-4'>
              Product
            </h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className='font-semibold text-slate-800 dark:text-slate-200 mb-4'>
              Company
            </h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className='font-semibold text-slate-800 dark:text-slate-200 mb-4'>
              Resources
            </h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1'>
            &copy; {new Date().getFullYear()} Dozevo. Made with{' '}
            <Heart className='h-4 w-4 text-red-500 fill-red-500 animate-pulse' />{' '}
            by amazing people.
          </p>
          <div className='flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400'>
            <Link
              href='#'
              className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            >
              Privacy
            </Link>
            <Link
              href='#'
              className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            >
              Terms
            </Link>
            <Link
              href='#'
              className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
