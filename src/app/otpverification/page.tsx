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
    const [otp, setOtp] = useState<string[]>(Array(5).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(5).fill(null));
    const [message, setMessage] = useState<string>('');
    const email = useEmailFromStorage();
    const loginUrl = `${baseUrL}/validateEmailCode`;
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
        const value = e.target.value;

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const otpString = otp.join('');
    const isOtpComplete = otp.every(digit => digit !== '');

    const handleVerify = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (!email) {
            setMessage('Email not found. Please try again.');
            return;
        }

        if (!isOtpComplete) {
            setMessage('Please enter the complete 5-digit OTP.');
            return;
        }

        try {
            const res = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verificationCode: otpString, email }),
            });

            const data: VerifyOTPResponse = await res.json();
            setMessage(data.message);
            if (data.success) {
                router.push('/signup');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-black mb-2">Verify OTP</h1>
                    <p className="text-gray-600">Enter the verification code we sent to your email address</p>
                    {email && (
                        <p className="text-sm text-gray-500 mt-3">
                            Sent to: {email}
                        </p>
                    )}
                </div>

                <form onSubmit={handleVerify} className="flex flex-col items-center">
                    <div className="flex justify-center gap-3 mb-10">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={otp[index]}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-medium transition-all ${
                            isOtpComplete && email
                                ? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isOtpComplete || !email}
                    >
                        Verify OTP
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Did not receive code?
                            <a href="" className="ml-1 text-black hover:underline font-medium">
                                Resend
                            </a>
                        </p>
                    </div>
                </form>

                {message && (
                    <div className={`mt-6 p-3 rounded-lg text-center text-sm ${
                        message.includes('error') || message.includes('not') || message.includes('occurred')
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-green-50 text-green-600 border border-green-200'
                    }`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyOTP;