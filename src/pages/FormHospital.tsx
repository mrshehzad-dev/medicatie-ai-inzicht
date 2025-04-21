import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicationReviewForm from "@/components/MedicationReviewForm";
import { FormData } from "@/types/form-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

const FormHospital = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setShowProgress(true);
    setProgress(10);
    
    try {
      // Format data for display (as fallback)
      const formattedData = Object.entries(data)
        .map(([key, value]) => {
          if (key === 'liverFunction') {
            return `## Leverfunctie\n- ALT: ${value.alt}\n- AST: ${value.ast}`;
          }
          if (Array.isArray(value)) {
            if (value.length === 0) return `## ${key}\nGeen`;
            return `## ${key}\n${value.map(v => `- ${v}`).join('\n')}`;
          }
          return `## ${key}\n${value}`;
        })
        .join('\n\n');

      // First, insert the form data into the database
      const { data: assessment, error: insertError } = await supabase
        .from('assessments')
        .insert({
          form_data: data,
          report_data: formattedData, // Use formatted data as initial value
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error saving form data:', insertError);
        throw new Error('Failed to save form data to database');
      }

      const assessmentId = assessment.id;
      console.log("Assessment saved with ID:", assessmentId);
      
      setProgress(30);
      
      // Use a timeout-based approach with fetch to ensure we wait for a response
      const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 60000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal
          });
          clearTimeout(id);
          return response;
        } catch (error) {
          clearTimeout(id);
          throw error;
        }
      };
      
      // Send data to the webhook
      const webhookResponse = await fetchWithTimeout('https://hook.eu2.make.com/7jnw8qpba5xmyjyooi65l31eblalx9sa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, assessmentId}),
      }, 45000); // 45 second timeout
      
      setProgress(70);
      
      if (webhookResponse.ok) {
        console.log("Webhook response successful");
        // Get the response data
        const responseData = await webhookResponse.text();
        console.log("Response data:", responseData);

        // Update the assessment record with the report data
        const { error: updateError } = await supabase
          .from('assessments')
          .update({ report_data: responseData || formattedData })
          .eq('id', assessmentId);

        if (updateError) {
          console.error('Error updating report data:', updateError);
          throw new Error('Failed to update report data in database');
        }
        
        setProgress(100);
        
        toast({
          title: "Succes",
          description: "De medicatiebeoordeling is succesvol verwerkt.",
        });
        
        // Store the assessment ID in localStorage for the result page
        localStorage.setItem('currentAssessmentId', assessmentId);
        
        // Navigate to the result page after a brief delay to show progress completion
        setTimeout(() => {
          navigate('/resultaat');
        }, 500);
      } else {
        console.error("Webhook response not OK:", webhookResponse.status, webhookResponse.statusText);
        
        // If webhook fails, still use the formatted data
        setProgress(100);
        
        toast({
          title: "Beperkte respons",
          description: "De volledige medicatiebeoordeling kon niet worden opgehaald, maar we tonen de basis informatie.",
          variant: "destructive",
        });
        
        // Store the assessment ID in localStorage for the result page
        localStorage.setItem('currentAssessmentId', assessmentId);
        
        // Still navigate to result page after a brief delay
        setTimeout(() => {
          navigate('/resultaat');
        }, 500);
      }
    } catch (error) {
      console.error('Error:', error);
      setProgress(100);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        toast({
          title: "Timeout",
          description: "De server reageerde niet binnen de verwachte tijd. Probeer het later opnieuw.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fout",
          description: "Er is een fout opgetreden. Probeer het opnieuw.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Medicatiebeoordeling voor Ziekenhuisapotheek</h1>
              <p className="text-gray-600">
                Vul de gegevens in voor een medicatiebeoordeling geschikt voor ziekenhuisapotheken.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                {showProgress && (
                  <div className="mb-8">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {progress < 100 
                        ? "Medicatiebeoordeling wordt gegenereerd..." 
                        : "Genereren voltooid!"}
                    </p>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                <MedicationReviewForm type="hospital" onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FormHospital;
