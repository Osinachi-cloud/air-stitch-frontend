"use client"
import { Sign } from 'crypto';
import './page.css';


import React, { useEffect, useState } from 'react';

const SignUp = () => {
    // State object for form fields
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isVendor: false,
    });

    useEffect(() => {
        // This will only run on the client
        // You can perform any client-specific logic here
    }, []);

    // Handle input change
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e: any) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Log the form data (you can replace this with your API call)
        console.log(userInfo);

        // Here you can call your REST API to submit the form data
        // Example: axios.post('/api/signup', userInfo)
    };

    return (
        <div>
            <div className="flex items-center justify-center min-h-screen ">
                <div className="p-8 rounded-lg max-w-4xl">
                    <h1 className="text-[30px] font-bold text-center mb-1">Create a new account</h1>
                    <p className="text-center text-gray-600 mb-10">Fill in your details & get started!</p>
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center">
                            <span className="mr-2 text-[16px]">As a Vendor</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="isVendor"
                                    checked={userInfo.isVendor}
                                    onChange={handleChange}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="ml-2 text-gray-400">As a Customer</span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
                            <div>
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={userInfo.firstName}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={userInfo.lastName}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
                            <div>
                                <label className="block text-gray-700">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={userInfo.username}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={userInfo.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
                            <div className="relative">
                                <label className="block text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={userInfo.password}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                                <i className="fas fa-eye absolute right-3 top-10 text-gray-400 cursor-pointer"></i>
                                <div className="md:grid-cols-2 gap-4 my-3">
                                    <p className="text-xs text-gray-500">Password should be at least <span className="font-bold">8 Characters</span> and must contain at least a <span className="font-bold">Capital Letter</span>, a <span className="font-bold">Number</span> and a <span className="font-bold">Special Character</span>.</p>
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={userInfo.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                                <i className="fas fa-eye absolute right-3 top-10 text-gray-400 cursor-pointer"></i>
                                <div className="md:grid-cols-2 gap-4 my-3">
                                    <p className="text-xs text-gray-500">Password should be at least <span className="font-bold">8 Characters</span> and must contain at least a <span className="font-bold">Capital Letter</span>, a <span className="font-bold">Number</span> and a <span className="font-bold">Special Character</span>.</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full bg-gray-800 text-white p-2 rounded py-[1rem] mt-[2rem]">Create Account</button>
                    </form>
                    <p className="text-center text-gray-600 mt-4">Have an existing account? <a href="#" className="text-gray-800 font-bold">Sign in</a></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;