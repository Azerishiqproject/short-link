import React from "react";
import clsx from "clsx";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  rounded?: "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  padding?: "sm" | "md" | "lg";
  variant?: "default" | "gradient";
};

export function Card({
  className,
  children,
  rounded = "xl",
  padding = "md",
  variant = "default",
  ...props
}: CardProps) {
  const roundedClass: Record<NonNullable<CardProps["rounded"]>, string> = {
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  const paddingClass: Record<NonNullable<CardProps["padding"]>, string> = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={clsx(
        "border border-black/10 shadow-sm",
        variant === "gradient"
          ? "bg-gradient-to-br from-white to-white/80 dark:from-white/[0.08] dark:to-white/[0.04]"
          : "bg-white dark:bg-white/[0.06]",
        roundedClass[rounded],
        paddingClass[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;

 