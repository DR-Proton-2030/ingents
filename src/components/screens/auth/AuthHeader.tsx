/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";

export const AuthHeader = ({ onPress, btn }: any) => {
  return (
    <header className="w-full">
      {/* Top slim bar */}

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-white/60 rounded-full text-sm text-gray-600">
            Are you a Brand? Explore how to use Tract for growth.
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-serif leading-tight text-gray-900">
            <span className="block">
              <span className="relative inline-block align-middle">
                {/* The visible text */}
                <span className="relative z-20">Register</span>

                {/* Hand-drawn scribble SVG behind the word "Login" */}
                <svg
                  viewBox="0 0 220 60"
                  preserveAspectRatio="xMidYMid meet"
                  className="absolute -left-4 -top-5 w-40 h-12 sm:w-48 sm:h-14 lg:w-60 lg:h-18 -z-10 pointer-events-none"
                  aria-hidden
                >
                  {/* Thin outer stroke */}
                  <path
                    d="M14 30 C38 10, 182 8, 206 30"
                    fill="none"
                    stroke="#FDE68A"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.95"
                  />

                  {/* Inner delicate scribble */}
                  <path
                    d="M28 30 C56 18, 164 16, 192 30"
                    fill="none"
                    stroke="#FDE68A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                </svg>
              </span>

              <span className="ml-4 align-middle">to Create</span>
            </span>
            <br />
            <span className="block -mt-32">Account</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Uncover the Untapped Potential of Your Growth to Connect with
            Clients
          </p>
        </div>
        {btn && (
          <div
            onClick={onPress}
            className="bg-purple-500 hover:bg-purple-600 duration-200 p-4 cursor-pointer text-white text-center w-72 mx-auto mt-8 rounded-full text-lg font-semibold"
          >
            Lets get started
          </div>
        )}
      </div>
    </header>
  );
};

export default AuthHeader;
