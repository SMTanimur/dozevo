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
import { useRouter } from 'next/navigation';

const SingupScreen = () => {

    const { registerForm, signUp, isRegisterPending, isRegisterError } =
    useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const router = useRouter();
  return (
    <div
    className='w-full animate-fadeIn'
    style={{
      animationDuration: '0.4s',
      animationFillMode: 'both',
    }}
  >
    <div className='mb-8 text-center'>
      <h2 className='text-2xl font-bold mb-2'>Create an account</h2>
      <p className='text-muted-foreground'>
        Sign up to start creating AI workflows
      </p>
    </div>

    <Form {...registerForm}>
      <form onSubmit={signUp} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={registerForm.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    icon='User'
                    placeholder='First name'
                    className='w-full'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={registerForm.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Last name'
                    className='w-full'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={registerForm.control}
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
          control={registerForm.control}
          name='contact'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (optional)</FormLabel>
              <FormControl>
                <Input
                  icon='Phone'
                  placeholder='Your phone number'
                  type='tel'
                  autoComplete='tel'
                  className='w-full'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    icon='Lock'
                    placeholder='Create a password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='new-password'
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
              <p className='text-xs text-muted-foreground mt-1'>
                Password must be at least 8 characters long and include a mix
                of letters, numbers, and symbols.
              </p>
            </FormItem>
          )}
        />

        <div className='flex items-start space-x-2 mt-5'>
          <input
            type='checkbox'
            id='terms'
            className='mt-1 rounded border-gray-300 text-primary focus:ring-primary'
          />
          <label htmlFor='terms' className='text-sm'>
            I agree to the{' '}
            <Link
              href='/terms'
              className='text-primary hover:underline transition-colors'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='text-primary hover:underline transition-colors'
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type='submit'
          className='w-full mt-2 py-6'
          disabled={isRegisterPending}
        >
          {isRegisterPending ? (
            <span className='flex items-center justify-center'>
              <Icon
                name='Loader'
                className='animate-spin mr-2 h-4 w-4'
              />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>

        {isRegisterError && (
          <div className='p-3 rounded bg-destructive/10 text-destructive text-sm'>
            There was an error creating your account. Please try again.
          </div>
        )}
      </form>
    </Form>

    <div className='mt-8 text-center'>
      <p className='text-sm text-muted-foreground'>
        Already have an account?{' '}
        <button
         onClick={() => router.push('/login')}
          className='text-primary cursor-pointer font-medium hover:underline transition-colors'
        >
          Sign in
        </button>
      </p>
    </div>
  </div>
  )
}

export default SingupScreen
