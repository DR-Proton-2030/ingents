"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthHeader } from "@/components/screens/auth/AuthHeader";
import SignupForm from "./SignupForm";
import { useSignup } from "@/hooks/useSignup";
import Link from "next/link";
import Logo from "@/components/shared/logo/Logo";
import { contact } from "@/constants/contact";

export default function SignupScreen() {
  const signup = useSignup();
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="relative  h-screen items-center justify-center bg-gray-100 isolate overflow-hidden">
        <div className="flex items-center justify-between py-3 px-6 lg:px-12">
          <div className="flex items-center gap-6 ">
            <Logo />
            <div className="hidden sm:block text-sm text-gray-600">
              / {contact.email}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="hidden sm:flex items-center gap-3 text-gray-600">
              <span>En</span>
              <span className="text-gray-300">•</span>
              <Link href="/login" className="hover:text-gray-900">
                Already have an account?{" "}
              </Link>
            </div>
            <Link
              href="/login"
              className="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-yellow-400 text-sm font-semibold text-black hover:brightness-95"
            >
              Log in
            </Link>
          </div>
        </div>
        {/* Aurora Gradient Background */}
        <div className="pointer-events-none absolute -top-32 -left-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(ellipse_at_top_left,_rgba(255,186,122,0.45)_0%,_rgba(255,214,170,0.28)_35%,_transparent_70%)] blur-3xl opacity-90 -z-10" />
        <div className="pointer-events-none absolute top-24 -right-36 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.65)_0%,_rgba(255,255,255,0.35)_40%,_transparent_70%)] blur-3xl opacity-90 -z-10" />
        <div className="pointer-events-none absolute bottom-[-14rem] left-1/3 h-[48rem] w-[48rem] rotate-12 rounded-full bg-[conic-gradient(from_120deg_at_50%_50%,_rgba(255,255,255,0.55)_0deg,_rgba(255,179,71,0.28)_120deg,_transparent_300deg)] blur-3xl opacity-90 -z-10" />

        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="header"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <AuthHeader onPress={() => setShowForm(true)} btn={true} />
              <div className="-mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Try to Log in
                  </Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <SignupForm {...signup} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
