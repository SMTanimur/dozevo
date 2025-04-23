'use client';

import { useGetMe } from "@/hooks";
import { useEffect } from "react";

import Cookies from 'js-cookie'





export const CheckProvider = ({ children }: { children: React.ReactNode }) => {


    const { data: user } = useGetMe();

    useEffect(() => {
      if (user) {
        // Get the current workspace value from the cookie
        const currentCookieValue = Cookies.get('workspace');
        // Determine the new value based on user data (default to empty string)
        const newWorkspaceValue = user.activeWorkspace || '';
  
        // Only set the cookie if it doesn't exist or the value has changed
        if (currentCookieValue !== newWorkspaceValue) {
          Cookies.set('workspace', newWorkspaceValue, {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          });
          console.log(`Workspace cookie set/updated to: '${newWorkspaceValue}'`);
        }
      }
    }, [user]);
 
  return (
  <div>
    {children}
  </div>
  );
};
