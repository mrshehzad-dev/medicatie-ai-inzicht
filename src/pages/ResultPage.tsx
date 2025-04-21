
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ButtonCTA from "@/components/ui/button-cta";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const ResultPage = () => {
  const navigate = useNavigate();
  const [resultContent, setResultContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      
      // Get the assessment ID from localStorage
      const assessmentId = localStorage.getItem('currentAssessmentId');
      
      if (!assessmentId) {
        // Fall back to the old localStorage method if no ID is found
        const content = localStorage.getItem("medicatiebeoordelingResultaat");
        const automationResponse = localStorage.getItem("automationResponse");
        
        if (!content && !automationResponse) {
          toast({
            title: "Geen resultaten gevonden",
            description: "Er zijn geen resultaten gevonden. U wordt doorverwezen naar de startpagina.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
        
        // Prioritize the automation response if available
        const displayContent = automationResponse || content;
        setResultContent(displayContent || "");
        
        // Convert markdown to HTML
        if (displayContent) {
          setHtmlContent(marked.parse(displayContent) as string);
        }
        
        setLoading(false);
        return;
      }
      
      // Fetch assessment from database
      const { data: assessment, error } = await supabase
        .from('assessments')
        .select('report_data')
        .eq('id', assessmentId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching assessment:', error);
        toast({
          title: "Fout bij ophalen",
          description: "Er is een fout opgetreden bij het ophalen van de medicatiebeoordeling.",
          variant: "destructive",
        });
        
        // Try to fall back to localStorage
        const content = localStorage.getItem("medicatiebeoordelingResultaat");
        const automationResponse = localStorage.getItem("automationResponse");
        
        if (content || automationResponse) {
          const displayContent = automationResponse || content;
          setResultContent(displayContent || "");
          
          if (displayContent) {
            setHtmlContent(marked.parse(displayContent) as string);
          }
        } else {
          navigate("/");
          return;
        }
      } else if (assessment && assessment.report_data) {
        setResultContent(assessment.report_data);
        setHtmlContent(marked.parse(assessment.report_data) as string);
      } else {
        toast({
          title: "Geen resultaten gevonden",
          description: "Er zijn geen resultaten gevonden. U wordt doorverwezen naar de startpagina.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      setLoading(false);
    };

    fetchResult();
  }, [navigate, toast]);

  const handleDownloadPDF = () => {
    // In een echte applicatie zou dit een PDF downloaden
    alert("In een echte applicatie zou dit het rapport als PDF downloaden.");
  };

  const handleNewBeoordeling = () => {
    // Clear all stored data
    localStorage.removeItem("medicatiebeoordelingResultaat");
    localStorage.removeItem("automationResponse");
    localStorage.removeItem("currentAssessmentId");
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
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF Downloaden
                  </button>
                  <button 
                    onClick={() => {
                      if (navigator.clipboard && resultContent) {
                        navigator.clipboard.writeText(resultContent);
                        toast({
                          title: "Gekopieerd",
                          description: "Rapport is gekopieerd naar het klembord!",
                        });
                      }
                    }}
                    className="text-primary hover:text-blue-700 font-medium flex items-center"
                    disabled={loading || !resultContent}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Kopiëren
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 bg-gray-50 prose max-w-none">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="pt-4">
                      <Skeleton className="h-6 w-1/2" />
                      <div className="pl-4 pt-2">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                )}
              </div>
              
              <div className="mt-8 flex justify-end">
                <ButtonCTA onClick={handleNewBeoordeling} disabled={loading}>
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
