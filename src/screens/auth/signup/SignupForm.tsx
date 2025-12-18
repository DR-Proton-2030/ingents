/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Stepper } from "@/components/ui/stepper";
import { UserDetailsStep } from "@/components/screens/auth/UserDetailsStep";
import { CompanyDetailsStep } from "@/components/screens/auth/CompanyDetailsStep";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  LoaderIcon,
} from "lucide-react";
import { AuthHeader } from "@/components/screens/auth/AuthHeader";
import Link from "next/link";

const STEPS = ["Personal Info", "Company Details"];

export default function SignupForm(
  props: ReturnType<typeof import("@/hooks/useSignup").useSignup>
) {
  const {
    currentStep,
    isLoading,
    errors,
    apiError,
    userDetails,
    companyDetails,
    handleUserDetailsChange,
    handleCompanyDetailsChange,
    goNext,
    goPrevious,
    submit,
  } = props;

  return (
    <div className="w-full px-4 py-8">
      <div className=" p-8">
        {/* Stepper */}
        {/* <div className="mb-8">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div> */}

        {/* API Error Display */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{apiError}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <UserDetailsStep
              data={userDetails}
              onChange={handleUserDetailsChange}
              errors={errors as any}
            />
          )}
          {currentStep === 2 && (
            <CompanyDetailsStep
              data={companyDetails}
              onChange={handleCompanyDetailsChange}
              errors={errors as any}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div>
            {currentStep === 2 && (
              <button
                type="button"
                onClick={goPrevious}
                className="flex items-center px-8 py-3 bg-gray-700 text-white rounded-full ml-32
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Previous
              </button>
            )}
          </div>

          <div className="flex space-x-4">
            {currentStep === 1 && (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center px-8 py-3 bg-gray-700 text-white rounded-full mr-32
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                Continue
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                onClick={submit}
                disabled={isLoading}
                className={cn(
                  "flex items-center px-8 py-3 bg-gray-700 text-white rounded-full mr-32 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all",
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-green-500",
                  "text-white"
                )}
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Login Link */}
      </div>
    </div>
  );
}
