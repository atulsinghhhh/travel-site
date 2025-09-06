"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OTPVerification from "@/components/auth/OTPVerification";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to send OTP");
      } else {
        setShowOTPVerification(true);
        setSuccessMsg("OTP sent to your email!");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailVerified) {
      setErrorMsg("Please verify your email first");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong");
      } else {
        setSuccessMsg("Signup successful! Redirecting...");
      }
      router.push("/");
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerificationSuccess = () => {
    setEmailVerified(true);
    setShowOTPVerification(false);
    setSuccessMsg("Email verified! You can now complete your registration.");
  };

  const handleBackToSignup = () => {
    setShowOTPVerification(false);
    setEmailVerified(false);
    setErrorMsg("");
    setSuccessMsg("");
  };

  if (showOTPVerification) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <OTPVerification
          email={form.email}
          onVerificationSuccess={handleOTPVerificationSuccess}
          onBack={handleBackToSignup}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <Input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <div className="relative">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {emailVerified && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-green-500 text-sm text-center">{successMsg}</p>
          )}

          {!emailVerified ? (
            <Button
              type="button"
              onClick={handleSendOTP}
              disabled={loading || !form.email}
              className="w-full font-semibold"
            >
              {loading ? "Sending OTP..." : "Send Verification Code"}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold"
            >
              {loading ? "Signing up..." : "Complete Sign Up"}
            </Button>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
