
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicationReviewForm from "@/components/MedicationReviewForm";
import { FormData } from "@/types/form-types";

const FormHospital = () => {
  const handleSubmit = async (formData: FormData) => {
    const response = await fetch("https://hook.eu2.make.com/h84jtchvyxhlnd7w6nnrdvywlw5phcl6", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Simuleer een gegenereerd antwoord
    const result = {
      generatedContent: `
        # Medicatiebeoordeling Ziekenhuis

        ## Patiëntgegevens
        - Leeftijd: ${formData.ageCategory}
        - Gewicht: ${formData.weight} kg
        - Nierfunctie: ${formData.kidneyFunction} eGFR
        - Geslacht: ${formData.gender === 'Male' ? 'Man' : 'Vrouw'}
        
        ## Medicatiebeoordeling
        Gebaseerd op de verstrekte informatie hebben we de volgende aandachtspunten geïdentificeerd:
        
        1. **Farmacogenetica**: ${formData.farmacogenetica.join(', ')}
        2. **Leverfunctie**: ALT: ${formData.liverFunction.alt}, AST: ${formData.liverFunction.ast}
        3. **Elektrolyten**: ${formData.elektrolyten.join(', ')}
        4. **CVRM**: ${formData.cvrm.join(', ')}
        5. **Diabetes**: ${formData.diabetes.join(', ')}
        
        ## Huidige Medicatie
        ${formData.currentMedication}
        
        ## Anamnese
        ${formData.anamnesisSummary}
        
        ## Aanvullende Informatie
        ${formData.additionalInfo}
      `
    };

    localStorage.setItem("medicatiebeoordelingResultaat", result.generatedContent);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">
                Medicatiebeoordeling - Ziekenhuis Apotheek
              </h1>
              <p className="text-gray-600 mb-8">
                Vul alle relevante informatie in over uw patiënt en diens medicatie om een AI-gegenereerde medicatiebeoordeling te ontvangen.
              </p>
              <MedicationReviewForm type="hospital" onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FormHospital;
