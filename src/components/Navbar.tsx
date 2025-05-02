import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound, LogOut, Menu } from "lucide-react";
import ButtonCTA from "./ui/button-cta";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { user, loading } = useAuth();
  const supabase = useAuth().supabase;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
  
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Aan de slag", path: "/keuze" },
    { title: "Prijzen", path: "/pricing" }
  ];

  return (
    <nav className="bg-primary py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <LinkComponent to="/" className="flex items-center space-x-2 text-white font-bold text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>MedicatieAI</span>
        </LinkComponent>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <LinkComponent 
              key={link.path} 
              to={link.path} 
              className="text-white hover:text-blue-100 transition"
            >
              {link.title}
            </LinkComponent>
          ))}
          
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-white p-2 focus:outline-none" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[75%] pt-12">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <LinkComponent 
                    key={link.path} 
                    to={link.path} 
                    className="text-foreground hover:text-primary transition px-4 py-2 text-lg"
                  >
                    {link.title}
                  </LinkComponent>
                ))}
                
                {!user && !loading && (
                  <div className="pt-2">
                    <ButtonCTA to="/auth" variant="primary" className="w-full justify-center">
                      Registreer nu
                    </ButtonCTA>
                  </div>
                )}
                
                {user && (
                  <div className="border-t pt-4 mt-2">
                    <div className="px-4 py-2 flex items-center text-sm text-gray-500">
                      <UserRound className="mr-2 h-4 w-4" />
                      {user.email}
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 flex items-center text-sm text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Uitloggen
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
