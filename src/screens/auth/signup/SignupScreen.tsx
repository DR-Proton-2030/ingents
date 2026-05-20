"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignupForm from "./SignupForm";
import { useSignup } from "@/hooks/useSignup";
import Link from "next/link";
import Logo from "@/components/shared/logo/Logo";
import { contact } from "@/constants/contact";

declare global {
  interface Window { google: any; }
}

export default function SignupScreen() {
  const signup = useSignup();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const existing = document.getElementById("google-gsi-script-landing");
    if (existing) return;
    const script = document.createElement("script");
    script.id = "google-gsi-script-landing";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleGoogleSignup = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "628940961069-2od70kjgm0a3bfknfvfoevah8s5pcggt.apps.googleusercontent.com",
      callback: async (response: any) => {
        try {
          const res = await fetch("/api/auth/google-signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ token: response.credential }),
          });
          const data = await res.json();
          const googleUser = data.data?.user;
          if (googleUser) {
            // Pre-fill personal info from Google and skip to Step 2
            signup.handleUserDetailsChange({
              full_name: googleUser.full_name || googleUser.name || "",
              email: googleUser.email || "",
              password: googleUser.email,
              confirmPassword: googleUser.email,
              profile_picture: null,
            });
            setShowForm(true);
            signup.setCurrentStep(2);
          }
        } catch (e) { console.error("Google signup error:", e); }
      },
      ux_mode: "popup",
      cancel_on_tap_outside: true,
    });
    const container = document.getElementById("g-btn-hidden");
    if (container) {
      container.innerHTML = "";
      window.google.accounts.id.renderButton(container, { type: "standard", size: "large" });
      const btn = container.querySelector("div[role=button]") as HTMLElement;
      if (btn) btn.click();
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 isolate overflow-hidden flex flex-col">
      {/* Aurora Background */}
      <div className="pointer-events-none absolute -top-32 -left-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(ellipse_at_top_left,_rgba(255,186,122,0.45)_0%,_rgba(255,214,170,0.28)_35%,_transparent_70%)] blur-3xl opacity-90 -z-10" />
      <div className="pointer-events-none absolute top-24 -right-36 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.65)_0%,_rgba(255,255,255,0.35)_40%,_transparent_70%)] blur-3xl opacity-90 -z-10" />
      <div className="pointer-events-none absolute bottom-[-14rem] left-1/3 h-[48rem] w-[48rem] rotate-12 rounded-full bg-[conic-gradient(from_120deg_at_50%_50%,_rgba(255,255,255,0.55)_0deg,_rgba(255,179,71,0.28)_120deg,_transparent_300deg)] blur-3xl opacity-90 -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between py-3 px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-2 sm:gap-4">
          <Logo />
          <span className="hidden sm:block text-sm text-gray-500">/ {contact.email}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden sm:block text-sm text-gray-600">Already have an account?</span>
          <Link href="/login" className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-400 text-sm font-semibold text-black hover:brightness-95 whitespace-nowrap">
            Log in
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center px-4 pb-12 text-center"
          >
            <div className="hidden lg:inline-block mb-6 px-4 py-2 bg-white/60 rounded-full text-sm text-gray-600">
              Are you a Brand? Explore how to use Tract for growth.
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-gray-900 leading-tight">
              <span className="relative inline-block">
                <span className="relative z-10">Register</span>
                <svg viewBox="0 0 220 60" className="absolute -left-3 -top-4 w-36 h-10 sm:w-52 sm:h-14 -z-10 pointer-events-none" aria-hidden>
                  <path d="M14 30 C38 10, 182 8, 206 30" fill="none" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
                  <path d="M28 30 C56 18, 164 16, 192 30" fill="none" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
                </svg>
              </span>
              <br />
              <span>to Create Account</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-md">
              Uncover the Untapped Potential of Your Growth to Connect with Clients
            </p>

            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="mt-6 w-full max-w-xs flex items-center justify-center gap-3 py-3.5 rounded-full font-medium text-sm bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-700"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>
            <div id="g-btn-hidden" className="absolute opacity-0 pointer-events-none" />

            {/* Divider */}
            <div className="mt-4 flex items-center gap-3 w-full max-w-xs">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-10 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-base font-semibold transition-all"
            >
              Let&apos;s get started
            </button>

            <p className="mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Try to Log in
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex items-start justify-center px-4 pb-12 pt-4"
          >
            <SignupForm {...signup} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
