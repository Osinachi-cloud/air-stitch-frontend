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
  
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const  { value , getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

  useEffect(() => {
    console.log("Updated User Details:" , userDetails);
    console.log("value =======>>>", getUserDetails()?.accessToken);
    if (userDetails && userDetails.access_token) {
      router.push('/');
    }
  }, [userDetails, router]);

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

      setStoredValue(apiResponseData);

    if (apiResponse.ok) {
      const transformedUserDetails = {
        access_token: apiResponseData.accessToken, 
        refresh_token: apiResponseData.refreshToken, 
        permissions: [], 
        roles: [apiResponseData.role] 
      };
      
      console.log("Transformed user details:", transformedUserDetails);
      dispatch(loginSuccess(transformedUserDetails));
 
      } else {
        errorToast(apiResponseData.error || 'Login failed');
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
      <div className="grid h-[100vh] w-full">
        <form className="sm:w-[28%] w-[90%] mx-auto my-auto" onSubmit={handleSubmit}>
          <div className='mb-[2rem]'>
            <h1 className='text-center text-[#171717] text-[32px] font-[600]'>Login</h1>
            <p className='text-center text-[#53545C] font-[300]'>Login to access Admin Dashboard</p>
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <div className="my-[1.5rem] flex w-[100%] items-center border border-gray-300 rounded-lg">
              <input
                className=" text-gray-900 bg-[#fff] text-sm rounded-lg block w-full p-2.5 py-3.5"
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

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <div className="flex w-[100%] items-center border border-gray-300 rounded-lg px-[1rem]">
              <input
                className=" text-gray-900 bg-[#fff] text-sm rounded-lg outline-none block py-3.5 w-[95%]"
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
                className=" h-[50px] flex items-center pr-3 w-[5%] cursor-pointer"
              >
                {isPasswordVisible ? (
                  <span role="img" aria-label="Hide password">👁️</span>
                ) : (
                  <span role="img" aria-label="Show password">🙈</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end m-2">
            <a href="forgotpassword" className="ms-2 text-sm font-medium text-[grey]">Forgot Password?</a>
          </div>

          <div className='mt-[3rem]'>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center gap-6 text-white bg-[#37393f] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-3.5 text-center disabled:bg-gray-400"
            >
              <span>Sign In</span>
              {isLoading && <span className="spinner"></span>}
            </button>
          </div>
          
          <div className='text-center mt-[1rem] text-[14px]'>
            <a href="/signup">You do not have an account? Create Account</a>
          </div>
        </form>
      </div>
    </>
  )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  // return <LayoutGuest>{page}</LayoutGuest>
}

export default LoginPage