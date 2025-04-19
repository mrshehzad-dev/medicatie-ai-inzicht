
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

const ButtonCTA = ({
  children,
  to,
  onClick,
  variant = "primary",
  className,
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md px-6 py-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
  
  const variantStyles = {
    primary: "bg-yellow-400 text-primary hover:bg-yellow-300",
    secondary: "bg-white text-primary hover:bg-gray-100",
    outline: "border border-white text-white hover:bg-white/10",
  };
  
  const styles = cn(baseStyles, variantStyles[variant], className);
  
  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }
  
  return (
    <button type="button" className={styles} onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonCTA;
