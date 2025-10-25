"use client"

import { baseUrL } from '@/env/URLs';
import { useEmailFromStorage } from '@/hooks/useLocalStorage';
import { useRouter } from 'next/navigation'
import { useState, useRef, FormEvent, ChangeEvent, KeyboardEvent } from 'react';

interface VerifyOTPResponse {
  message: string;
  success: boolean;
}

const VerifyOTP = () => {
    const [otp, setOtp] = useState<string>('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const [message, setMessage] = useState<string>('');
    const email = useEmailFromStorage();
    const loginUrl = `${baseUrL}/validateEmailCode`;
    const router = useRouter();


    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
        const value = e.target.value;

        // Allow only numbers
        if (!/^\d*$/.test(value)) {
            return;
        }

        const newOtp = inputRefs.current.map((input, i) => 
            i === index ? value : input?.value || ''
        ).join('');
        setOtp(newOtp);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
        if (e.key === 'Backspace' && !inputRefs.current[index]?.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (!email) {
            setMessage('Email not found. Please try again.');
            return;
        }

        if (otp.length !== 5) {
            setMessage('Please enter the complete 5-digit OTP.');
            return;
        }

        try {
            const res = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({verificationCode: otp, email }),
            });

            const data: VerifyOTPResponse = await res.json();
            setMessage(data.message);
            router.push('/signup');

        } catch (error) {
            console.error('Error verifying OTP:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Verify OTP</h1>
            <p className='font-light'>Enter the verification code we just sent to your email address</p>
            {email && <p className='font-light text-sm mt-2'>Sent to: {email}</p>}
            <form onSubmit={handleVerify} className="flex flex-col items-center py-[2rem] w-[25%]">
                <div className="flex space-x-2 mb-10 gap-[2rem]">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-[4rem] h-[4rem] text-center border border-gray-300 rounded-lg"
                        />
                    ))}
                </div>
                <button 
                    type="submit" 
                    className="bg-black text-white px-4 py-[1rem] rounded-lg w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!email || otp.length !== 5}
                >
                    Verify OTP
                </button>
                <p className='py-[1rem]'>
                    <span>Did not receive code? </span>
                    <a href="" className='font-light'>Resend</a>
                </p>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
};

export default VerifyOTP;