
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface ButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  requiresAuth?: boolean;
}

const ButtonCTA = ({
  children,
  to,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled,
  requiresAuth = false,
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md px-6 py-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
  
  const variantStyles = {
    primary: "bg-yellow-400 text-primary hover:bg-yellow-300",
    secondary: "bg-white text-primary hover:bg-gray-100",
    outline: "border border-white text-white hover:bg-white/10",
  };
  
  const styles = cn(baseStyles, variantStyles[variant], className);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if we're in a valid router context
  let isRouterAvailable = true;
  try {
    useLocation();
  } catch (e) {
    isRouterAvailable = false;
  }
  
  const handleClick = () => {
    if (requiresAuth && !user && to) {
      navigate('/auth');
    } else if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };
  
  if (to && !requiresAuth) {
    if (isRouterAvailable) {
      return (
        <Link to={to} className={styles}>
          {children}
        </Link>
      );
    } else {
      return (
        <a href={to} className={styles}>
          {children}
        </a>
      );
    }
  }
  
  return (
    <button type={type} className={styles} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default ButtonCTA;
