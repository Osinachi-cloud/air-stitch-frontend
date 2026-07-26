"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { baseUrL } from '@/env/URLs';
import { errorToast, successToast } from '@/hooks/UseToast';
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './page.css';
import Link from 'next/link';

const SignUp = () => {
    const router = useRouter();
    
    // State object for form fields
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        isVendor: false,
    });

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // API configuration
    const signupUrl = `${baseUrL}/create-customer`;

    // Handle input change
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("Submitting form with data:", userInfo);

        // Basic validation
        if (userInfo.password.length < 8) {
            errorToast("Password must be at least 8 characters long");
            return;
        }

        const { ...signupData } = userInfo;

        try {
            setIsLoading(true);
            console.log('Making API call to:', signupUrl);
            console.log('With data:', signupData);

            const apiResponse = await fetch(signupUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData)
            });

            const apiResponseData = await apiResponse.json();
            console.log('Signup response:', apiResponseData);

            if (apiResponse.ok) {
                successToast('Account created successfully!');
                // Wait a bit for the toast to show before redirecting
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                // Check for error field in response
                const errorMessage = apiResponseData.error || apiResponseData.message || 'Signup failed';
                errorToast(errorMessage);
            }
        } catch (error) {
            console.error('Signup error:', error);
            errorToast("Error creating account. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left side - brand */}
            <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center p-12 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/stitch-backg.png')" }} />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-fuchsia-600/80" />
              <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 text-center text-white shadow-xl max-w-sm">
                <h2 className="text-4xl font-display font-bold mb-4">Stitch</h2>
                <p className="text-white/80 text-sm">Create your account to get started.</p>
              </div>
            </div>

            {/* Right side - form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-surface-50 overflow-y-auto">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-elegant p-6">
                    <div className="mb-6 text-center">
                        <h1 className="text-xl font-display font-bold text-surface-900">Create Account</h1>
                        <p className="text-xs text-surface-500 mt-1">Join us today! Fill in your details to get started.</p>
                    </div>

                    {/* Vendor/Customer Toggle */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-surface-100 p-1 rounded-full inline-flex items-center border border-surface-200">
                            <span className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${!userInfo.isVendor ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-500'}`}>
                                Customer
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer mx-2">
                                <input
                                    type="checkbox"
                                    name="isVendor"
                                    checked={userInfo.isVendor}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-surface-300 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                            <span className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${userInfo.isVendor ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-500'}`}>
                                Vendor
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First Row - Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="John"
                                    value={userInfo.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Doe"
                                    value={userInfo.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                                />
                            </div>
                        </div>

                        {/* Second Row - Username & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="@johndoe"
                                    value={userInfo.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john.doe@gmail.com"
                                    value={userInfo.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                                />
                            </div>
                        </div>

                        {/* Third Row - Password & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••"
                                        value={userInfo.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-700 transition-colors duration-300 text-xs"
                                    >
                                        {isPasswordVisible ? (
                                            <span role="img" aria-label="Hide password">👁️</span>
                                        ) : (
                                            <span role="img" aria-label="Show password">🙈</span>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-surface-500 mt-1.5 leading-relaxed">
                                    Min. 8 chars with <span className="font-medium text-surface-700">uppercase</span>, <span className="font-medium text-surface-700">number</span> & <span className="font-medium text-surface-700">special char</span>
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="08012345678"
                                    value={userInfo.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm bg-white text-surface-900 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-brand-gradient text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-gradient-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center text-surface-500 mt-4 text-xs">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary-600 font-medium hover:text-primary-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
