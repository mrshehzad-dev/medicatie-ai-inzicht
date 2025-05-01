
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
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ResultPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resultContent, loading, parsedSections, fetchCompleted, rawContentFallback } = useAssessmentFetch();

  useEffect(() => {
    if (fetchCompleted) {
      console.log("Result content available:", !!resultContent);
      console.log("Content length:", resultContent?.length || 0);
      console.log("Raw content fallback needed:", rawContentFallback);
      console.log("Parsed sections:", {
        ftpsCount: parsedSections.ftps.length,
        treatmentPlanCount: parsedSections.treatmentPlan.length,
        guidelinesCount: parsedSections.conditionGuidelines.length,
        sideEffectsCount: parsedSections.sideEffects.length
      });
      
      // Force parsing if we have content but no structured sections
      if (resultContent && 
          parsedSections.ftps.length === 0 &&
          parsedSections.treatmentPlan.length === 0 &&
          parsedSections.conditionGuidelines.length === 0 &&
          parsedSections.sideEffects.length === 0) {
        console.log("Warning: Content exists but no sections were parsed");
      }
    }
  }, [fetchCompleted, resultContent, parsedSections, rawContentFallback]);

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
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Medication Review Result</h1>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleDownloadPDF}
                    className="text-primary hover:text-blue-700 font-medium flex items-center transition-colors"
                    disabled={loading}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PDF
                  </button>
                  <button 
                    onClick={() => {
                      if (navigator.clipboard && resultContent) {
                        navigator.clipboard.writeText(resultContent);
                        toast({
                          title: "Copied",
                          description: "Report has been copied to clipboard!",
                        });
                      }
                    }}
                    className="text-primary hover:text-blue-700 font-medium flex items-center transition-colors"
                    disabled={loading || !resultContent}
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    Copy
                  </button>
                </div>
              </div>
              
              <Separator className="my-6 bg-gray-200" />
              
              <div className="rounded-lg">
                {loading ? (
                  <div className="space-y-6 p-6">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                  </div>
                ) : resultContent ? (
                  <div id="report-content" className="space-y-6">
                    {/* FTP Section */}
                    {parsedSections.ftps.length > 0 ? (
                      <FTPSection ftps={parsedSections.ftps} />
                    ) : null}
                    
                    {/* Treatment Plan Section */}
                    {parsedSections.treatmentPlan.length > 0 ? (
                      <TreatmentPlanSection 
                        treatmentPlan={parsedSections.treatmentPlan} 
                        totalFTPs={parsedSections.ftps.length} 
                      />
                    ) : null}
                    
                    {/* Condition Guidelines Section */}
                    {parsedSections.conditionGuidelines.length > 0 ? (
                      <ConditionGuidelinesSection guidelines={parsedSections.conditionGuidelines} />
                    ) : null}
                    
                    {/* Side Effects Section */}
                    {parsedSections.sideEffects.length > 0 ? (
                      <SideEffectsSection sideEffects={parsedSections.sideEffects} />
                    ) : null}
                    
                    {/* Fallback for raw content when parsing fails */}
                    {rawContentFallback && (
                      <Card className="border border-gray-200 shadow-md rounded-lg overflow-hidden mb-6">
                        <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 pb-4">
                          <CardTitle className="text-xl font-bold text-gray-800">
                            Raw Report Content
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-left whitespace-pre-wrap text-sm overflow-x-auto">
                            {resultContent}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white rounded-lg border border-gray-200 shadow">
                    <p className="text-lg text-gray-500">No results found</p>
                  </div>
                )}
              </div>
              
              <div className="mt-10 flex justify-end">
                <ButtonCTA onClick={handleNewBeoordeling} disabled={loading}>
                  New assessment
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
