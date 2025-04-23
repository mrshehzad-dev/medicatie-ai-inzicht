
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import html2pdf from "html2pdf.js";
import { Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import ButtonCTA from "@/components/ui/button-cta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { parseStructuredContent } from "@/utils/resultParser";
import { FTPSection } from "@/components/results/FTPSection";
import { TreatmentPlanSection } from "@/components/results/TreatmentPlanSection";
import { ConditionGuidelinesSection } from "@/components/results/ConditionGuidelinesSection";
import { SideEffectsSection } from "@/components/results/SideEffectsSection";

const ResultPage = () => {
  const navigate = useNavigate();
  const [resultContent, setResultContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [parsedSections, setParsedSections] = useState<ReturnType<typeof parseStructuredContent>>({
    ftps: [],
    treatmentPlan: [],
    conditionGuidelines: [],
    sideEffects: []
  });

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
          setParsedSections(parseStructuredContent(displayContent));
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
            setParsedSections(parseStructuredContent(displayContent));
          }
        } else {
          navigate("/");
          return;
        }
      } else if (assessment && assessment.report_data) {
        setResultContent(assessment.report_data);
        setHtmlContent(marked.parse(assessment.report_data) as string);
        setParsedSections(parseStructuredContent(assessment.report_data));
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
    const content = document.getElementById('report-content');
    
    if (!content) {
      toast({
        title: "Fout bij downloaden",
        description: "De inhoud kon niet worden geladen voor de PDF.",
        variant: "destructive",
      });
      return;
    }
    
    const options = {
      margin: [10, 10, 10, 10],
      filename: 'medicatiebeoordeling.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf()
      .set(options)
      .from(content)
      .save()
      .then(() => {
        toast({
          title: "PDF gedownload",
          description: "Medicatiebeoordeling is succesvol gedownload als PDF.",
        });
      })
      .catch(error => {
        console.error("Error generating PDF:", error);
        toast({
          title: "Fout bij downloaden",
          description: "Er is een fout opgetreden bij het genereren van de PDF.",
          variant: "destructive",
        });
      });
  };

  const handleNewBeoordeling = () => {
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
                    <Download className="h-5 w-5 mr-1" />
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
                    <Copy className="h-5 w-5 mr-1" />
                    Kopiëren
                  </button>
                </div>
              </div>
              
              <div className="rounded-lg p-6 bg-gray-50 prose max-w-none">
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
                  <div id="report-content" className="space-y-8">
                    <FTPSection ftps={parsedSections.ftps} />
                    <TreatmentPlanSection 
                      treatmentPlan={parsedSections.treatmentPlan} 
                      totalFTPs={parsedSections.ftps.length} 
                    />
                    <ConditionGuidelinesSection guidelines={parsedSections.conditionGuidelines} />
                    <SideEffectsSection sideEffects={parsedSections.sideEffects} />
                  </div>
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
