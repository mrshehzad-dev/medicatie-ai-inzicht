
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ButtonCTA from "@/components/ui/button-cta";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";

const ResultPage = () => {
  const navigate = useNavigate();
  const [resultContent, setResultContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const content = localStorage.getItem("medicatiebeoordelingResultaat");
    
    if (!content) {
      navigate("/");
      return;
    }
    
    setResultContent(content);
    
    // Converteer markdown naar HTML
    setHtmlContent(marked.parse(content) as string);
  }, [navigate]);

  const handleDownloadPDF = () => {
    // In een echte applicatie zou dit een PDF downloaden
    alert("In een echte applicatie zou dit het rapport als PDF downloaden.");
  };

  const handleNewBeoordeling = () => {
    localStorage.removeItem("medicatiebeoordelingResultaat");
    navigate("/keuze");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Medicatiebeoordeling Resultaat</h1>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleDownloadPDF}
                    className="text-primary hover:text-blue-700 font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF Downloaden
                  </button>
                  <button 
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(resultContent);
                        alert("Rapport is gekopieerd naar het klembord!");
                      }
                    }}
                    className="text-primary hover:text-blue-700 font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Kopiëren
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 bg-gray-50 prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </div>
              
              <div className="mt-8 flex justify-end">
                <ButtonCTA onClick={handleNewBeoordeling}>
                  Nieuwe beoordeling
                </ButtonCTA>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultPage;
