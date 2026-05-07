"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import {
  validateUserDetails,
  hasValidationErrors,
} from "@/lib/validation/signupValidation";
import AuthContext from "@/contexts/authContext/authContext";
import { api } from "@/utils/api";

interface UserDetailsFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile_picture?: File | null;
}

export function useSignup() {
  const router = useRouter();
  const { setUser } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  const [userDetails, setUserDetails] = useState<UserDetailsFormData>({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_picture: null,
  });

  const handleUserDetailsChange = (data: Partial<UserDetailsFormData>) => {
    setUserDetails((prev) => ({ ...prev, ...data }));
    // Clear errors for changed fields
    Object.keys(data).forEach((key) => {
      if (errors[key]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    });
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (errors.otp) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.otp;
        return newErrors;
      });
    }
  };

  const sendOtp = async () => {
    try {
      await api.auth.getOtp({ email: userDetails.email });
      return true;
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setApiError("Failed to send verification code. Please try again.");
      return false;
    }
  };

  const resendOtp = async () => {
    setIsResendingOtp(true);
    setApiError(null);
    try {
      await api.auth.getOtp({ email: userDetails.email });
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setApiError("Failed to resend verification code. Please try again.");
    } finally {
      setIsResendingOtp(false);
    }
  };

  const goNext = async () => {
    if (currentStep === 1) {
      const validationErrors = validateUserDetails(userDetails);
      if (hasValidationErrors(validationErrors)) {
        setErrors(validationErrors);
        return;
      }
      
      setErrors({});
      setIsLoading(true);
      setApiError(null);
      
      const otpSent = await sendOtp();
      setIsLoading(false);
      
      if (otpSent) {
        setCurrentStep(2);
      }
    }
  };

  const goPrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setOtp("");
      setErrors({});
      setApiError(null);
    }
  };

  const submit = async () => {
    // Validate OTP
    if (otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit verification code" });
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setErrors({});

    try {
      // First verify OTP
      await api.auth.verifyOtp({ email: userDetails.email, otp });

      // Then proceed with signup
      const formData = new FormData();
      const { confirmPassword, ...userDetailsForBackend } = userDetails;
      formData.append("user_details", JSON.stringify(userDetailsForBackend));

      if (userDetails.profile_picture) {
        formData.append("user_avatar", userDetails.profile_picture);
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      const { user } = data;
      setUser(user);

      router.push("/dashboard");
    } catch (err) {
      const error = err as Error;
      console.error("Signup error:", error);
      setApiError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    setCurrentStep,
  } as const;
}
