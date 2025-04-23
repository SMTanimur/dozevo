'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { useWorkspaceMutations, useGetMe } from '@/hooks'; 
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

import { createWorkspaceSchema, TCreateWorkspace } from '@/validations/workspace'; 
import { WorkspaceType } from '@/types';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceModal({ isOpen, onOpenChange }: CreateWorkspaceModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: user } = useGetMe();
  const { createWorkspace, isCreating } = useWorkspaceMutations();

  const [tempEmails, setTempEmails] = useState<string>('');

  const totalSteps = 3;

  const form = useForm<TCreateWorkspace>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: user ? `${user.firstName}'s Workspace` : '', 
      workspaceType: WorkspaceType.PERSONAL,
    },
  });

  React.useEffect(() => {
    if (user && !form.getValues('name')) {
      form.setValue('name', `${user.firstName}'s Workspace`);
    }
  }, [user, form]);

  const nextStep = async () => {
    if (currentStep === 3) {
        const isValid = await form.trigger('name');
        if (!isValid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = (data: TCreateWorkspace) => {
    console.log('Submitting workspace data:', data);
    createWorkspace(data, {
      onSuccess: (newWorkspace) => {
        Cookies.set('workspace', newWorkspace._id, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
         });
        onOpenChange(false);
        router.push(`/${newWorkspace._id}/home`);
      },
      onError: (error) => {
        console.error('Workspace creation failed:', error);
      }
    });
  };

  const handlePurposeSelect = () => {
    nextStep();
  };

  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-xl p-0 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
            <Icon name="LayoutGrid" className="h-6 w-auto text-primary" />
            {user && (
                <span className="text-sm text-gray-600">Welcome, {user.firstName} {user.lastName}!</span>
            )}
        </div>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 p-6">
            {currentStep === 1 && (
              <div className="text-center space-y-6">
                <AlertDialogTitle className="text-xl font-semibold">What will you use this Workspace for?</AlertDialogTitle>
                <div className="flex justify-center gap-4">
                  <Button type="button" variant="outline" onClick={() => handlePurposeSelect()}>Work</Button>
                  <Button type="button" variant="outline" onClick={() => handlePurposeSelect()}>Personal</Button>
                  <Button type="button" variant="outline" onClick={() => handlePurposeSelect()}>School</Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center space-y-6">
                <AlertDialogTitle className="text-xl font-semibold">Invite people to your Workspace:</AlertDialogTitle>
                <Input 
                    placeholder="Enter email addresses (or paste multiple)" 
                    value={tempEmails}
                    onChange={(e) => setTempEmails(e.target.value)} 
                    className="max-w-sm mx-auto"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <AlertDialogTitle className="text-xl font-semibold">Lastly, what would you like to name your Workspace?</AlertDialogTitle>
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="E.g. Company Name or Project" {...field} className="max-w-sm mx-auto" />
                        </FormControl>
                         <p className="text-xs text-gray-500 pt-1">Try the name of your company or organization.</p>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <p className="text-xs text-gray-500 px-6 sm:px-10">
                    By completing this form, you agree to our <a href="/terms" target="_blank" className="underline hover:text-primary">Terms of Service</a> and <a href="/privacy" target="_blank" className="underline hover:text-primary">Privacy Policy</a>.
                </p>
              </div>
            )}

            <div className="pt-6 space-y-4">
                <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                   <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 ease-in-out rounded-full"
                    style={{ width: `${progressValue}%` }}
                    />
                </div>

                <AlertDialogFooter className="pt-2">
                    {currentStep > 1 && (
                        <Button type="button" variant="outline" onClick={prevStep} className="mr-auto">Back</Button>
                    )}
                    {currentStep === 2 && (
                        <Button type="button" onClick={() => nextStep()}>I&apos;m done</Button>
                    )}
                    {currentStep === 3 && (
                        <Button 
                            type="button" 
                            variant="default"
                            disabled={isCreating} 
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            {isCreating ? 'Finishing...' : 'Finish'}
                        </Button>
                    )}
                </AlertDialogFooter>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
} 