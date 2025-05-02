import { api } from '@/api';
import { IUser } from '@/types';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { TCreateUser, TLogin } from '@/validations';

export interface AuthResponse {
  message: string;
  token: string;
  user: IUser;
  userId: string;
}

const API_PATHS = {
  LOGIN: '/v1/auth/login',
  REGISTER: '/v1/auth/register',
};

const COOKIE_NAME = 'Authentication';
const WORKSPACE_COOKIE_NAME = 'Workspace';
const COOKIE_EXPIRATION_DAYS = 7;

export class AuthService {
  private readonly cookieName = COOKIE_NAME;
  private readonly expirationDays = COOKIE_EXPIRATION_DAYS;
  private readonly workspaceCookieName = WORKSPACE_COOKIE_NAME;

  setToken = (token: string) => {
    try {
      const decodedToken = jwtDecode(token);
      Cookies.set(this.cookieName, token, {
        expires: this.expirationDays,
        secure: true,
        sameSite: 'strict',
      });
      return decodedToken;
    } catch (error) {
      console.error('Failed to decode token:', error);
      throw new Error('Invalid token format');
    }
  };

  setWorkspaceToken = (token: string) => {
    Cookies.set(this.workspaceCookieName, token, {
      expires: this.expirationDays,
      secure: true,
      sameSite: 'strict',
    });
  };

  getToken = (): string | null => {
    try {
      return Cookies.get(this.cookieName) || null;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  };

  clearToken = () => {
    try {
      Cookies.remove(this.cookieName);
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  };

  isAuthenticated = (): boolean => {
    try {
      const token = this.getToken();
      if (!token) return false;

      const decodedToken: { exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Failed to check authentication:', error);
      return false;
    }
  };

  login = async (payload: TLogin): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(API_PATHS.LOGIN, payload);
      if (data?.token) {
        this.setToken(data.token);
      }
      if (data?.user.activeWorkspace) {
        this.setWorkspaceToken(data.user.activeWorkspace);
      }
      return data;
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      console.error('Login failed:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  register = async (payload: TCreateUser): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(
        API_PATHS.REGISTER,
        payload
      );

      if (data?.token) {
        this.setToken(data.token);
      }
      return data;
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      console.error('Registration failed:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  logout = async (): Promise<void> => {
    try {
      this.clearToken();
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Logout failed');
    }
  };

  getUserFromToken = (): Partial<IUser> | null => {
    try {
      const token = this.getToken();
      if (!token) return null;

      const decodedToken: { user?: Partial<IUser> } = jwtDecode(token);
      return decodedToken.user || null;
    } catch (error) {
      console.error('Failed to get user from token:', error);
      return null;
    }
  };
}

// Export a singleton instance for easy usage
export const authService = new AuthService();
