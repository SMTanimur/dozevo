import { cookies } from 'next/headers';

/**
 * Get authentication token from server-side cookies
 * @returns The authentication token or undefined if not found
 */
export async function getServerAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('Authentication')?.value;
  } catch (error) {
    console.error('Failed to get auth token from cookies:', error);
    return undefined;
  }
}

/**
 * Check if user is authenticated on server side
 * @returns true if auth token exists, false otherwise
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const token = await getServerAuthToken();
  return !!token;
}
