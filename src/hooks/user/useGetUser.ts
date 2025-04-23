import { userService } from "@/services";
import { IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch a specific user by their ID.
 * Uses userService.getUserById.name as part of the query key.
 * @param userId - The ID of the user to fetch.
 * @param options - Optional React Query query options.
 */
export const useGetUser = (userId: string, options?: { enabled?: boolean }) => {
  return useQuery<IUser, Error>({
    // Use function name and ID for the query key
    queryKey: [userService.getUserById.name, userId],
    queryFn: () => userService.getUserById(userId),
    // Ensure userId is provided and respect enabled option
    enabled: !!userId && (options?.enabled !== undefined ? options.enabled : true),
  });
}; 