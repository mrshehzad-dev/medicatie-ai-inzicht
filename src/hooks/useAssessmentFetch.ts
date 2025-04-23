
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

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      
      const assessmentId = localStorage.getItem('currentAssessmentId');
      
      if (!assessmentId) {
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
        
        const displayContent = automationResponse || content;
        setResultContent(displayContent || "");
        
        if (displayContent) {
          setHtmlContent(marked.parse(displayContent) as string);
          setParsedSections(parseStructuredContent(displayContent));
        }
        
        setLoading(false);
        return;
      }
      
      try {
        const { data: assessment, error } = await supabase
          .from('assessments')
          .select('report_data')
          .eq('id', assessmentId)
          .maybeSingle();
        
        if (error) throw error;
        
        if (assessment?.report_data) {
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
      } catch (error) {
        console.error('Error fetching assessment:', error);
        toast({
          title: "Fout bij ophalen",
          description: "Er is een fout opgetreden bij het ophalen van de medicatiebeoordeling.",
          variant: "destructive",
        });
        
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
      }
      
      setLoading(false);
    };

    fetchResult();
  }, [navigate, toast]);

  return {
    resultContent,
    htmlContent,
    loading,
    parsedSections
  };
};
