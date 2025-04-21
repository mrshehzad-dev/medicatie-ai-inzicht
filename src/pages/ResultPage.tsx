
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ButtonCTA from "@/components/ui/button-cta";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Copy } from "lucide-react";
import html2pdf from "html2pdf.js";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResultPage = () => {
  const navigate = useNavigate();
  const [resultContent, setResultContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [parsedSections, setParsedSections] = useState<any>({
    ftps: [],
    treatmentPlan: [],
    conditionGuidelines: [],
    sideEffects: [],
    references: []
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
          parseStructuredContent(displayContent);
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
            parseStructuredContent(displayContent);
          }
        } else {
          navigate("/");
          return;
        }
      } else if (assessment && assessment.report_data) {
        setResultContent(assessment.report_data);
        setHtmlContent(marked.parse(assessment.report_data) as string);
        parseStructuredContent(assessment.report_data);
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

  const parseStructuredContent = (content: string) => {
    // Initialize sections object
    const sections: any = {
      ftps: [],
      treatmentPlan: [],
      conditionGuidelines: [],
      sideEffects: [],
      references: []
    };
    
    try {
      // Regular expressions to extract table data
      const ftpMatch = content.match(/\|\s*Nr\s*\|\s*FTP\s*\|\s*Actuele medicatie\s*\|\s*Relevante data[\s\S]*?(?=\n\n|\n\d\.|\n$)/);
      const treatmentPlanMatch = content.match(/\|\s*Nr\s*\|\s*Interventie\s*\|\s*Voordelen[\s\S]*?(?=\n\n|\n\d\.|\n$)/);
      const conditionGuidelinesMatch = content.match(/\|\s*Aandoening\s*\|\s*Richtlijn[\s\S]*?(?=\n\n|\n\d\.|\n$)/);
      const sideEffectsMatch = content.match(/\|\s*Bijwerking\s*\|\s*Mogelijke middelen[\s\S]*?(?=\n\n|\n\d\.|\n$)/);
      const referencesMatch = content.match(/\[\d+\][\s\S]*?(?=\n\n|\n$)/g);
      
      // Parse FTPs
      if (ftpMatch && ftpMatch[0]) {
        const rows = ftpMatch[0].split('\n').filter(row => row.includes('|'));
        // Skip header and separator rows
        for (let i = 2; i < rows.length; i++) {
          const columns = rows[i].split('|').map(col => col.trim()).filter(col => col);
          if (columns.length >= 5) {
            sections.ftps.push({
              nr: columns[0],
              ftp: columns[1],
              medication: columns[2],
              relevantData: columns[3],
              action: columns[4],
              source: columns[5] || ''
            });
          }
        }
      }

      // Parse Treatment Plan
      if (treatmentPlanMatch && treatmentPlanMatch[0]) {
        const rows = treatmentPlanMatch[0].split('\n').filter(row => row.includes('|'));
        // Skip header and separator rows
        for (let i = 2; i < rows.length; i++) {
          const columns = rows[i].split('|').map(col => col.trim()).filter(col => col);
          if (columns.length >= 4) {
            sections.treatmentPlan.push({
              nr: columns[0],
              intervention: columns[1],
              advantages: columns[2],
              evaluation: columns[3],
              source: columns[4] || ''
            });
          }
        }
      }

      // Parse Condition Guidelines
      if (conditionGuidelinesMatch && conditionGuidelinesMatch[0]) {
        const rows = conditionGuidelinesMatch[0].split('\n').filter(row => row.includes('|'));
        // Skip header and separator rows
        for (let i = 2; i < rows.length; i++) {
          const columns = rows[i].split('|').map(col => col.trim()).filter(col => col);
          if (columns.length >= 3) {
            sections.conditionGuidelines.push({
              condition: columns[0],
              guideline: columns[1],
              deviation: columns[2]
            });
          }
        }
      }

      // Parse Side Effects
      if (sideEffectsMatch && sideEffectsMatch[0]) {
        const rows = sideEffectsMatch[0].split('\n').filter(row => row.includes('|'));
        // Skip header and separator rows
        for (let i = 2; i < rows.length; i++) {
          const columns = rows[i].split('|').map(col => col.trim()).filter(col => col);
          if (columns.length >= 5) {
            sections.sideEffects.push({
              sideEffect: columns[0],
              medications: columns[1],
              timeline: columns[2],
              alternativeCauses: columns[3],
              monitoring: columns[4],
              source: columns[5] || ''
            });
          }
        }
      }

      // Parse References
      if (referencesMatch) {
        sections.references = referencesMatch.map(ref => ref.trim());
      }

      setParsedSections(sections);
    } catch (error) {
      console.error("Error parsing structured content:", error);
      // If parsing fails, we'll fall back to the regular rendering method
    }
  };

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
    
    // Set options for PDF generation
    const options = {
      margin: [10, 10, 10, 10],
      filename: 'medicatiebeoordeling.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate PDF
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
    // Clear all stored data
    localStorage.removeItem("medicatiebeoordelingResultaat");
    localStorage.removeItem("automationResponse");
    localStorage.removeItem("currentAssessmentId");
    navigate("/keuze");
  };

  const renderStructuredResult = () => {
    const { ftps, treatmentPlan, conditionGuidelines, sideEffects, references } = parsedSections;
    const hasParsedData = ftps.length > 0 || treatmentPlan.length > 0 || conditionGuidelines.length > 0 || sideEffects.length > 0;
    
    if (!hasParsedData) {
      // Fall back to regular HTML content if parsing failed
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    }
    
    return (
      <div className="space-y-8" id="report-content">
        {/* FTPs Section */}
        {ftps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">1. FTP's</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Nr.</TableHead>
                    <TableHead>FTP</TableHead>
                    <TableHead>Actuele medicatie</TableHead>
                    <TableHead>Relevante data (lab, klinisch)</TableHead>
                    <TableHead>STOP/START</TableHead>
                    <TableHead className="w-20">Bron</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ftps.map((item: any, index: number) => (
                    <TableRow key={`ftp-${index}`}>
                      <TableCell>{item.nr}</TableCell>
                      <TableCell>{item.ftp}</TableCell>
                      <TableCell>{item.medication}</TableCell>
                      <TableCell>{item.relevantData}</TableCell>
                      <TableCell>{item.action}</TableCell>
                      <TableCell>{item.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Treatment Plan Section */}
        {treatmentPlan.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">2. Behandelplan</CardTitle>
              <div className="text-sm font-medium mb-2">Totaal aantal FTP's: {ftps.length}</div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Nr.</TableHead>
                    <TableHead>Interventie (middel + dosis)</TableHead>
                    <TableHead>Voordelen / Nadelen</TableHead>
                    <TableHead>Evaluatie</TableHead>
                    <TableHead className="w-20">Bron</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treatmentPlan.map((item: any, index: number) => (
                    <TableRow key={`treatment-${index}`}>
                      <TableCell>{item.nr}</TableCell>
                      <TableCell>{item.intervention}</TableCell>
                      <TableCell>{item.advantages}</TableCell>
                      <TableCell>{item.evaluation}</TableCell>
                      <TableCell>{item.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Condition Guidelines Section */}
        {conditionGuidelines.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">3. Aandoening ↔ Richtlijn</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aandoening</TableHead>
                    <TableHead>Richtlijn­behandeling</TableHead>
                    <TableHead>Afwijking & reden</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conditionGuidelines.map((item: any, index: number) => (
                    <TableRow key={`condition-${index}`}>
                      <TableCell>{item.condition}</TableCell>
                      <TableCell>{item.guideline}</TableCell>
                      <TableCell>{item.deviation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Side Effects Section */}
        {sideEffects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">4. Bijwerkingenanalyse (BATM)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bijwerking</TableHead>
                    <TableHead>Mogelijke middelen</TableHead>
                    <TableHead>Tijdsbeloop</TableHead>
                    <TableHead>Alternatieve oorzaken</TableHead>
                    <TableHead>Monitoring</TableHead>
                    <TableHead className="w-20">Bron</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sideEffects.map((item: any, index: number) => (
                    <TableRow key={`side-effect-${index}`}>
                      <TableCell>{item.sideEffect}</TableCell>
                      <TableCell>{item.medications}</TableCell>
                      <TableCell>{item.timeline}</TableCell>
                      <TableCell>{item.alternativeCauses}</TableCell>
                      <TableCell>{item.monitoring}</TableCell>
                      <TableCell>{item.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* References Section */}
        {references.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">5. Referentielijst</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-1">
                {references.map((ref: string, index: number) => (
                  <li key={`ref-${index}`}>{ref}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Fallback for any unparsed content */}
        {!hasParsedData && (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )}
      </div>
    );
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
                  renderStructuredResult()
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
