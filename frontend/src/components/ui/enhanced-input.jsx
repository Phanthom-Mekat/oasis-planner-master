"use client";

import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Check, X, Search } from "lucide-react";

const EnhancedInput = forwardRef(({ 
  type = "text",
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  label,
  description,
  error,
  success,
  showValidation = false,
  showPasswordToggle = false,
  showSearchIcon = false,
  animated = true,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value || "");

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    if (onChange) onChange(e);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      {label && (
        <motion.label 
          className={cn(
            "text-sm font-medium transition-colors",
            error ? "text-red-600" : success ? "text-green-600" : "text-slate-700"
          )}
          animate={animated ? { 
            color: isFocused ? "#3b82f6" : error ? "#dc2626" : success ? "#16a34a" : "#374151" 
          } : {}}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {showSearchIcon && (
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        )}
        
        <motion.div
          animate={animated ? {
            scale: isFocused ? 1.01 : 1,
            borderColor: error ? "#dc2626" : success ? "#16a34a" : isFocused ? "#3b82f6" : "#e2e8f0"
          } : {}}
          transition={{ duration: 0.2 }}
        >
          <Input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            value={value || internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "transition-all duration-200",
              showSearchIcon && "pl-10",
              (showPasswordToggle || showValidation) && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              success && "border-green-500 focus:border-green-500 focus:ring-green-500",
              isFocused && !error && !success && "border-blue-500 ring-2 ring-blue-500/20",
              className
            )}
            {...props}
          />
        </motion.div>

        {/* Password toggle */}
        {type === "password" && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}

        {/* Validation icons */}
        {showValidation && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <X className="h-4 w-4 text-red-500" />
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-red-600"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-green-600"
          >
            {success}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };
