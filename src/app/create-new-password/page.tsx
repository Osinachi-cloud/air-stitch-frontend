"use client"
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { baseUrL } from '@/env/URLs';
import { getAuthResponse } from '@/redux/features/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { errorToast } from '@/hooks/UseToast';
import 'react-toastify/dist/ReactToastify.css';
import './page.css';
import { useFetch } from '@/hooks/useFetch'


type LoginForm = {
  password: string
  confirmPassword: string

}

const LoginPage = () => {

  const initialState: LoginForm = {
    password: "",
    confirmPassword:""
  };

  const [authDetails, setAuthDetails] = useState(initialState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // const [isLoading, setIsLoading] = useState(false);
  const loginUrl = `${baseUrL}/admin/auth/login`;
  const router = useRouter();

  const { data: loginResponseData, isLoading, setIsLoading, callApi } = useFetch('POST', authDetails, loginUrl);
  console.log(loginResponseData);
  errorToast(loginResponseData?.message);


  const handleSubmit = (e: any) => {
    e.preventDefault();
    handlePost();
    console.log({ loginResponseData });



    // window.location.replace("/dashboard")
    console.log('Form values', authDetails);
  }

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  const handleChange = (evt: any) => {
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
        router.push('/admin');
      } else {
        errorToast(apiResponseData.message);
      }

      dispatch(getAuthResponse(apiResponseData.data))

    } catch (e) {
      console.log(e);
      setIsLoading(false);

      errorToast("Error login in");
    }
  }

  useEffect(() => {

  }, []);



  return (
    <>
      <div className="grid h-[100vh] w-full">
        <form className="sm:w-[28%] w-[90%] mx-auto my-auto" onSubmit={handleSubmit}>
          <div className='mb-[2rem]'>
            <h1 className='text-center text-[#171717] text-[32px] font-[600]'>Create new password</h1>
            <p className='text-center text-[#53545C] text-[14px] font-[300] mx-[1rem]'>Your new password must be unique from those previously used.</p>

          </div>

          <div className="my-[1rem]">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <div className="flex w-[100%] items-center border rounded-lg">
              <input
                className=" text-gray-900 bg-[#fff] text-sm rounded-lg outline-none block p-2.5 py-3.5 w-[95%]"
                type={isPasswordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Password"
              />

              <div
                // type="button"
                onClick={handleTogglePasswordVisibility}
                className=" h-[50px] flex items-center pr-3 w-[5%] cursor-pointer"
              >
                {isPasswordVisible ? (
                  <span role="img" aria-label="Hide password">👁️</span> // Replace with your icon
                ) : (
                  <span role="img" aria-label="Show password">🙈</span> // Replace with your icon
                )}
              </div>
            </div>

          </div>


          <div className="mb-[1rem]">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
            <div className="flex w-[100%] items-center border rounded-lg ">
              <input
                className=" text-gray-900 bg-[#fff] text-sm rounded-lg outline-none block p-2.5 py-3.5 w-[95%]"
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Confirm Password"
              />

              <div
                // type="button"
                onClick={handleToggleConfirmPasswordVisibility}
                className=" h-[50px] flex items-center pr-3 w-[5%] cursor-pointer"
              >
                {isConfirmPasswordVisible ? (
                  <span role="img" aria-label="Hide password">👁️</span> // Replace with your icon
                ) : (
                  <span role="img" aria-label="Show password">🙈</span> // Replace with your icon
                )}
              </div>
            </div>

          </div>

          <div className='mt-[3rem]'>

            <button
              type="submit"
              disabled={isLoading}
              // onClick={(e) => { handleSubmit(e);  console.log("test")}}

              className="w-full flex justify-center gap-6 text-white bg-[#37393f] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-3.5 text-center">
              <span>Reset Password</span>
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

LoginPage.getLayout = function getLayout(page: ReactElement) {
  // return <LayoutGuest>{page}</LayoutGuest>
}

export default LoginPage
