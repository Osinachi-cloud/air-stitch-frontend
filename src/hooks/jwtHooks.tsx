// utils/tokenUtils.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  iat: number;
  sub?: string;
  email?: string;
  // add other custom claims
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    
    return decoded.exp < currentTime;
  } catch (error) {
    // Token is invalid or malformed
    return true;
  }
};