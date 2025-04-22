import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '@/services';
import { UpdateActiveWorkspaceDto, IUser } from '@/types';
import { z } from 'zod';
import { updateUserSchema } from '@/validations';

// Infer type directly from the schema
type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Hook for User Mutations (Update Profile, Update Active Workspace)
export const useUserMutations = () => {
  const queryClient = useQueryClient();

  // Mutation for updating the current user's profile
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation<{
    message: string
  }, Error, UpdateUserInput>({
    // Mutation key can be the function name
    mutationKey: [userService.updateMyProfile.name],
    mutationFn: (data: UpdateUserInput) => userService.updateMyProfile(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Profile updated successfully!');
      // Invalidate the getMyProfile query using its function name
      queryClient.invalidateQueries({ queryKey: [userService.getMyProfile.name] });
      // If profile updates affect individual user gets, invalidate those too
      // queryClient.invalidateQueries({ queryKey: [userService.getUserById.name, variables.id] }); // Example if ID was part of variables
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile.');
    },
  });

  // Mutation for updating the user's active workspace
  const {
    mutate: updateActiveWorkspace,
    isPending: isUpdatingActiveWorkspace,
  } = useMutation<IUser, Error, UpdateActiveWorkspaceDto>({
    // Mutation key can be the function name
    mutationKey: [userService.updateActiveWorkspace.name],
    mutationFn: (data: UpdateActiveWorkspaceDto) =>
      userService.updateActiveWorkspace(data),
    onSuccess: (updatedUser) => {
      toast.success(`Active workspace updated successfully`);
      // Update the getMyProfile query data in the cache
      queryClient.setQueryData([userService.getMyProfile.name], updatedUser);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update active workspace.');
    },
  });

  return {
    updateProfile,
    isUpdatingProfile,
    updateActiveWorkspace,
    isUpdatingActiveWorkspace,
  };
}; 