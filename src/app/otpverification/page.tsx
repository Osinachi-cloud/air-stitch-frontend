"use client"

import { useState, useRef } from 'react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState<string>('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null)); // Adjust length as needed
    const [message, setMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        // Allow only numbers
        if (!/^\d*$/.test(value)) {
            return;
        }

        // Update the OTP value
        const newOtp = inputRefs.current.map((input, i) => (i === index ? value : input?.value)).join('');
        setOtp(newOtp);

        // Move focus to the next input
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Move focus to the previous input on backspace
        if (e.key === 'Backspace' && !inputRefs.current[index]?.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        // Call your API to verify the OTP
        const res = await fetch('/api/verifyOTP', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ otp }),
        });

        const data = await res.json();
        setMessage(data.message); // Handle the response as needed
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Verify OTP</h1>
            <p className='font-light'>Enter the verification code we just sent to your email address</p>
            <form onSubmit={handleVerify} className="flex flex-col items-center py-[2rem] w-[25%]">
                <div className="flex space-x-2 mb-10 gap-[2rem]">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={(el: any) => (inputRefs.current[index] = el)}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-[4rem] h-[4rem] text-center border border-gray-300 rounded-lg"
                        />
                    ))}
                </div>
                <button type="submit" className="bg-black text-white px-4 py-[1rem] rounded-lg w-full">
                    Verify OTP
                </button>
                <p className='py-[1rem]'>
                    <span>Did not received code? </span>
                    <a href="" className='font-light'>Resend</a>
                </p>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
};

export default VerifyOTP;
