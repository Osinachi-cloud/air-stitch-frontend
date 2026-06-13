// hooks/useJwt.ts
import { jwtDecode } from 'jwt-decode';
import { useLocalStorage } from './useLocalStorage';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { isPublicRoute } from '@/app/config/publicRoutes';

interface DecodedToken {
  exp: number;
  iat: number;
  sub?: string;
  email?: string;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + 5;
  } catch (error) {
    return true;
  }
};

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { getUserDetails, removeValue } = useLocalStorage("userDetails", null);
  const redirectInProgress = useRef(false);
  const checkIntervalRef = useRef<NodeJS.Timeout>();

  // Check if current route is public
  const isPublicPage = useCallback(() => {
    return isPublicRoute(pathname);
  }, [pathname]);

  const logout = useCallback((message?: string) => {
    // IMPORTANT: Don't redirect if on public page
    if (isPublicPage()) {
      console.log('On public page, clearing storage only');
      removeValue();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.clear();
      return;
    }

    if (redirectInProgress.current) return;
    
    redirectInProgress.current = true;
    
    removeValue();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
    
    if (message) {
      console.log('Auth:', message);
    }
    
    setTimeout(() => {
      router.push('/login');
      setTimeout(() => {
        redirectInProgress.current = false;
      }, 100);
    }, 0);
  }, [router, removeValue, isPublicPage]);

  const checkTokenAndRedirect = useCallback(() => {
    // SKIP ENTIRE CHECK on public pages
    if (isPublicPage()) {
      console.log('Skipping auth check on public page:', pathname);
      return true; // Return true to allow access
    }

    const userDetails = getUserDetails();
    const token = userDetails?.accessToken;
    
    if (!token || isTokenExpired(token)) {
      logout('Session expired');
      return false;
    }
    
    return true;
  }, [getUserDetails, logout, isPublicPage, pathname]);

  const getValidToken = useCallback((): string | null => {
    // Don't even try to get token on public pages
    if (isPublicPage()) {
      return null;
    }

    const userDetails = getUserDetails();
    const token = userDetails?.accessToken;

    if (!token || isTokenExpired(token)) {
      return null;
    }

    return token;
  }, [getUserDetails, isPublicPage]);

  // Set up automatic token checking - BUT ONLY ON PROTECTED PAGES
  useEffect(() => {
    // Don't set up interval on public pages
    if (isPublicPage()) {
      console.log('Not setting up auth check on public page');
      return;
    }

    console.log('Setting up auth check on protected page');
    
    // Check immediately
    checkTokenAndRedirect();

    // Set up interval
    checkIntervalRef.current = setInterval(() => {
      checkTokenAndRedirect();
    }, 60000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkTokenAndRedirect, isPublicPage]);

  return {
    logout,
    getValidToken,
    checkTokenAndRedirect,
    isTokenExpired
  };
};

