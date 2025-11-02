import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-all duration-base ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-brand-primary text-brand-primaryFg hover:bg-brand-secondary focus-visible:ring-brand-primary",
      secondary:
        "bg-brand-secondary text-brand-primaryFg hover:opacity-90 focus-visible:ring-brand-secondary",
      outline:
        "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-primaryFg focus-visible:ring-brand-primary",
      ghost:
        "text-fg-default hover:bg-bg-subtle focus-visible:ring-fg-default",
    };

    const sizes = {
      sm: "px-sm py-xs text-sm",
      md: "px-lg py-md text-base",
      lg: "px-xl py-lg text-lg",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

