
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import ButtonCTA from "@/components/ui/button-cta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FTPSection } from "@/components/results/FTPSection";
import { TreatmentPlanSection } from "@/components/results/TreatmentPlanSection";
import { ConditionGuidelinesSection } from "@/components/results/ConditionGuidelinesSection";
import { SideEffectsSection } from "@/components/results/SideEffectsSection";
import { useAssessmentFetch } from "@/hooks/useAssessmentFetch";
import { useEffect } from "react";

const ResultPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resultContent, loading, parsedSections, fetchCompleted } = useAssessmentFetch();

  useEffect(() => {
    if (fetchCompleted) {
      console.log("Result content available:", !!resultContent);
      console.log("Parsed sections:", {
        ftpsCount: parsedSections.ftps.length,
        treatmentPlanCount: parsedSections.treatmentPlan.length,
        guidelinesCount: parsedSections.conditionGuidelines.length,
        sideEffectsCount: parsedSections.sideEffects.length
      });
    }
  }, [fetchCompleted, resultContent, parsedSections]);

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
                ) : resultContent ? (
                  <div id="report-content" className="space-y-8">
                    {parsedSections.ftps.length > 0 && <FTPSection ftps={parsedSections.ftps} />}
                    {parsedSections.treatmentPlan.length > 0 && (
                      <TreatmentPlanSection 
                        treatmentPlan={parsedSections.treatmentPlan} 
                        totalFTPs={parsedSections.ftps.length} 
                      />
                    )}
                    {parsedSections.conditionGuidelines.length > 0 && (
                      <ConditionGuidelinesSection guidelines={parsedSections.conditionGuidelines} />
                    )}
                    {parsedSections.sideEffects.length > 0 && (
                      <SideEffectsSection sideEffects={parsedSections.sideEffects} />
                    )}
                    {parsedSections.ftps.length === 0 && 
                     parsedSections.treatmentPlan.length === 0 && 
                     parsedSections.conditionGuidelines.length === 0 && 
                     parsedSections.sideEffects.length === 0 && (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">Het rapport kon niet correct verwerkt worden. Hieronder is de ruwe inhoud:</p>
                        <div className="mt-4 p-4 bg-gray-100 rounded text-left whitespace-pre-wrap">
                          {resultContent}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-lg text-gray-500">Geen resultaten gevonden</p>
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
