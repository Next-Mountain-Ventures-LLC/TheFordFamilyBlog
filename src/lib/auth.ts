// Simple client-side authentication helper functions

interface User {
  username: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) return false;
    
    const auth: AuthState = JSON.parse(authData);
    return auth.isAuthenticated;
  } catch (error) {
    return false;
  }
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) return null;
    
    const auth: AuthState = JSON.parse(authData);
    return auth.user;
  } catch (error) {
    return null;
  }
}

// Logout user
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth');
}

// For Astro middleware - adds a client script to redirect if not authenticated
export const authGuardScript = `
  <script>
    (function() {
      try {
        const authData = localStorage.getItem('auth');
        if (!authData || !JSON.parse(authData).isAuthenticated) {
          window.location.href = '/login';
        }
      } catch (error) {
        window.location.href = '/login';
      }
    })();
  </script>
`;