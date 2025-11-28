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
import { useFetch } from '@/hooks/useFetch'

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
  const dispatch = useDispatch<AppDispatch>();
  
  const loginUrl = `${baseUrL}/request-password-reset`;
  const confirmRequestUrl = `${baseUrL}/validate-reset-code`;
  const router = useRouter();

  const { data: loginResponseData, isLoading, setIsLoading, callApi } = useFetch('POST', authDetails, loginUrl);
  console.log(loginResponseData);
  errorToast(loginResponseData?.message);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePost();
    console.log({ loginResponseData });
    console.log('Form values', authDetails);
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

      let apiResponseData: any = await apiResponse.json();
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
        errorToast(apiResponseData.error || 'Something went wrong');
      }

    } catch (e) {
      console.log(e);
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
      <div className="grid h-[100vh] w-full">
        <form className="sm:w-[28%] w-[90%] mx-auto my-auto" onSubmit={handleSubmit}>
          <div className='mb-[2rem]'>
            <h1 className='text-center text-[#171717] text-[32px] font-[600]'>
              {isOtpSent ? 'Reset Password' : 'Forgot Password?'}
            </h1>
            <p className='text-center text-[#53545C] text-[14px] font-[300] mx-[2rem]'>
              {isOtpSent 
                ? 'Enter the OTP sent to your email and your new password' 
                : 'Please enter your email and a link will be sent to your mail to reset your password.'
              }
            </p>
          </div>

          {/* Email Field - Always Visible */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your email
            </label>
            <div className="my-[1.5rem] flex w-[100%] items-center border border-gray-300 rounded-lg">
              <input
                className="text-gray-900 bg-[#fff] text-sm rounded-lg block w-full p-2.5 py-3.5"
                type="email"
                id="email"
                name="email"
                value={authDetails.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />
            </div>
          </div>

          {/* OTP Field - Only when OTP is sent */}
          {isOtpSent && (
            <div>
              <label htmlFor="resetCode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                OTP Code
              </label>
              <div className="my-[1.5rem] flex w-[100%] items-center border border-gray-300 rounded-lg">
                <input
                  className="text-gray-900 bg-[#fff] text-sm rounded-lg block w-full p-2.5 py-3.5"
                  type="text"
                  id="resetCode"
                  name="resetCode"
                  value={authDetails.resetCode}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  required
                />
              </div>
            </div>
          )}

          {/* Password Fields - Only when OTP is sent */}
          {isOtpSent && (
            <>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  New Password
                </label>
                <div className="my-[1.5rem] flex w-[100%] items-center border border-gray-300 rounded-lg">
                  <input
                    className="text-gray-900 bg-[#fff] text-sm rounded-lg block w-full p-2.5 py-3.5"
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={authDetails.password}
                    onChange={handleChange}
                    placeholder="New Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    className="px-3 text-gray-600"
                  >
                    {isPasswordVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm Password
                </label>
                <div className="my-[1.5rem] flex w-[100%] items-center border border-gray-300 rounded-lg">
                  <input
                    className="text-gray-900 bg-[#fff] text-sm rounded-lg block w-full p-2.5 py-3.5"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={authDetails.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleToggleConfirmPasswordVisibility}
                    className="px-3 text-gray-600"
                  >
                    {isConfirmPasswordVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
                {authDetails.password !== authDetails.confirmPassword && authDetails.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                )}
              </div>
            </>
          )}

          <div className='mt-[3rem]'>
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full flex justify-center gap-6 text-white bg-[#37393f] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-3.5 text-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span>
                {isOtpSent ? 'Reset Password' : 'Send OTP'}
              </span>
              {isLoading && <span className="spinner"></span>}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
  // return <LayoutGuest>{page}</LayoutGuest>
}

export default ForgotPasswordPage