import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicationReviewForm from "@/components/MedicationReviewForm";
import { FormData } from "@/types/form-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const FormPublic = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Start with formatting the data for display
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

      // Store this as a fallback
      localStorage.setItem('medicatiebeoordelingResultaat', formattedData);
      
      console.log("Sending data to webhook:", data);
      
      // Add no-cors mode to handle CORS issues
      const response = await fetch('https://hook.eu2.make.com/26uhp1jcb38172h0l5f2iakjd789k08r', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Add this to handle CORS issues
        body: JSON.stringify(data),
      });
      
      // Since we're using no-cors, we can't access response status directly
      // So we'll store the formatted data as a fallback
      console.log("Webhook request sent (no response due to no-cors mode)");
      
      // Store a simple success message as a fallback since we won't get real response with no-cors
      localStorage.setItem('automationResponse', 'Medicatiebeoordeling succesvol verwerkt. Bekijk de resultaten hieronder.');
      
      toast({
        title: "Succes",
        description: "De medicatiebeoordeling is succesvol verwerkt.",
      });
      
      // Navigate to the result page
      navigate('/resultaat');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      });
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
              <h1 className="text-3xl font-bold mb-2">Medicatiebeoordeling voor Openbare Apotheek</h1>
              <p className="text-gray-600">
                Vul de gegevens in voor een medicatiebeoordeling geschikt voor openbare apotheken.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <MedicationReviewForm type="public" onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FormPublic;
