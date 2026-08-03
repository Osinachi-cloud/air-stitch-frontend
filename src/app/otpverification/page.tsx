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
            console.log('OTP verify response:', { status: res.status, ok: res.ok, data });
            setMessage(data.message);

            if (res.ok && data.success !== false) {
                router.push('/signup');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex h-screen w-full">
            {/* Left side - brand */}
            <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/stitch-backg.png')" }} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#164377]/80 via-[#1e5fa3]/80 to-[#2671c4]/80" />
                <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 text-center text-white shadow-xl max-w-sm">
                    <h2 className="text-4xl font-display font-bold mb-4">Stitch</h2>
                    <p className="text-white/80 text-sm">Verify your identity.</p>
                </div>
            </div>

            {/* Right side - form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-surface-50">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-elegant p-6">
                    <div className="text-center mb-8">
                        <h1 className="text-xl font-display font-bold text-surface-900">Verify OTP</h1>
                        <p className="text-xs text-surface-500 mt-1">Enter the verification code we sent to your email address</p>
                        {email && (
                            <p className="text-xs text-surface-500 mt-3">
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
                                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-surface-300 rounded-lg focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={!isOtpComplete || !email}
                            className={`w-full py-3 rounded-xl font-medium transition-all ${
                                isOtpComplete && email
                                    ? 'bg-[#164377] text-white hover:bg-[#123661] cursor-pointer shadow-lg shadow-primary-500/25'
                                    : 'bg-surface-200 text-surface-500 cursor-not-allowed'
                            }`}
                        >
                            Verify OTP
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-surface-600">
                                Did not receive code?
                                <a href="" className="ml-1 text-primary-600 hover:underline font-medium">
                                    Resend
                                </a>
                            </p>
                        </div>
                    </form>

                    {message && (
                        <div className={`mt-6 p-3 rounded-xl text-center text-sm ${
                            message.includes('error') || message.includes('not') || message.includes('occurred')
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : 'bg-green-50 text-green-600 border border-green-200'
                        }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;