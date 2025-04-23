'use client';
import { useState } from 'react';
import { Icon } from '../ui';
import { RadiusInit, SelectTheme, ThemeChange } from './customizer';





export const Setting = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);


  return (
    <div>
      <div
        className={`${
          (showCustomizer && '!block') || ''
        } fixed inset-0 z-[51] hidden bg-[black]/60 px-4 transition-[display]`}
        onClick={() => setShowCustomizer(false)}
      ></div>

      <nav
        className={`${
          (showCustomizer && '!right-0 ') || ''
        } fixed bottom-0 top-0 z-[51] w-full max-w-[400px] bg-white p-4 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 -right-[400px]  dark:bg-black`}
      >
        <button
          type='button'
          className='absolute bottom-0 top-0 my-auto flex h-10 w-12 cursor-pointer items-center justify-center bg-primary text-white -left-12 rounded-bl-full rounded-tl-full   '
          onClick={() => setShowCustomizer(!showCustomizer)}
        >
          <Icon name='Settings' className='h-5 w-5 animate-[spin_3s_linear_infinite]' />
        </button>

        <div className='perfect-scrollbar h-full overflow-y-auto overflow-x-hidden'>
          <div className='relative pb-5 text-center'>
            <button
              type='button'
              className='absolute top-0 opacity-30 hover:opacity-100 right-0  dark:text-white'
              onClick={() => setShowCustomizer(false)}
            >
              <Icon name='X' className='h-5 w-5' />
            </button>

            <h4 className='mb-1 dark:text-white'>TEMPLATE CUSTOMIZER</h4>
            <p className='text-white-dark'>
              Set preferences that will be cookied for your live preview
              demonstration.
            </p>
          </div>

          <div className=' space-y-8 mt-3'>
            <SelectTheme />

            <ThemeChange />

            <RadiusInit />
          
          </div>

     
        </div>
      </nav>
    </div>
  );
};
