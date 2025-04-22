
import { userService } from "@/services";
import { IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";


export const useGetMe = () => {
  return useQuery<IUser, Error>({
    queryKey: [userService.getMyProfile.name],
    queryFn: () => userService.getMyProfile(),
  });
};
