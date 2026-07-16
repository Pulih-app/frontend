"use client";

import React, { useState } from "react";
import { LucideIcon, Eye, EyeOff } from "lucide-react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  containerClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ icon: Icon, type, className = "", containerClassName = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";

    // Determine the actual input type based on whether showPassword is true
    const inputType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className={`relative z-90 ${containerClassName || "mb-4"}`}>
        {Icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} strokeWidth={1.8} />
          </span>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`w-full bg-gray-100 rounded-2xl py-4 pl-12 ${
            isPasswordType ? "pr-12" : "pr-4"
          } text-gray-700 placeholder-gray-400 text-sm outline-none border-2 border-transparent focus:border-[#4caf50] transition-colors ${className}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <Eye size={20} strokeWidth={1.8} />
            ) : (
              <EyeOff size={20} strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
