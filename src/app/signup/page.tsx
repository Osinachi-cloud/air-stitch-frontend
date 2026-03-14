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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-xl overflow-hidden border border-gray-200">
                {/* Header with decorative element */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-1.5"></div>
                
                <div className="p-6 md:p-8">
                    {/* Header Text */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Create Account</h1>
                        <p className="text-sm text-gray-500">Join us today! Fill in your details to get started.</p>
                    </div>

                    {/* Vendor/Customer Toggle */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 p-1 rounded-full inline-flex items-center border border-gray-200">
                            <span className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${!userInfo.isVendor ? 'bg-white text-gray-800' : 'text-gray-500'}`}>
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
                                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-gray-800 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                            <span className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${userInfo.isVendor ? 'bg-white text-gray-800' : 'text-gray-500'}`}>
                                Vendor
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First Row - Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="John"
                                    value={userInfo.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Doe"
                                    value={userInfo.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 outline-none"
                                />
                            </div>
                        </div>

                        {/* Second Row - Username & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="@johndoe"
                                    value={userInfo.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={userInfo.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 outline-none"
                                />
                            </div>
                        </div>

                        {/* Third Row - Password & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••"
                                        value={userInfo.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 text-xs"
                                    >
                                        {isPasswordVisible ? '🔓' : '🔒'}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    Min. 8 chars with <span className="font-medium text-gray-700">uppercase</span>, <span className="font-medium text-gray-700">number</span> & <span className="font-medium text-gray-700">special char</span>
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="+1 234 567 8900"
                                    value={userInfo.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 outline-none"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:from-gray-900 hover:to-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 border border-gray-700"
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
                    <p className="text-center text-gray-500 mt-4 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gray-800 font-semibold hover:text-gray-600 underline-offset-2 hover:underline transition-all duration-300">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;