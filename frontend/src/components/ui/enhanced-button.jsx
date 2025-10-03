"use client";

import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const EnhancedButton = forwardRef(({ 
  children, 
  loading = false, 
  loadingText = "Loading...",
  animateOnClick = true,
  variant = "default",
  size = "default",
  className,
  onClick,
  disabled,
  ...props 
}, ref) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async (e) => {
    if (disabled || loading) return;
    
    if (animateOnClick) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 150);
    }

    if (onClick) {
      await onClick(e);
    }
  };

  return (
    <motion.div
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      animate={isClicked ? { scale: 0.95 } : { scale: 1 }}
      transition={{ duration: 0.1 }}
    >
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "relative transition-all duration-200",
          loading && "cursor-not-allowed",
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {loading ? loadingText : children}
      </Button>
    </motion.div>
  );
});

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton };
