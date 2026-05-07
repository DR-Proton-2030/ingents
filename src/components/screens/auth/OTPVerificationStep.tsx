"use client";

import * as React from "react";
import { InputOTP } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { MailIcon, RefreshCwIcon } from "lucide-react";

interface OTPVerificationStepProps {
  email: string;
  otp: string;
  onOtpChange: (otp: string) => void;
  onResendOtp: () => void;
  isResending?: boolean;
  error?: string;
  className?: string;
}

export const OTPVerificationStep: React.FC<OTPVerificationStepProps> = ({
  email,
  otp,
  onOtpChange,
  onResendOtp,
  isResending = false,
  error,
  className,
}) => {
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    if (countdown === 0 && !isResending) {
      onResendOtp();
      setCountdown(60); // 60 second cooldown
    }
  };

  return (
    <div className={cn("space-y-6 px-32", className)}>
      <div className="text-left mb-8">
        <h2 className="text-5xl sm:text-6xl lg:text-5xl font-serif leading-tight text-gray-900">
          Verify Your Email
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          We&apos;ve sent a verification code to your email
        </p>
      </div>

      {/* Email Display */}
      <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <MailIcon className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-gray-700 font-medium">{email}</span>
      </div>

      {/* OTP Input */}
      <div className="py-6">
        <InputOTP
          length={6}
          value={otp}
          onChange={onOtpChange}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className={cn(
              "inline-flex items-center gap-1 font-medium transition-colors",
              countdown > 0 || isResending
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-700"
            )}
          >
            {isResending ? (
              <>
                <RefreshCwIcon className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              "Resend Code"
            )}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerificationStep;
