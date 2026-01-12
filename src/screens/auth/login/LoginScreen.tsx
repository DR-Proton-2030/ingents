/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  LockIcon,
  LoaderIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AuthHeader from "@/components/screens/auth/AuthHeader";
import { motion } from "framer-motion";
import Logo from "@/components/shared/logo/Logo";
import AuthContext from "@/contexts/authContext/authContext";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "1234",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSetupPassword, setShowSetupPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors for changed fields
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setApiError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  setApiError(null);
  setShowSetupPassword(false);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ KEY FIX
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.status === 400 && data.code === "PASSWORD_NOT_SET") {
      setApiError(data.message);
      setShowSetupPassword(true);
      return;
    }

    if (!response.ok) {
      setApiError(data.message || "Login failed");
      return;
    }

    setUser(data.data.user);
    router.push("/dashboard");

  } catch {
    setApiError("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


useEffect(() => {
  if (user) {
    router.replace("/dashboard");
  }
}, [user, router]);

  return (
    <div className="relative min-h-screen overflow-hidden items-center justify-center bg-gray-100 isolate">
      <div className="flex items-center justify-between py-3 px-6 lg:px-12">
        <div className="flex items-center gap-6 ">
          <Logo />
          <div className="hidden sm:block text-sm text-gray-600">
            / Support@intigent.com
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="hidden sm:flex items-center gap-3 text-gray-600">
            <span>En</span>
            <span className="text-gray-300">•</span>
            <Link href="/signup" className="hover:text-gray-900">
              Don't have an account?{" "}
            </Link>
          </div>
          <Link
            href="/signup"
            className="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-yellow-400 text-sm font-semibold text-black hover:brightness-95"
          >
            Create Account
          </Link>
        </div>
      </div>
      {/* Aurora Gradient Background */}
      <div className="pointer-events-none absolute -top-32 -left-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(ellipse_at_top_left,_rgba(255,186,122,0.45)_0%,_rgba(255,214,170,0.28)_35%,_transparent_70%)] blur-3xl opacity-90 -z-10" />
      <div className="pointer-events-none absolute top-24 -right-36 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.65)_0%,_rgba(255,255,255,0.35)_40%,_transparent_70%)] blur-3xl opacity-90 -z-10" />
      <div className="pointer-events-none absolute bottom-[-14rem] left-1/3 h-[48rem] w-[48rem] rotate-12 rounded-full bg-[conic-gradient(from_120deg_at_50%_50%,_rgba(255,255,255,0.55)_0deg,_rgba(255,179,71,0.28)_120deg,_transparent_300deg)] blur-3xl opacity-90 -z-10" />
      <motion.div
        key="header"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <AuthHeader onPress={() => {}} btn={false} login={true} />
      </motion.div>
      <motion.div
        key="body"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="w-full max-w-md mx-auto px-4"
      >
        <div className="">
          {/* API Error Display */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{apiError}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2 -mt-2"
              >
                {/* Email Address */}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={cn(
                    "block w-full pl-10 pr-3 py-4 border rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2 -mt-2"
              >
                {/* Password */}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={cn(
                    "block w-full pl-10 pr-3 py-4 border rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            {/* <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot your password?
              </Link>
            </div> */}

            {/* Submit Button */}
           {showSetupPassword ? (
  <button
    type="button"
    onClick={() => router.push("/setup-password")}
    className="w-full px-8 py-3 rounded-full font-medium bg-orange-500 hover:bg-orange-600 text-white transition-all"
  >
    Setup Password
  </button>
) : (
  <button
    type="submit"
    disabled={isLoading}
    className={cn(
      "w-full flex items-center justify-center px-8 py-3 rounded-full font-medium transition-all",
      isLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-purple-600 hover:bg-blue-700",
      "text-white"
    )}
  >
    {isLoading ? (
      <>
        <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
        Signing In...
      </>
    ) : (
      "Sign In"
    )}
  </button>
)}

          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Forgot your password?{" "}
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Reset it here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
