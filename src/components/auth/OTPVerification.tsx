"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OTPVerificationProps {
    email: string;
    onVerificationSuccess: () => void;
    onBack: () => void;
}

export default function OTPVerification({
    email,
    onVerificationSuccess,
    onBack
}: OTPVerificationProps) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);


    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
        setErrorMsg("");
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setErrorMsg("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || "Invalid OTP");
            } else {
                setSuccessMsg("Email verified successfully!");
                setTimeout(() => onVerificationSuccess(), 1500);
            }
        } catch (error) {
            setErrorMsg("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || "Failed to resend OTP");
            } else {
                setSuccessMsg("OTP sent successfully!");
                setTimeLeft(600);
                setCanResend(false);
                setOtp("");
            }
        } catch (error) {
            setErrorMsg("Network error. Please try again.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Verify Your Email
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    We've sent a 6-digit code to
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {email}
                </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter Verification Code
                    </label>
                    <Input
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="000000"
                        className="text-center text-2xl tracking-widest font-mono"
                        maxLength={6}
                        required
                    />
                </div>

                {errorMsg && (
                    <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                )}
                {successMsg && (
                    <p className="text-green-500 text-sm text-center">{successMsg}</p>
                )}

                <Button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full font-semibold"
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </Button>
            </form>

            <div className="mt-6 text-center">
                {timeLeft > 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Resend code in {formatTime(timeLeft)}
                    </p>
                ) : (
                    <Button
                        variant="outline"
                        onClick={handleResendOTP}
                        disabled={resendLoading}
                        className="w-full"
                    >
                        {resendLoading ? "Sending..." : "Resend Code"}
                    </Button>
                )}
            </div>

            <div className="mt-4 text-center">
                <button
                    onClick={onBack}
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Back to signup
                </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
                    <strong>Didn't receive the code?</strong> Check your spam folder or try resending.
                </p>
            </div>
        </div>
    );
}
