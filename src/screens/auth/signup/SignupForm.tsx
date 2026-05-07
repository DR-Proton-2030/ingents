/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UserDetailsStep } from "@/components/screens/auth/UserDetailsStep";
import { OTPVerificationStep } from "@/components/screens/auth/OTPVerificationStep";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  LoaderIcon,
} from "lucide-react";

export default function SignupForm(
  props: ReturnType<typeof import("@/hooks/useSignup").useSignup>
) {
  const {
    currentStep,
    isLoading,
    isResendingOtp,
    errors,
    apiError,
    userDetails,
    otp,
    handleUserDetailsChange,
    handleOtpChange,
    goNext,
    goPrevious,
    resendOtp,
    submit,
  } = props;

  return (
    <div className="w-full px-4 py-8">
      <div className=" p-8">
        {/* API Error Display */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{apiError}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 ? (
            <UserDetailsStep
              data={userDetails}
              onChange={handleUserDetailsChange}
              errors={errors as any}
            />
          ) : (
            <OTPVerificationStep
              email={userDetails.email}
              otp={otp}
              onOtpChange={handleOtpChange}
              onResendOtp={resendOtp}
              isResending={isResendingOtp}
              error={errors.otp}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-32">
          {currentStep === 2 ? (
            <button
              type="button"
              onClick={goPrevious}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex justify-end">
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={isLoading}
                className="flex items-center px-8 py-3 bg-gray-700 text-white rounded-full
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={isLoading || otp.length !== 6}
                className="flex items-center px-8 py-3 bg-green-600 text-white rounded-full
                hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Verify & Sign Up
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
