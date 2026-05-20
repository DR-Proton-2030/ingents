/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Logo from "@/components/shared/logo/Logo";
import AuthContext from "@/contexts/authContext/authContext";

declare global {
  interface Window { google: any; }
}

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "1234" });
  const [showPassword, setShowPassword] = useState(false);
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleInitialized = useRef(false);

  // Show message if redirected from signup due to existing account
  useEffect(() => {
    if (searchParams.get("reason") === "already_registered") {
      setApiError("You already have an account. Please sign in.");
    }
  }, [searchParams]);

  // Load Google GSI script
  useEffect(() => {
    const existing = document.getElementById("google-gsi-login");
    if (existing) return;
    const script = document.createElement("script");
    script.id = "google-gsi-login";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
    setApiError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
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
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.status === 400 && data.code === "PASSWORD_NOT_SET") {
        setApiError("This account still needs to be activated with a temporary password.");
        setShowSetupPassword(true);
        return;
      }
      if (response.ok && data.code === "PASSWORD_RESET_REQUIRED") { router.replace("/reset-password"); return; }
      if (!response.ok) { setApiError(data.message || "Login failed"); return; }
      setUser(data.data.user);
      router.push("/dashboard");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { setIsLoading(false); }
  };

  const handleGoogleSignIn = () => {
    if (!window.google) {
      setApiError("Google Sign-In is not loaded yet. Please try again.");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "628940961069-2od70kjgm0a3bfknfvfoevah8s5pcggt.apps.googleusercontent.com";

    const handleCredential = async (response: any) => {
      setIsLoading(true);
      setApiError(null);
      try {
        const res = await fetch("/api/auth/google-signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token: response.credential }),
        });

        const text = await res.text();
        if (!text) {
          setApiError("Empty response from server. Please try again.");
          return;
        }

        const data = JSON.parse(text);
        console.log("Google signin response:", res.status, data);

        if (!res.ok) {
          // 404 = user not found → redirect to signup
          if (res.status === 404 || data.code === "USER_NOT_FOUND") {
            router.push("/signup");
            return;
          }
          // Backend error but we have Google user data → redirect to signup
          if (data.code === "BACKEND_ERROR" && data.data?.user) {
            router.push("/signup");
            return;
          }
          setApiError(data.message || `Error ${res.status}: Google sign-in failed`);
          return;
        }

        // Success — user exists, log them in
        if (data.data?.user) {
          // Store JWT token in localStorage (same as regular login)
          if (data.data.token && typeof window !== "undefined") {
            localStorage.setItem("@token", data.data.token);
          }
          setUser(data.data.user);
          router.push("/dashboard");
          return;
        }

        // Fallback: user not found
        if (data.code === "USER_NOT_FOUND") {
          router.push("/signup");
          return;
        }

        setApiError(`Unexpected response: ${JSON.stringify(data)}`);
      } catch (err: any) {
        console.error("Google sign-in catch error:", err);
        setApiError(`Error: ${err?.message || "Something went wrong"}`);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize only once
    if (!googleInitialized.current) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
        ux_mode: "popup",
      });
      googleInitialized.current = true;
    }

    // Render hidden button and click it to trigger popup
    const container = document.getElementById("g-login-btn-hidden");
    if (container) {
      container.innerHTML = "";
      window.google.accounts.id.renderButton(container, { type: "standard", size: "large" });
      setTimeout(() => {
        const btn = container.querySelector("div[role=button]") as HTMLElement;
        if (btn) btn.click();
      }, 100);
    }
  };

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  return (
    <div className="relative h-screen bg-gray-100 isolate flex flex-col overflow-hidden">
      {/* Aurora Background */}
      <div className="pointer-events-none absolute -top-32 -left-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(ellipse_at_top_left,_rgba(255,186,122,0.45)_0%,_rgba(255,214,170,0.28)_35%,_transparent_70%)] blur-3xl opacity-90 -z-10" />
      <div className="pointer-events-none absolute top-24 -right-36 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.65)_0%,_rgba(255,255,255,0.35)_40%,_transparent_70%)] blur-3xl opacity-90 -z-10" />
      <div className="pointer-events-none absolute bottom-[-14rem] left-1/3 h-[48rem] w-[48rem] rotate-12 rounded-full bg-[conic-gradient(from_120deg_at_50%_50%,_rgba(255,255,255,0.55)_0deg,_rgba(255,179,71,0.28)_120deg,_transparent_300deg)] blur-3xl opacity-90 -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between py-3 px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-2 sm:gap-4">
          <Logo />
          <span className="hidden sm:block text-sm text-gray-500">/ support@ingents.ai</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden sm:block text-sm text-gray-600">Don't have an account?</span>
          <Link href="/signup" className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-400 text-sm font-semibold text-black hover:brightness-95 whitespace-nowrap">
            Create Account
          </Link>
        </div>
      </div>

      {/* Hero Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4 pt-6 pb-2"
      >
        <div className="hidden lg:inline-block mb-4 px-4 py-2 bg-white/60 rounded-full text-sm text-gray-600">
          Are you a Brand? Explore how to use Tract for growth.
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-gray-900 leading-tight">
          <span className="relative inline-block">
            <span className="relative z-10">Welcome</span>
            <svg viewBox="0 0 220 60" className="absolute -left-3 -top-4 w-36 h-10 sm:w-52 sm:h-14 -z-10 pointer-events-none" aria-hidden>
              <path d="M14 30 C38 10, 182 8, 206 30" fill="none" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
              <path d="M28 30 C56 18, 164 16, 192 30" fill="none" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
            </svg>
          </span>
          {" "}Back
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-500">Sign in to continue to your dashboard</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-start justify-center px-4 pb-12 pt-4"
      >
        <div className="w-full max-w-sm">
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={cn(
                  "w-full pl-11 pr-4 py-3.5 border rounded-full bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                )}
                placeholder="Email address"
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 pl-4">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={cn(
                  "w-full pl-11 pr-12 py-3.5 border rounded-full bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                  errors.password ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                )}
                placeholder="Password"
                disabled={isLoading}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOffIcon className="h-4 w-4 text-gray-400" /> : <EyeIcon className="h-4 w-4 text-gray-400" />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1 pl-4">{errors.password}</p>}
            </div>

            {showSetupPassword ? (
              <div className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                Use the temporary password created for this account to continue.
              </div>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full flex items-center justify-center py-3.5 rounded-full font-medium text-sm transition-all text-white",
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black/80 hover:bg-black/70"
                )}
              >
                {isLoading ? <><LoaderIcon className="w-4 h-4 mr-2 animate-spin" />Signing In...</> : "Sign In"}
              </button>
            )}
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full font-medium text-sm bg-white/80 border border-gray-300 hover:border-gray-400 hover:bg-white transition-all text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
          {/* Hidden Google button container for popup trigger */}
          <div id="g-login-btn-hidden" className="absolute opacity-0 pointer-events-none" />

          {/* Forgot password */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Forgot your password?{" "}
            <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
              Reset it here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
