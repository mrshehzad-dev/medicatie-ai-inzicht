
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ButtonCTA from "@/components/ui/button-cta";
import { Zap, ChartBar, User } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Medicatiebeoordeling met AI
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Revolutionaire AI-tool voor apothekers in Nederland. Voer snel en nauwkeurig medicatiebeoordelingen uit.
              </p>
              <ButtonCTA to="/keuze" requiresAuth={true} variant="primary">
                Aan de slag
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </ButtonCTA>
            </div>
            <div className="hidden md:block">
              <div className="rounded-lg shadow-md">
                <img 
                  src="/chatbot.png"
                  alt="AI Medicatiebeoordeling"
                  className="w-full h-auto rounded-lg object-cover max-h-[400px]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://www.svgrepo.com/show/310397/bot.svg";
                    target.className = "w-full h-auto rounded-lg object-contain bg-white p-8 max-h-[400px]";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Voordelen</h2>
          <p className="text-center text-lg mb-12">Waarom kiezen voor onze AI-tool?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">⚡ Snelle Analyse</h3>
              <p className="text-gray-600">Medicatiebeoordelingen in seconden in plaats van uren. Bespaar kostbare tijd.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ChartBar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">📊 Nauwkeurige Resultaten</h3>
              <p className="text-gray-600">Gebaseerd op de nieuwste wetenschappelijke inzichten en richtlijnen.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">🧑‍⚕️ Speciaal voor Apothekers</h3>
              <p className="text-gray-600">Ontwikkeld in samenwerking met Nederlandse apothekers voor de dagelijkse praktijk.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Prijzen</h2>
          
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Volledige toegang</h3>
                <p className="text-gray-600 mb-6">Alle functies, onbeperkt gebruik</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold">€399</span>
                  <span className="text-gray-500">/jaar</span>
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
                    Exporteren naar PDF
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Prioritaire support
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Regelmatige updates met nieuwe functies
                  </li>
                </ul>
                
                <ButtonCTA to="#" className="w-full justify-center">
                  Nu kopen
                </ButtonCTA>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
