/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { useState } from "react";
import {
  BuildingIcon,
  GlobeIcon,
  PhoneIcon,
  MapPinIcon,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyDetailsFormData {
  company_name: string;
  website?: string;
  phone?: string;
  address?: string;
  description?: string;
  company_logo?: File | null;
}

interface CompanyDetailsStepProps {
  data: CompanyDetailsFormData;
  onChange: (data: Partial<CompanyDetailsFormData>) => void;
  errors?: Record<string, string>;
  className?: string;
}

export const CompanyDetailsStep: React.FC<CompanyDetailsStepProps> = ({
  data,
  onChange,
  errors = {},
  className,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof CompanyDetailsFormData,
    value: string
  ) => {
    onChange({ [field]: value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange({ company_logo: file });

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  return (
    <div className={cn("space-y-6 px-32", className)}>
      <div className="text-left mb-8">
        <h2 className="text-5xl sm:text-6xl lg:text-5xl font-serif leading-tight text-gray-900">
          Company Information
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Uncover the Untapped Potential of Your Growth to Connect with Clients
        </p>
      </div>
      <div className="flex gap-4 justify-between">
        <div className="space-y-4 w-2/5 ">
          {/* Company Name */}
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="company_name"
                value={data.company_name}
                onChange={(e) =>
                  handleInputChange("company_name", e.target.value)
                }
                className={cn(
                  "block w-full pl-10 pr-3 py-4 border rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                  errors.company_name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
                placeholder="Enter your company name"
              />
            </div>
            {errors.company_name && (
              <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Website (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GlobeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                id="website"
                value={data.website || ""}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className={cn(
                  "block w-full pl-10 pr-3 py-4 border rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                  errors.website
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
                placeholder="https://your-company.com"
              />
            </div>
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">{errors.website}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                value={data.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={cn(
                  "block w-full pl-10 pr-3 py-4 border rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                  errors.phone
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          {/* <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Address (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="address"
                rows={3}
                value={data.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={cn(
                  "block w-full pl-10 pr-3 py-4 border rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none",
                  errors.address
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
                placeholder="123 Main Street, City, State, Country"
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div> */}

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Description (optional)
            </label>
            <textarea
              id="description"
              rows={2}
              value={data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={cn(
                "block w-full px-3 py-4 border rounded-2xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none",
                errors.description
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              )}
              placeholder="Tell us a bit about your company, what you do, and your goals..."
              maxLength={500}
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
              <p className="text-gray-400 text-sm ml-auto">
                {(data.description || "").length}/500
              </p>
            </div>
          </div>
        </div>

        {/* Company Logo Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-32 bg-white/50 rounded-2xl w-[30rem] border border-gray-200"></div>
          <div className="relative -mt-20">
            <div className="w-40 h-40 rounded-full border-4 border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={
                    "https://img.freepik.com/premium-vector/attractive-cheerful-woman-semi-flat-vector-character-head-lady-with-bun-hairstyle-bangs-editable-cartoon-avatar-icon-face-emotion-colorful-spot-illustration-web-graphic-design-animation_151150-15966.jpg"
                  }
                  alt="Company logo preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="absolute bottom-5 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-white" />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Upload your company logo (optional)
          </p>
          <label
            htmlFor="logo-upload"
            className="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-indigo-400 text-sm font-semibold text-white mt-5 hover:brightness-95"
          >
            Upload Image
          </label>
          {errors.company_logo && (
            <p className="text-red-500 text-sm mt-1">{errors.company_logo}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsStep;
