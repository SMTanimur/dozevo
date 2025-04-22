'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components';


export default function LoginPage() {
  const { loginForm, login, isLoginPending, isLoginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div
      className='w-full animate-fadeIn'
      style={{
        animationDuration: '0.4s',
        animationFillMode: 'both',
      }}
    >
      <div className='mb-8 text-center'>
        <h2 className='text-2xl font-bold mb-2'>Welcome back</h2>
        <p className='text-muted-foreground'>
          Login to your account to continue
        </p>
      </div>

      <Form {...loginForm}>
        <form onSubmit={login} className='space-y-5'>
          <FormField
            control={loginForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    icon='Mail'
                    placeholder='Enter your email'
                    type='email'
                    autoComplete='email'
                    className='w-full'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      icon='Lock'
                      placeholder='Enter your password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='current-password'
                      className='w-full'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={togglePasswordVisibility}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                    >
                      <Icon
                        name={showPassword ? 'EyeOff' : 'Eye'}
                        className='h-4 w-4'
                      />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-between items-center text-sm'>
            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='checkbox'
                className='rounded border-gray-300 text-primary focus:ring-primary'
              />
              <span>Remember me</span>
            </label>
            <Link
              href='/forgot-password'
              className='text-primary hover:underline transition-colors'
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type='submit'
            className='w-full py-6'
            loading={isLoginPending}
            disabled={isLoginPending}
          >
            Sign in
          </Button>

          {isLoginError && (
            <div className='p-3 rounded bg-destructive/10 text-destructive text-sm'>
              Invalid email or password. Please try again.
            </div>
          )}
        </form>
      </Form>

      <div className='mt-8 text-center'>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-border' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>

     

        <p className='mt-8 text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link
            href='/signup'
            className='text-primary font-medium hover:underline transition-colors'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
