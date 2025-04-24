/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LogingInput } from '@/types';


import { authService } from '@/services/auth';
import { createUserSchema, loginSchema, TCreateUser, TLogin } from '@/validations';
import { toast } from 'sonner';


export const useAuth = () => {
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const loginForm = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<TCreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      contact: '',
    },
  });

  const {
    mutateAsync: loginMutateAsync,
    isPending: isLoginPending,
    isError: isLoginError,
  } = useMutation({
    mutationFn: authService.login,
    mutationKey: [authService.login.name],
    onSuccess: data => {
      console.log({ res: data });
      push('/');
    },
  });

  const {
    mutateAsync: registerMutateAsync,
    isPending: isRegisterPending,
    isError: isRegisterError,
  } = useMutation({
    mutationFn: authService.register,
    mutationKey: [authService.register.name],
    onSuccess: data => {
      console.log({ res: data });
      push('/');
    },
  });

  const login = loginForm.handleSubmit(async (data: LogingInput) => {
    try {
      await loginMutateAsync(data);
     
    } catch (error: any) {
      console.log({ error });
    }
  });

  const signUp = registerForm.handleSubmit(async (data: TCreateUser) => {
    try {
      await registerMutateAsync(data);
     
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      
    }
  });

  const logout = async () => {
    try {
      await authService.logout();
      queryClient.clear();
      toast.success('Logged out successfully');
      push('/');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  return {
    login,
    signUp,
    registerForm,
    loginForm,
    isLoginPending,
    isRegisterPending,
    isLoginError,
    isRegisterError,
    logout,
  };
};