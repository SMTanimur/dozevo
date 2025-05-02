import { userService } from '@/services';
import Cookies from 'js-cookie';
import { IUser } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGetMe = () => {
  const authToken = Cookies.get('Authentication');

  return useQuery<IUser, Error>({
    queryKey: [userService.getMyProfile.name],
    queryFn: () => userService.getMyProfile(),
    enabled: !!authToken,
  });
};
