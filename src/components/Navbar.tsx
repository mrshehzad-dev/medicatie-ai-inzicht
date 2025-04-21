
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound, LogOut } from "lucide-react";
import ButtonCTA from "./ui/button-cta";

const Navbar = () => {
  const { user, loading } = useAuth();
  const supabase = useAuth().supabase;
  
  // Check if we're in a valid router context
  let isRouterAvailable = true;
  try {
    useLocation();
  } catch (e) {
    isRouterAvailable = false;
  }
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Use regular anchor tags when router is not available
  const LinkComponent = ({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) => {
    if (isRouterAvailable) {
      return <Link to={to} className={className}>{children}</Link>;
    }
    return <a href={to} className={className}>{children}</a>;
  };

  return (
    <nav className="bg-primary py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <LinkComponent to="/" className="flex items-center space-x-2 text-white font-bold text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>MedicatieAI</span>
        </LinkComponent>
        
        <div className="hidden md:flex items-center space-x-8">
          <LinkComponent to="/" className="text-white hover:text-blue-100 transition">Home</LinkComponent>
          <LinkComponent to="/keuze" className="text-white hover:text-blue-100 transition">Aan de slag</LinkComponent>
          <LinkComponent to="/pricing" className="text-white hover:text-blue-100 transition">Prijzen</LinkComponent>
          
          {!user && !loading && (
            <ButtonCTA to="/auth" variant="secondary">
              Registreer nu
            </ButtonCTA>
          )}
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar>
                  <AvatarFallback className="bg-secondary text-white">
                    {user.email?.charAt(0).toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-sm text-gray-500 px-3 py-2">
                  <UserRound className="mr-2 h-4 w-4" />
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-sm text-red-500 px-3 py-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  Uitloggen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="md:hidden">
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
