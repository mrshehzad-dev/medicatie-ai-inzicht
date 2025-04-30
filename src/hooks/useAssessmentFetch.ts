
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseStructuredContent } from "@/utils/resultParser";

export const useAssessmentFetch = () => {
  const navigate = useNavigate();
  const [resultContent, setResultContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [parsedSections, setParsedSections] = useState(parseStructuredContent(""));
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const [rawContentFallback, setRawContentFallback] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      console.log("Starting to fetch results...");
      
      try {
        const assessmentId = localStorage.getItem('currentAssessmentId');
        console.log("Current assessment ID:", assessmentId);
        
        if (!assessmentId) {
          // Try to get from localStorage if no assessmentId is found
          const content = localStorage.getItem("medicatiebeoordelingResultaat");
          const automationResponse = localStorage.getItem("automationResponse");
          
          console.log("No assessment ID, checking localStorage...");
          console.log("Has content in localStorage:", !!content);
          console.log("Has automation response in localStorage:", !!automationResponse);
          
          if (!content && !automationResponse) {
            toast({
              title: "Geen resultaten gevonden",
              description: "Er zijn geen resultaten gevonden. U wordt doorverwezen naar de startpagina.",
              variant: "destructive",
            });
            navigate("/");
            return;
          }
          
          const displayContent = automationResponse || content || "";
          if (displayContent) {
            console.log("Using content from localStorage");
            console.log("Content sample:", displayContent.substring(0, 200));
            setResultContent(displayContent);
            setHtmlContent(marked.parse(displayContent) as string);
            const parsed = parseStructuredContent(displayContent);
            console.log("Parser results:", {
              ftps: parsed.ftps.length,
              treatmentPlan: parsed.treatmentPlan.length,
              guidelines: parsed.conditionGuidelines.length,
              sideEffects: parsed.sideEffects.length
            });
            setParsedSections(parsed);
            setRawContentFallback(
              parsed.ftps.length === 0 && 
              parsed.treatmentPlan.length === 0 && 
              parsed.conditionGuidelines.length === 0 && 
              parsed.sideEffects.length === 0
            );
          }
          
          setLoading(false);
          setFetchCompleted(true);
          return;
        }
        
        console.log("Fetching assessment with ID:", assessmentId);
        const { data: assessment, error } = await supabase
          .from('assessments')
          .select('report_data')
          .eq('id', assessmentId)
          .maybeSingle();
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        if (assessment?.report_data) {
          console.log("Assessment data fetched successfully");
          console.log("Raw content sample:", assessment.report_data.substring(0, 200));
          
          setResultContent(assessment.report_data);
          setHtmlContent(marked.parse(assessment.report_data) as string);
          
          const parsed = parseStructuredContent(assessment.report_data);
          console.log("Parsed sections:", {
            ftpsCount: parsed.ftps.length,
            treatmentPlanCount: parsed.treatmentPlan.length,
            guidelinesCount: parsed.conditionGuidelines.length,
            sideEffectsCount: parsed.sideEffects.length
          });
          
          setParsedSections(parsed);
          setRawContentFallback(
            parsed.ftps.length === 0 && 
            parsed.treatmentPlan.length === 0 && 
            parsed.conditionGuidelines.length === 0 && 
            parsed.sideEffects.length === 0
          );
          
          // For debugging - add example data if nothing was parsed
          if (parsed.ftps.length === 0 && assessment.report_data.includes("FTP") || 
              assessment.report_data.includes("Hypertension")) {
            console.log("Content contains FTP keywords but no structured data was parsed");
            console.log("Full content for debugging:", assessment.report_data);
          }
        } else {
          console.error("No report_data found for assessment:", assessmentId);
          toast({
            title: "Geen resultaten gevonden",
            description: "Er zijn geen resultaten gevonden. U wordt doorverwezen naar de startpagina.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
      } catch (error) {
        console.error('Error fetching assessment:', error);
        toast({
          title: "Fout bij ophalen",
          description: "Er is een fout opgetreden bij het ophalen van de medicatiebeoordeling.",
          variant: "destructive",
        });
        
        // Try fallback to localStorage if database fetch fails
        const content = localStorage.getItem("medicatiebeoordelingResultaat");
        const automationResponse = localStorage.getItem("automationResponse");
        
        if (content || automationResponse) {
          const displayContent = automationResponse || content || "";
          if (displayContent) {
            console.log("Using fallback content from localStorage");
            setResultContent(displayContent);
            setHtmlContent(marked.parse(displayContent) as string);
            const parsed = parseStructuredContent(displayContent);
            setParsedSections(parsed);
            setRawContentFallback(
              parsed.ftps.length === 0 && 
              parsed.treatmentPlan.length === 0 && 
              parsed.conditionGuidelines.length === 0 && 
              parsed.sideEffects.length === 0
            );
          }
        } else {
          navigate("/");
          return;
        }
      } finally {
        setLoading(false);
        setFetchCompleted(true);
        console.log("Fetch completed");
      }
    };

    fetchResult();
  }, [navigate, toast]);

  return {
    resultContent,
    htmlContent,
    loading,
    parsedSections,
    fetchCompleted,
    rawContentFallback
  };
};
