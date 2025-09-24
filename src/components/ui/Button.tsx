"use client";

import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:translate-y-[-1px] active:translate-y-0";

  const variantStyles: Record<string, string> = {
    primary:
      "bg-foreground text-background hover:bg-foreground/90 dark:hover:bg-foreground/80",
    secondary:
      "bg-white/10 text-foreground hover:bg-white/15 border border-white/10 backdrop-blur",
    ghost:
      "text-foreground hover:bg-foreground/5 border border-transparent",
  };

  const sizeStyles: Record<string, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-10 px-5 text-base",
    lg: "h-11 px-6 text-base",
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;


