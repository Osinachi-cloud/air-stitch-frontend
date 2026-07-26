"use client"
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { baseUrL } from '@/env/URLs';
// import { getAuthResponse } from '@/redux/features/authSlice';
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

      // dispatch(getAuthResponse (apiResponseData.data))

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
      <div className="flex h-screen w-full">
        {/* Left side - brand */}
        <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/stitch-backg.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-fuchsia-600/80" />
          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 text-center text-white shadow-xl max-w-sm">
            <h2 className="text-4xl font-display font-bold mb-4">Stitch</h2>
            <p className="text-white/80 text-sm">Create a new secure password.</p>
          </div>
        </div>
        </div>

        {/* Right side - form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-surface-50">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-elegant p-6">
            <div className="mb-6 text-center">
              <h1 className="text-xl font-display font-bold text-surface-900">Create new password</h1>
              <p className="text-xs text-surface-500 mt-1">Your new password must be unique from those previously used.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-surface-600 mb-1">Your password</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none pr-10"
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-surface-600 mb-1">Confirm password</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none pr-10"
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={handleChange}
                    placeholder="Confirm Password"
                  />
                  <div
                    onClick={handleToggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-700 cursor-pointer"
                  >
                    {isConfirmPasswordVisible ? (
                      <span role="img" aria-label="Hide password">👁️</span>
                    ) : (
                      <span role="img" aria-label="Show password">🙈</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-gradient text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-gradient-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-lg shadow-primary-500/25"
              >
                <span>Reset Password</span>
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

LoginPage.getLayout = function getLayout(page: ReactElement) {
  // return <LayoutGuest>{page}</LayoutGuest>
}

export default LoginPage
