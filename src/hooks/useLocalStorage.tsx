import { User, ILoginResponse, IUserData } from '@/types/user';
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue?: T) => {
  const [value, setValue] = useState<T | undefined>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) as T : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const getUserDetails = (): IUserData | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    const str = window.localStorage.getItem(key);
    if (str != null) {
      return typeof str === 'string' ? JSON.parse(str) : str;
    }
    return null;
  }

  const setStoredValue = (value: any) => {
    try {
      setValue(value);
      if (typeof window === 'undefined') {
        return null; // Return null if running on the server
      }
      window.localStorage.setItem(key, JSON.stringify(value));

    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeStoredValue = () => {
    try {
      setValue(undefined);
      if (typeof window === 'undefined') {
        return null; // Return null if running on the server
      }
      window.localStorage.removeItem(key);

    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue };
};


export const useEmailFromStorage = (): string | undefined => {
  const { value: email } = useLocalStorage<string>('email');
  return email;
};
