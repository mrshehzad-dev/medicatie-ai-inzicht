
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ButtonCTA from "@/components/ui/button-cta";
import { useNavigate } from "react-router-dom";

const FormHospital = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientNaam: "",
    patientLeeftijd: "",
    patientID: "",
    opnameafdeling: "",
    opnamedatum: "",
    medicatieLijst: "",
    labwaarden: "",
    medischeGeschiedenis: "",
    allergieën: "",
    extraOpmerkingen: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In een echte applicatie zou dit naar een echte backend URL gaan
      const response = await fetch("https://yourdomain.com/webhook-hospital", {
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
          # Medicatiebeoordeling voor ${formData.patientNaam}
          
          ## Patiëntgegevens
          - Leeftijd: ${formData.patientLeeftijd} jaar
          - Patiënt ID: ${formData.patientID}
          - Opgenomen op: ${formData.opnamedatum}
          - Afdeling: ${formData.opnameafdeling}
          
          ## Medicatiebeoordeling
          Op basis van de verstrekte medicatielijst, labwaarden en medische geschiedenis, hebben we de volgende aandachtspunten geïdentificeerd:
          
          1. **Potentiële interacties**: Er zijn mogelijke interacties tussen medicijnen X en Y.
          2. **Dosisoptimalisatie**: De dosis van medicijn Z zou aangepast moeten worden gezien de verminderde nierfunctie.
          3. **Contra-indicaties**: Medicijn A is gecontra-indiceerd voor patiënten met de aandoening van deze patiënt.
          
          ## Aanbevelingen
          - Stop medicijn A en vervang door alternatief B
          - Verlaag de dosis van medicijn Z met 50%
          - Voeg preventief medicijn C toe gezien de risicofactoren
          - Monitor leverwaarden dagelijks
        `
      };

      // Sla het resultaat op in localStorage en stuur de gebruiker naar de resultaatpagina
      localStorage.setItem("medicatiebeoordelingResultaat", result.generatedContent);
      navigate("/resultaat");
    } catch (error) {
      console.error("Er is een fout opgetreden:", error);
      alert("Er is een fout opgetreden bij het verwerken van uw verzoek. Probeer het later opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Medicatiebeoordeling - Ziekenhuis Apotheek</h1>
              <p className="text-gray-600 mb-8">
                Vul alle relevante informatie in over uw patiënt en diens medicatie om een AI-gegenereerde medicatiebeoordeling te ontvangen.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="patientNaam" className="block text-sm font-medium text-gray-700 mb-1">
                      Naam patiënt
                    </label>
                    <input
                      type="text"
                      id="patientNaam"
                      name="patientNaam"
                      value={formData.patientNaam}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="patientLeeftijd" className="block text-sm font-medium text-gray-700 mb-1">
                      Leeftijd patiënt
                    </label>
                    <input
                      type="number"
                      id="patientLeeftijd"
                      name="patientLeeftijd"
                      value={formData.patientLeeftijd}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="patientID" className="block text-sm font-medium text-gray-700 mb-1">
                      Patiënt ID
                    </label>
                    <input
                      type="text"
                      id="patientID"
                      name="patientID"
                      value={formData.patientID}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="opnamedatum" className="block text-sm font-medium text-gray-700 mb-1">
                      Opnamedatum
                    </label>
                    <input
                      type="date"
                      id="opnamedatum"
                      name="opnamedatum"
                      value={formData.opnamedatum}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="opnameafdeling" className="block text-sm font-medium text-gray-700 mb-1">
                    Opnameafdeling
                  </label>
                  <select
                    id="opnameafdeling"
                    name="opnameafdeling"
                    value={formData.opnameafdeling}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecteer afdeling</option>
                    <option value="Interne Geneeskunde">Interne Geneeskunde</option>
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Neurologie">Neurologie</option>
                    <option value="Chirurgie">Chirurgie</option>
                    <option value="Geriatrie">Geriatrie</option>
                    <option value="Oncologie">Oncologie</option>
                    <option value="Intensive Care">Intensive Care</option>
                    <option value="Orthopedie">Orthopedie</option>
                    <option value="Kindergeneeskunde">Kindergeneeskunde</option>
                    <option value="Andere">Andere</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="medicatieLijst" className="block text-sm font-medium text-gray-700 mb-1">
                    Medicatielijst (één medicijn per regel)
                  </label>
                  <textarea
                    id="medicatieLijst"
                    name="medicatieLijst"
                    value={formData.medicatieLijst}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="labwaarden" className="block text-sm font-medium text-gray-700 mb-1">
                    Relevante labwaarden
                  </label>
                  <textarea
                    id="labwaarden"
                    name="labwaarden"
                    value={formData.labwaarden}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="medischeGeschiedenis" className="block text-sm font-medium text-gray-700 mb-1">
                    Medische geschiedenis
                  </label>
                  <textarea
                    id="medischeGeschiedenis"
                    name="medischeGeschiedenis"
                    value={formData.medischeGeschiedenis}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="allergieën" className="block text-sm font-medium text-gray-700 mb-1">
                    Allergieën
                  </label>
                  <input
                    type="text"
                    id="allergieën"
                    name="allergieën"
                    value={formData.allergieën}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="extraOpmerkingen" className="block text-sm font-medium text-gray-700 mb-1">
                    Extra opmerkingen
                  </label>
                  <textarea
                    id="extraOpmerkingen"
                    name="extraOpmerkingen"
                    value={formData.extraOpmerkingen}
                    onChange={handleChange}
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <ButtonCTA 
                    className={`${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    onClick={undefined}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verwerken...
                      </span>
                    ) : (
                      "Beoordeling genereren"
                    )}
                  </ButtonCTA>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FormHospital;
