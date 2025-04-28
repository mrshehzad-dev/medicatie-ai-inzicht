
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ButtonCTA from "@/components/ui/button-cta";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const PricingPage = () => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) throw error;
        setIsSubscribed(data?.subscribed || false);
      } catch (error) {
        console.error('Error checking subscription:', error);
        toast.error('Er is een fout opgetreden bij het controleren van uw abonnement.');
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Onze prijzen</h1>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            MedicatieAI biedt één eenvoudig abonnement voor alle apothekers in Nederland, met alle functies inbegrepen.
          </p>
          
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Volledige toegang</h3>
                <p className="text-gray-600 mb-6">Alle functies, onbeperkt gebruik</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold">€399</span>
                  <span className="text-gray-500">/maand</span>
                </div>
                
                <ul className="text-left mb-8 space-y-3">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Onbeperkte medicatiebeoordelingen
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Toegang tot zowel openbare apotheek als ziekenhuis modules
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Exporteren naar PDF
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Prioritaire technische ondersteuning
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Regelmatige updates met nieuwe functies
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Mogelijkheid tot integratie met apotheeksystemen
                  </li>
                </ul>
                
                {loading ? (
                  <ButtonCTA className="w-full justify-center" disabled>
                    Laden...
                  </ButtonCTA>
                ) : isSubscribed ? (
                  <div className="text-center text-green-600 font-medium">
                    U heeft een actief abonnement
                  </div>
                ) : (
                  <ButtonCTA 
                    className="w-full justify-center" 
                    isSubscribeButton
                  >
                    Nu kopen
                  </ButtonCTA>
                )}
                
                <p className="text-sm text-gray-500 mt-4">
                  Niet tevreden? Geld-terug-garantie binnen 30 dagen.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 border-t">
              <h4 className="font-semibold mb-3">Veel gestelde vragen:</h4>
              <ul className="space-y-3">
                <li>
                  <h5 className="font-medium">Kan ik MedicatieAI gebruiken op meerdere apparaten?</h5>
                  <p className="text-sm text-gray-600">Ja, u kunt inloggen op meerdere apparaten met één account.</p>
                </li>
                <li>
                  <h5 className="font-medium">Is er een limiet aan het aantal beoordelingen?</h5>
                  <p className="text-sm text-gray-600">Nee, u kunt onbeperkt medicatiebeoordelingen uitvoeren.</p>
                </li>
                <li>
                  <h5 className="font-medium">Hoe vaak worden de data bijgewerkt?</h5>
                  <p className="text-sm text-gray-600">Alle geneesmiddelendata worden maandelijks bijgewerkt volgens de meest recente richtlijnen.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
