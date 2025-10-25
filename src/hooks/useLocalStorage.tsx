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

  const setStoredValue = (value: T) => {
    try {
      setValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeStoredValue = () => {
    try {
      setValue(undefined);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return { value, setValue: setStoredValue, removeValue: removeStoredValue };
};


export const useEmailFromStorage = (): string | undefined => {
  const { value: email } = useLocalStorage<string>('email');
  return email;
};
