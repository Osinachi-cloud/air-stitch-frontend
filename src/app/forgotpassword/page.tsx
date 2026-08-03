"use client"
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { baseUrL } from '@/env/URLs';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { errorToast, successToast } from '@/hooks/UseToast';
import 'react-toastify/dist/ReactToastify.css';
import './page.css';

type ForgotPasswordPageForm = {
  email: string;
  resetCode: string;
  password: string;
  confirmPassword: string;
}

const ForgotPasswordPage = () => {
  const initialState: ForgotPasswordPageForm = {
    email: "",
    resetCode: "",
    password: "",
    confirmPassword: ""
  };

  const [authDetails, setAuthDetails] = useState(initialState);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  const loginUrl = `${baseUrL}/request-password-reset`;
  const confirmRequestUrl = `${baseUrL}/validate-reset-code`;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      errorToast("Please fill in all required fields correctly");
      return;
    }

    await handlePost();
  }

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

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
      // Determine which URL and request body to use based on OTP state
      const url = isOtpSent ? confirmRequestUrl : loginUrl;
      
      // Prepare request body based on OTP state
      let requestBody: any;
      if (isOtpSent) {
        // Include all 4 fields when OTP is sent
        requestBody = {
          email: authDetails.email,
          resetCode: authDetails.resetCode,
          password: authDetails.password,
          confirmPassword: authDetails.confirmPassword
        };
      } else {
        // Include only email when requesting OTP
        requestBody = {
          email: authDetails.email
        };
      }

      const apiResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const apiResponseData = await apiResponse.json();
      console.log(apiResponseData);
      setIsLoading(false);

      if (apiResponse.ok) {
        if (!isOtpSent) {
          // First call - OTP was sent successfully
          setIsOtpSent(true);
          successToast(apiResponseData.message || 'OTP sent to your email');
        } else {
          // Second call - Password reset successful
          successToast(apiResponseData.message || 'Password reset successful');
          router.push('/login'); // Redirect to login page
        }
      } else {
        errorToast(apiResponseData.error || apiResponseData.message || 'Something went wrong');
      }

    } catch (e) {
      console.error(e);
      setIsLoading(false);
      errorToast("Error processing request");
    }
  }

  // Validate form before submission
  const isFormValid = () => {
    if (!isOtpSent) {
      // Only email is required for OTP request
      return authDetails.email.trim() !== '';
    } else {
      // All fields are required for password reset
      return (
        authDetails.email.trim() !== '' &&
        authDetails.resetCode.trim() !== '' &&
        authDetails.password.trim() !== '' &&
        authDetails.confirmPassword.trim() !== '' &&
        authDetails.password === authDetails.confirmPassword
      );
    }
  }

  useEffect(() => {
    // Optional: Clear OTP fields when email changes
    if (!isOtpSent) {
      setAuthDetails(prev => ({
        ...prev,
        resetCode: "",
        password: "",
        confirmPassword: ""
      }));
    }
  }, [authDetails.email, isOtpSent]);

  return (
    <>
      <div className="flex h-screen w-full">
        {/* Left side - brand */}
        <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/stitch-backg.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#164377]/80 via-[#1e5fa3]/80 to-[#2671c4]/80" />
          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 text-center text-white shadow-xl max-w-sm">
            <h2 className="text-4xl font-display font-bold mb-4">Stitch</h2>
            <p className="text-white/80 text-sm">Reset your password.</p>
          </div>
        </div>

        {/* Right side - form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-surface-50">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-elegant p-6">
            <div className="mb-6 text-center">
              <h1 className="text-xl font-display font-bold text-surface-900">
                {isOtpSent ? 'Reset Password' : 'Forgot Password?'}
              </h1>
              <p className="text-xs text-surface-500 mt-1 mx-4">
                {isOtpSent 
                  ? 'Enter the OTP sent to your email and your new password' 
                  : 'Please enter your email and a link will be sent to your mail to reset your password.'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field - Always Visible */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-surface-600 mb-1">
                  Your email
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                  type="email"
                  id="email"
                  name="email"
                  value={authDetails.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* OTP Field - Only when OTP is sent */}
              {isOtpSent && (
                <div>
                  <label htmlFor="resetCode" className="block text-xs font-medium text-surface-600 mb-1">
                    OTP Code
                  </label>
                  <input
                    className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                    type="text"
                    id="resetCode"
                    name="resetCode"
                    value={authDetails.resetCode}
                    onChange={handleChange}
                    placeholder="Enter OTP"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Password Fields - Only when OTP is sent */}
              {isOtpSent && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-surface-600 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none pr-10"
                        type={isPasswordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        value={authDetails.password}
                        onChange={handleChange}
                        placeholder="New Password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={handleTogglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-700"
                        disabled={isLoading}
                      >
                        {isPasswordVisible ? (
                          <span role="img" aria-label="Hide password">👁️</span>
                        ) : (
                          <span role="img" aria-label="Show password">🙈</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-medium text-surface-600 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none pr-10"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={authDetails.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={handleToggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-700"
                        disabled={isLoading}
                      >
                        {isConfirmPasswordVisible ? (
                          <span role="img" aria-label="Hide password">👁️</span>
                        ) : (
                          <span role="img" aria-label="Show password">🙈</span>
                        )}
                      </button>
                    </div>
                    {authDetails.password !== authDetails.confirmPassword && authDetails.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="w-full bg-[#164377] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#123661] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-lg shadow-primary-500/25"
              >
                <span>
                  {isOtpSent ? 'Reset Password' : 'Send OTP'}
                </span>
                {isLoading && <span className="spinner"></span>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
  // return <LayoutGuest>{page}</LayoutGuest>
}

export default ForgotPasswordPage
