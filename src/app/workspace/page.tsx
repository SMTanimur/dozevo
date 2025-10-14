'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreateWorkspaceModal } from '@/components/modals';
import { Button } from '@/components/ui/button';
import {
  useGetMe,
  useGetWorkspaces,
  useUserMutations,
  useWorkspaceMutations,
} from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Plus,
  Building2,
  Users,
  CheckCircle2,
  Edit,
  Trash2,
  Briefcase,
  GraduationCap,
  Home,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkspaceType } from '@/types';
import {
  AnimatedWrapper,
  StaggerContainer,
} from '@/components/common/animated-wrapper';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib';

const WorkspacePage = () => {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(
    null
  );

  const { data: user, isLoading: isLoadingUser, isError } = useGetMe();
  const { data: workspaces = [], isLoading: isLoadingWorkspaces } =
    useGetWorkspaces();
  const { updateActiveWorkspace } = useUserMutations();
  const { deleteWorkspace } = useWorkspaceMutations();

  const isLoading = isLoadingUser || isLoadingWorkspaces;

  useEffect(() => {
    const workspaceCookie = Cookies.get('workspace');

    if (isLoading) return;

    if (isError || !user) {
      console.error('Error fetching user or user not found');
      return;
    }

    // If user has active workspace and cookie matches, redirect
    if (
      workspaceCookie &&
      user.activeWorkspace &&
      workspaceCookie === user.activeWorkspace
    ) {
      router.replace(`/${user.activeWorkspace}/home`);
      return;
    }

    // If no workspaces exist, show create modal
    if (workspaces.length === 0 && !isLoadingWorkspaces) {
      setIsCreateModalOpen(true);
    }

    // Clear invalid cookie
    if (workspaceCookie !== user.activeWorkspace) {
      Cookies.remove('workspace');
    }
  }, [user, isLoading, isError, router, workspaces, isLoadingWorkspaces]);

  const handleSelectWorkspace = (workspaceId: string) => {
    updateActiveWorkspace(
      { workspaceId },
      {
        onSuccess: () => {
          Cookies.set('workspace', workspaceId);
          router.push(`/${workspaceId}/home`);
        },
      }
    );
  };

  const handleDeleteWorkspace = () => {
    if (workspaceToDelete) {
      deleteWorkspace(workspaceToDelete, {
        onSuccess: () => {
          setWorkspaceToDelete(null);
        },
      });
    }
  };

  const getWorkspaceIcon = (type: WorkspaceType) => {
    switch (type) {
      case WorkspaceType.WORK:
        return <Briefcase className='h-5 w-5' />;
      case WorkspaceType.SCHOOL:
        return <GraduationCap className='h-5 w-5' />;
      case WorkspaceType.PERSONAL:
        return <Home className='h-5 w-5' />;
      default:
        return <Building2 className='h-5 w-5' />;
    }
  };

  const getWorkspaceGradient = (type: WorkspaceType) => {
    switch (type) {
      case WorkspaceType.WORK:
        return 'from-blue-500 to-indigo-600';
      case WorkspaceType.SCHOOL:
        return 'from-purple-500 to-pink-600';
      case WorkspaceType.PERSONAL:
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4'>
        <motion.div
          className='flex flex-col items-center gap-4'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div className='text-center'>
            <Skeleton className='h-8 w-64 mb-2' />
            <Skeleton className='h-4 w-80' />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='relative border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl'
      >
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5' />
        <div className='relative max-w-7xl mx-auto px-8 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <motion.div
                className='p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30'
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className='h-6 w-6 text-white' />
              </motion.div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent'>
                  Your Workspaces
                </h1>
                <p className='text-sm text-slate-600 dark:text-slate-400 mt-0.5'>
                  Select a workspace to get started
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className='rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all'
            >
              <Plus className='h-4 w-4 mr-2' />
              Create Workspace
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-8 py-12'>
        {workspaces.length === 0 ? (
          <AnimatedWrapper variant='fadeIn' delay={0.3}>
            <div className='flex flex-col items-center justify-center py-20 text-center'>
              <motion.div
                className='mb-6 p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30'
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Building2 className='h-16 w-16 text-white' />
              </motion.div>
              <h2 className='text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2'>
                No workspaces yet
              </h2>
              <p className='text-slate-600 dark:text-slate-400 mb-6 max-w-md'>
                Create your first workspace to start organizing your tasks and
                collaborating with your team
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                size='lg'
                className='rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all'
              >
                <Plus className='h-5 w-5 mr-2' />
                Create Your First Workspace
              </Button>
            </div>
          </AnimatedWrapper>
        ) : (
          <StaggerContainer className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {workspaces.map((workspace, index) => {
              const isActive = user?.activeWorkspace === workspace._id;
              const gradient = getWorkspaceGradient(workspace.workspaceType);
              const icon = getWorkspaceIcon(workspace.workspaceType);

              return (
                <motion.div
                  key={workspace._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    className={cn(
                      'overflow-hidden border-2 transition-all duration-300 cursor-pointer group relative',
                      isActive
                        ? 'border-blue-400 dark:border-blue-500 shadow-2xl shadow-blue-500/30 ring-2 ring-blue-400/20'
                        : 'border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600'
                    )}
                  >
                    {/* Active Badge */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='absolute top-3 right-3 z-10'
                      >
                        <Badge className='bg-green-500 text-white shadow-lg shadow-green-500/30'>
                          <CheckCircle2 className='h-3 w-3 mr-1' />
                          Active
                        </Badge>
                      </motion.div>
                    )}

                    {/* Header with Gradient */}
                    <div
                      className={`relative bg-gradient-to-r ${gradient} p-6 text-white overflow-hidden`}
                      onClick={() => handleSelectWorkspace(workspace._id)}
                    >
                      {/* Animated Background Pattern */}
                      <motion.div
                        className='absolute inset-0 opacity-20'
                        style={{
                          backgroundImage:
                            'radial-gradient(circle, currentColor 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                        animate={{
                          backgroundPosition: ['0px 0px', '20px 20px'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />

                      <div className='relative z-10 flex items-start justify-between'>
                        <motion.div
                          className='p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg'
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          {icon}
                        </motion.div>
                      </div>

                      <div className='relative z-10 mt-4'>
                        <h3 className='text-xl font-bold mb-1 truncate'>
                          {workspace.name}
                        </h3>
                        <p className='text-sm text-white/80 capitalize'>
                          {workspace.workspaceType} Workspace
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className='p-5 bg-white dark:bg-slate-900'>
                      <div className='space-y-3 mb-4'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-slate-600 dark:text-slate-400 flex items-center gap-2'>
                            <Users className='h-4 w-4' />
                            Members
                          </span>
                          <span className='font-semibold text-slate-700 dark:text-slate-300'>
                            {workspace.members?.length || 0}
                          </span>
                        </div>

                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-slate-600 dark:text-slate-400'>
                            Type
                          </span>
                          <Badge variant='outline' className='capitalize'>
                            {workspace.workspaceType}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='flex items-center gap-2 pt-3 border-t border-slate-200/50 dark:border-slate-700/50'>
                        <Button
                          onClick={() => handleSelectWorkspace(workspace._id)}
                          className='flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all'
                        >
                          Open
                          <ArrowRight className='h-4 w-4 ml-1' />
                        </Button>

                        <Button
                          variant='outline'
                          size='icon'
                          className='rounded-lg border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400'
                          onClick={e => {
                            e.stopPropagation();
                            // TODO: Implement edit functionality
                          }}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>

                        <Button
                          variant='outline'
                          size='icon'
                          className='rounded-lg border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400'
                          onClick={e => {
                            e.stopPropagation();
                            setWorkspaceToDelete(workspace._id);
                          }}
                        >
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* Add Workspace Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: workspaces.length * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card
                className='h-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer group overflow-hidden'
                onClick={() => setIsCreateModalOpen(true)}
              >
                <CardContent className='flex flex-col items-center justify-center h-full min-h-[280px] p-6'>
                  <motion.div
                    className='mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 group-hover:shadow-xl transition-shadow'
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Plus className='h-8 w-8 text-white' />
                  </motion.div>
                  <h3 className='text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1'>
                    Create Workspace
                  </h3>
                  <p className='text-sm text-slate-500 dark:text-slate-400 text-center'>
                    Start a new workspace for your projects
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerContainer>
        )}
      </div>

      {/* Modals */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!workspaceToDelete}
        onOpenChange={() => setWorkspaceToDelete(null)}
      >
        <AlertDialogContent className='rounded-2xl'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-xl font-bold'>
              Delete Workspace
            </AlertDialogTitle>
            <AlertDialogDescription className='text-slate-600 dark:text-slate-400'>
              Are you sure you want to delete this workspace? This action cannot
              be undone and will delete all spaces, lists, and tasks within it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='rounded-lg'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorkspace}
              className='rounded-lg bg-red-500 hover:bg-red-600 text-white'
            >
              Delete Workspace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkspacePage;
