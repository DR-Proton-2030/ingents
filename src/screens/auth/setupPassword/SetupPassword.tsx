"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import useQuerySearch from "@/hooks/querySearch/useQuerySearch";
const SetupPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const token = useQuerySearch("token");
  const router = useRouter();

  // Validation rules
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const isPasswordValid =
    hasMinLength && hasUppercase && hasNumber && hasSpecialChar;

  const isMatch = password === confirmPassword && password.length > 0;
  const canSubmit = isPasswordValid && isMatch && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await api.auth.setupPassword(password, token);
      if(res){
        router.push("/login");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <Lock className="text-orange-600" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Set up your password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Secure your account with a strong password
          </p>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
             className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800
  shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]
  focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,1)]
  focus:outline-none transition-all duration-200"

            />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 select-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Constant helper */}
          <div
            className={`mt-2 flex mb-2 items-start gap-2 text-xs transition-colors
              ${
                password.length === 0
                  ? "text-gray-400"
                  : isPasswordValid
                  ? "text-green-600"
                  : "text-orange-600"
              }`}
          >
            {password.length === 0 ? (
              <Info size={14} />
            ) : isPasswordValid ? (
              <CheckCircle size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            <p>
              Password must be at least <b>6 characters</b> and include an{" "}
              <b>uppercase letter</b>, a <b>number</b>, and a{" "}
              <b>special character</b>.
            </p>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800
  shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]
  focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,1)]
  focus:outline-none transition-all duration-200"

            />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 select-none"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isMatch && confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Error / Success */}
        {errorMsg && <p className="text-sm text-red-600 mb-3">{errorMsg}</p>}
        {successMsg && (
          <p className="text-sm text-green-600 mb-3">{successMsg}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all
            ${
              canSubmit
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-orange-300 cursor-not-allowed"
            }`}
        >
          {loading ? "Setting Password..." : "Set Password"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          Your password is encrypted and stored securely 🔒
        </p>
      </div>
    </div>
  );
};

export default SetupPassword;
