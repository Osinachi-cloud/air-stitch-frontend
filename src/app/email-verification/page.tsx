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
import { useFetch } from '@/hooks/useFetch'
import { useLocalStorage } from '@/hooks/useLocalStorage';

type EmailVerificationForm = {
  email: string
}

const EmailVerificationPage = () => {

  const initialState: EmailVerificationForm = {
    email: ""
  };

  const [authDetails, setAuthDetails] = useState(initialState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const loginUrl = `${baseUrL}/verify-email`;
  const router = useRouter();
  
  const { setValue: saveEmailToStorage } = useLocalStorage<string>('email');

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

      let apiResponseData: any = await apiResponse.json();
      console.log(apiResponseData);
      setIsLoading(false);

      if (apiResponse.ok) {
        // Save email to localStorage before redirecting
        saveEmailToStorage(authDetails.email);
        console.log('Email saved to localStorage:', authDetails.email);
        
        router.push('/login');
      } else {
        errorToast(apiResponseData.message);
      }

    } catch (e) {
      console.log(e);
      setIsLoading(false);
      errorToast("Error login in");
    }
  }

  useEffect(() => {
    // Optional: Clear any existing email from localStorage when component mounts
    // This ensures fresh state for new verification
    // localStorage.removeItem('email');
  }, []);

  return (
    <>
      <div className="grid h-[100vh] w-full">
        <form className="sm:w-[28%] w-[90%] mx-auto my-auto" onSubmit={handleSubmit}>
          <div className='mb-[2rem]'>
            <h1 className='text-center text-[#171717] text-[32px] font-[600]'>Email Verification</h1>
            <p className='text-center text-[#53545C] font-[300]'>Verify your Email</p>
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

          <div className='mt-[3rem]'>
            <button
              type="submit"
              disabled={isLoading || !authDetails.email}
              className="w-full flex justify-center gap-6 text-white bg-[#37393f] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-3.5 text-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span>Sign In</span>
              {
                isLoading && <span className="spinner"></span>
              }
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

EmailVerificationPage.getLayout = function getLayout(page: ReactElement) {
  // return <LayoutGuest>{page}</LayoutGuest>
}

export default EmailVerificationPage