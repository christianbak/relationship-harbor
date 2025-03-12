
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

/**
 * Base API client with interceptors for authentication and error handling
 */
class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return headers;
  }
  
  private async handleResponse<T>(response: Response): Promise<T> {
    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      // Handle 401 Unauthorized - trigger token refresh or logout
      if (response.status === 401) {
        // Try to refresh the token if we have a refresh token
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          try {
            const newToken = await this.refreshAccessToken(refreshToken);
            if (newToken) {
              useAuthStore.getState().updateToken(newToken);
              // Retry the original request with the new token
              const retryResponse = await fetch(response.url, {
                ...response,
                headers: this.getHeaders(),
              });
              return this.handleResponse<T>(retryResponse);
            }
          } catch (error) {
            // If refresh fails, logout
            useAuthStore.getState().logout();
            throw new Error('Your session has expired. Please log in again.');
          }
        }
        
        // If we don't have a refresh token, logout
        useAuthStore.getState().logout();
        throw new Error('Authentication required. Please log in.');
      }
      
      // Try to parse error message from the response
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = 
        errorData.message || 
        errorData.error || 
        `API Error: ${response.status} ${response.statusText}`;
      
      throw new Error(errorMessage);
    }
    
    // For 204 No Content
    if (response.status === 204) {
      return {} as T;
    }
    
    // Parse JSON response
    return await response.json();
  }
  
  private async refreshAccessToken(refreshToken: string): Promise<string | null> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.accessToken;
  }
  
  // Generic request method
  private async request<T>(
    endpoint: string, 
    method: string = 'GET', 
    data?: unknown
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      return await this.handleResponse<T>(response);
    } catch (error) {
      // Show toast for common errors
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
      throw error;
    }
  }
  
  // HTTP method shortcuts
  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'GET');
  }
  
  public async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, 'POST', data);
  }
  
  public async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, 'PUT', data);
  }
  
  public async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, 'PATCH', data);
  }
  
  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'DELETE');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
