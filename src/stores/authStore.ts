
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  // Actions
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateToken: (accessToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      
      login: (accessToken, refreshToken, user) => 
        set(() => ({ 
          isAuthenticated: true, 
          accessToken, 
          refreshToken, 
          user 
        })),
      
      logout: () => 
        set(() => ({ 
          isAuthenticated: false, 
          user: null, 
          accessToken: null, 
          refreshToken: null 
        })),
      
      updateUser: (updatedUser) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, ...updatedUser } : null 
        })),
      
      updateToken: (accessToken) => 
        set(() => ({ accessToken })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken 
      }),
    }
  )
);
