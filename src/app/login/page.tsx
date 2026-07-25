"use client"
import React, { use, useEffect, useState } from 'react'
import type { FormEventHandler, ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { baseUrL } from '@/env/URLs';
import { loginSuccess } from '@/redux/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { errorToast } from '@/hooks/UseToast';
import 'react-toastify/dist/ReactToastify.css';
import './page.css';
import { useAppSelector } from '@/redux/store';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { json } from 'stream/consumers';

type LoginForm = {
  email: string
  password: string
}

const LoginPage = () => {
  const initialState: LoginForm = {
    email: "",
    password: "",
  };

  const [authDetails, setAuthDetails] = useState(initialState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const loginUrl = `${baseUrL}/customer-login`;
  const router = useRouter();
  
  const  { setValue: setStoredValue } = useLocalStorage("userDetails", null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePost();
    console.log('Form values', authDetails);
  }

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setAuthDetails({
      ...authDetails,
      [evt.target.name]: value
    });
  }

  const handlePost = async () => {
    // Validate form
    if (!authDetails.email || !authDetails.password) {
      errorToast('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const apiResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authDetails)
      })

      let apiResponseData: any = await apiResponse.json();
      console.log({apiResponseData});

    if (apiResponse.ok) {
      // Normalize user data: handle both wrapped (ILoginResponse) and direct (IUserData) formats
      const userData = apiResponseData.data || apiResponseData;

      const normalizedUserData = {
        ...userData,
        accessToken: userData.accessToken || userData.access_token,
        refreshToken: userData.refreshToken || userData.refresh_token,
      };

      const transformedUserDetails = {
        access_token: normalizedUserData.accessToken,
        refresh_token: normalizedUserData.refreshToken,
        permissions: [],
        roles: [normalizedUserData.role]
      };

      console.log("Transformed user details:", transformedUserDetails);
      dispatch(loginSuccess(transformedUserDetails));

      // Store normalized user data in localStorage for navbar/jwtHooks
      setStoredValue(normalizedUserData);

      // Store in role-specific key for dashboard hooks
      if (typeof window !== 'undefined') {
        const isVendor = normalizedUserData.role?.toUpperCase() === 'VENDOR' || normalizedUserData.role?.toUpperCase() === 'ROLE_VENDOR';
        const storageKey = isVendor ? 'tailorDetails' : 'customerDetails';
        localStorage.setItem(storageKey, JSON.stringify(normalizedUserData));
        // Also keep userDetails for compatibility
        localStorage.setItem('userDetails', JSON.stringify(normalizedUserData));
      }

      // Notify other components/tabs that user details have been updated
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent("userDetailsUpdated", { detail: normalizedUserData }));
      }

      // Redirect all users to home page
      window.location.href = "/";
      return;
 
      } else {
        errorToast(apiResponseData.error || apiResponseData.message || 'Error Login in');
      }

    } catch (e) {
      console.log(e);
      errorToast('Unable to login');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex h-screen w-full">
        {/* Left side - brand */}
        <div className="hidden lg:flex lg:w-1/2 bg-brand-gradient items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-display font-bold mb-4 gradient-text-light">Stitch</h2>
            <p className="text-white/80 text-sm">Fashion tailored for you.</p>
          </div>
        </div>

        {/* Right side - form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-surface-50">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-elegant p-6">
            <div className="mb-6 text-center">
              <h1 className="text-xl font-display font-bold text-surface-900">Login</h1>
              <p className="text-xs text-surface-500 mt-1">Login to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-surface-600 mb-1">Your email</label>
                <input
                  className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                  type="email"
                  id="email"
                  name="email"
                  value={authDetails.email}
                  onChange={handleChange}
                  placeholder="Email Address" 
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-surface-600 mb-1">Your password</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none pr-10"
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={authDetails.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  <div
                    onClick={handleTogglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-700 cursor-pointer"
                  >
                    {isPasswordVisible ? (
                      <span role="img" aria-label="Hide password">👁️</span>
                    ) : (
                      <span role="img" aria-label="Show password">🙈</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <a href="forgotpassword" className="text-primary-600 text-xs font-medium hover:text-primary-700">Forgot Password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-gradient text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-gradient-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-lg shadow-primary-500/25"
              >
                <span>Sign In</span>
                {isLoading && <span className="spinner"></span>}
              </button>

              <div className="text-center">
                <span className="text-xs text-surface-500">You do not have an account? </span>
                <a href="/email-verification" className="text-primary-600 text-xs font-medium hover:text-primary-700">Create Account</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  // return <LayoutGuest>{page}</LayoutGuest>
}

export default LoginPage
