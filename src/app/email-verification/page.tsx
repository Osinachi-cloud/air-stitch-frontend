"use client"
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { baseUrL } from '@/env/URLs';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { errorToast } from '@/hooks/UseToast';
import 'react-toastify/dist/ReactToastify.css';
import './page.css';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAppSelector } from '@/redux/store';

type EmailVerificationForm = {
  email: string
}

const EmailVerificationPage = () => {
  const initialState: EmailVerificationForm = {
    email: ""
  };

  const [authDetails, setAuthDetails] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const loginUrl = `${baseUrL}/verify-email`;
  const router = useRouter();
  
  const { setValue: saveEmailToStorage } = useLocalStorage<string>('email');
  const token = useAppSelector((state) => state.auth.userDetails).access_token;

  console.log("token ------> ",{token});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePost();
    console.log('Form values', authDetails);
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setAuthDetails({
      ...authDetails,
      [evt.target.name]: value
    });
  }

  const handlePost = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authDetails)
      })

      const apiResponseData = await apiResponse.json();
      console.log(apiResponseData);
      setIsLoading(false);

      if (apiResponse.ok) {
        // Save email to localStorage before redirecting
        saveEmailToStorage(authDetails.email);
        console.log('Email saved to localStorage:', authDetails.email);

        router.push('/otpverification');
      } else {
        errorToast(apiResponseData.message);
      }

    } catch (e) {
      console.log(e);
      setIsLoading(false);
      errorToast("Error verifying email");
    }
  }

  useEffect(() => {
    // Optional: Clear any existing email from localStorage when component mounts
    // This ensures fresh state for new verification
    // localStorage.removeItem('email');
  }, []);

  return (
    <>
      <div className="flex h-screen w-full">
        {/* Left side - brand */}
        <div className="hidden lg:flex lg:w-1/2 bg-brand-gradient items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-display font-bold mb-4 gradient-text-light">Stitch</h2>
            <p className="text-white/80 text-sm">Verify your email address.</p>
          </div>
        </div>

        {/* Right side - form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-surface-50">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-elegant p-6">
            <div className="mb-6 text-center">
              <h1 className="text-xl font-display font-bold text-surface-900">Email Verification</h1>
              <p className="text-xs text-surface-500 mt-1">Verify your Email</p>
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

              <button
                type="submit"
                disabled={isLoading || !authDetails.email}
                className="w-full bg-brand-gradient text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-gradient-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-lg shadow-primary-500/25"
              >
                <span>Verify Email</span>
                {
                  isLoading && <span className="spinner"></span>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

EmailVerificationPage.getLayout = function getLayout(page: ReactElement) {
  // return <LayoutGuest>{page}</LayoutGuest>
}

export default EmailVerificationPage
