
import { apiClient } from './api';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

interface LoginCredentials {
  code: string;
  redirectUri: string;
}

/**
 * Service for handling authentication operations
 */
export const authService = {
  /**
   * Exchange OAuth2 code for tokens
   */
  async exchangeCodeForToken(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/oauth/token', credentials);
  },
  
  /**
   * Get the OAuth2 authorization URL
   */
  getAuthorizationUrl(redirectUri: string, state: string): string {
    const authUrl = import.meta.env.VITE_OAUTH_URL || 'https://auth.example.com/oauth/authorize';
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID || 'client_id';
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      scope: 'openid profile email',
    });
    
    return `${authUrl}?${params.toString()}`;
  },
  
  /**
   * Log out the user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the server-side logout fails, we still want to clear the local state
    }
  }
};
