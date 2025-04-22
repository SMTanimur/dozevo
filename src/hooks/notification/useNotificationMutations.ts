import { notificationService } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess,
  });



  return {
    markAllAsRead: markAllAsReadMutation.mutate,
    markAsRead: markAsReadMutation.mutate,

    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isMarkingAsRead: markAsReadMutation.isPending,

  };
}; 