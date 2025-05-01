
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  requiresAuth?: boolean;
  isSubscribeButton?: boolean;
  requiresSubscription?: boolean;
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
  isSubscribeButton = false,
  requiresSubscription = false,
}: ButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  
  const baseStyles = "inline-flex items-center justify-center rounded-md px-6 py-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
  
  const variantStyles = {
    primary: "bg-yellow-400 text-primary hover:bg-yellow-300",
    secondary: "bg-white text-primary hover:bg-gray-100",
    outline: "border border-white text-white hover:bg-white/10",
  };
  
  const styles = cn(baseStyles, variantStyles[variant], className);
  
  const { user } = useAuth();
  const { isSubscribed, isLoading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  
  // Check if we're in a valid router context
  let isRouterAvailable = true;
  try {
    useLocation();
  } catch (e) {
    isRouterAvailable = false;
  }
  
  const handleSubscribe = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL received');
      
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Er is een fout opgetreden bij het starten van het betalingsproces.');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (isSubscribeButton) {
      handleSubscribe();
      return;
    }
    
    if (requiresSubscription && !subscriptionLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (!isSubscribed) {
        setShowSubscriptionDialog(true);
        return;
      }
    }
    
    if (requiresAuth && !user && to) {
      navigate('/auth');
    } else if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };
  
  if (to && !requiresAuth && !isSubscribeButton && !requiresSubscription) {
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
    <>
      <button 
        type={type} 
        className={styles} 
        onClick={handleClick} 
        disabled={disabled || loading || (requiresSubscription && subscriptionLoading)}
      >
        {loading ? 'Laden...' : children}
      </button>
      
      <AlertDialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abonnement vereist</AlertDialogTitle>
            <AlertDialogDescription>
              Je hebt een actief abonnement nodig om deze functie te gebruiken.
              Wil je nu een abonnement afsluiten?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubscribe}>
              Abonnement afsluiten
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ButtonCTA;
