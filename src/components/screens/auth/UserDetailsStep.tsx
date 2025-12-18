/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserDetailsFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile_picture?: File | null;
}

interface UserDetailsStepProps {
  data: UserDetailsFormData;
  onChange: (data: Partial<UserDetailsFormData>) => void;
  errors?: Record<string, string>;
  className?: string;
}

export const UserDetailsStep: React.FC<UserDetailsStepProps> = ({
  data,
  onChange,
  errors = {},
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof UserDetailsFormData,
    value: string
  ) => {
    onChange({ [field]: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange({ profile_picture: file });

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  return (
    <div className={cn("space-y-6 px-32", className)}>
      <div className="text-left mb-8">
        <h2 className="text-5xl sm:text-6xl lg:text-5xl font-serif leading-tight text-gray-900">
          Personal Information
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Uncover the Untapped Potential of Your Growth to Connect with Clients
        </p>
      </div>

      <div className="flex gap-4 justify-between">
        <div className="space-y-4 w-2/5 ">
          {/* Full Name */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="full_name"
                value={data.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className={cn(
                  "block w-full pl-10 pr-3 py-4 border rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                  errors.full_name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
                placeholder="Enter your full name"
              />
            </div>
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={data.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={cn(
                  "block w-full pl-10 pr-3 py-4 border rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                  errors.email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
                placeholder="Enter your email address"
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
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={data.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={cn(
                  "block w-full pl-10 pr-3 py-4 border rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                  errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
            <p className="text-sm text-gray-500 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={data.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={cn(
                  "block w-full pl-10 pr-10 py-4 border rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                  errors.confirmPassword
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-32 bg-white/50 rounded-2xl w-[30rem] border border-gray-200"></div>

          <div className="relative -mt-20">
            <div className="w-40 h-40 rounded-full border-4 border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={
                    "https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg"
                  }
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-5 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-white" />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Upload your profile picture (optional)
          </p>
          <label
            htmlFor="avatar-upload"
            className="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-indigo-400 text-sm font-semibold text-white mt-5 hover:brightness-95"
          >
            Upload Image
          </label>
          {errors.profile_picture && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profile_picture}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsStep;
