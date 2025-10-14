'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Layout,
  Zap,
  Users,
  BarChart3,
  Lock,
  Palette,
  Bell,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Layout,
    title: 'Flexible Views',
    description:
      'Switch between Board, List, and Calendar views to match your workflow.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built for speed with real-time updates and instant synchronization.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Work together seamlessly with comments, mentions, and file sharing.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description:
      'Track progress with beautiful dashboards and detailed reports.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description:
      'Enterprise-grade security to keep your data safe and private.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Palette,
    title: 'Customizable',
    description:
      'Personalize workspaces with custom fields, statuses, and themes.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description:
      'Stay updated with intelligent notifications and activity feeds.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Calendar,
    title: 'Time Management',
    description: 'Built-in calendar, due dates, and time tracking features.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Communicate instantly with integrated chat and video calls.',
    gradient: 'from-blue-500 to-indigo-500',
  },
];

export const FeaturesSection = () => {
  return (
    <section className='w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-20'>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className='text-center mb-16'
      >
        <h2 className='text-4xl sm:text-5xl font-bold mb-4'>
          <span className='bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent'>
            Everything you need
          </span>
        </h2>
        <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
          Powerful features to help you manage projects, collaborate with teams,
          and deliver results faster.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className='h-full border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 rounded-2xl overflow-hidden group'>
                <CardContent className='p-6'>
                  {/* Icon */}
                  <motion.div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className='h-6 w-6 text-white' />
                  </motion.div>

                  {/* Content */}
                  <h3 className='text-lg font-bold text-slate-800 dark:text-slate-200 mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className='mt-20 text-center'
      >
        <div className='inline-block p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 shadow-2xl shadow-blue-500/30'>
          <h3 className='text-3xl md:text-4xl font-bold text-white mb-4'>
            Ready to get started?
          </h3>
          <p className='text-lg text-white/90 mb-6 max-w-xl mx-auto'>
            Join thousands of teams already using Dozevo to manage their work.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg shadow-xl hover:shadow-2xl transition-all'
          >
            Start Free Trial
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};
