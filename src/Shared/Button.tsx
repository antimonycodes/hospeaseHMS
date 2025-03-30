import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "delete" | "outline" | "edit";
  size?: "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  icon?: React.ReactNode; // Accepts an icon component
  iconPosition?: "left" | "right"; // Controls icon placement
  type?: "" | "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  rounded = "md",
  icon,
  iconPosition = "left",
  type = "",
}) => {
  const baseStyles =
    " w- flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring";

  const variantStyles = {
    primary: "bg-primary text-white ",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-400",
    delete: "bg-transparent border border-[#F61F3C] text-[#F61F3C]",
    edit: "bg-transparent border border-[#667085] text-[#667085]",
    outline:
      "border border-gray-600 text-gray-600 hover:bg-gray-100 focus:ring-gray-400",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        // disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-3 flex items-center">{icon}</span>
      )}
    </button>
  );
};

export default Button;
