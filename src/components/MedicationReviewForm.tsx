
import { useState } from "react";
import { FormData, AgeCategory, Gender } from "@/types/form-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ButtonCTA from "@/components/ui/button-cta";
import { AGE_CATEGORIES, FARMACOGENETICA_OPTIONS, ELEKTROLYTEN_OPTIONS, CVRM_OPTIONS, DIABETES_OPTIONS } from "@/lib/constants";

interface Props {
  type: "public" | "hospital";
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

const MedicationReviewForm = ({ type, onSubmit, isSubmitting = false }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    ageCategory: "18-60",
    weight: 0,
    kidneyFunction: 0,
    gender: "Male",
    farmacogenetica: [],
    liverFunction: {
      alt: 0,
      ast: 0
    },
    elektrolyten: [],
    cvrm: [],
    diabetes: [],
    currentMedication: "",
    anamnesisSummary: "",
    additionalInfo: ""
  });

  const handleMultiSelectChange = (field: keyof FormData, value: string) => {
    const array = formData[field] as string[];
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting) {
      setLoading(true);
      try {
        await onSubmit(formData);
        // Removed the navigate call - this will be handled in the parent component
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leeftijd
          </label>
          <Select
            value={formData.ageCategory}
            onValueChange={(value) => setFormData(prev => ({ ...prev, ageCategory: value as AgeCategory }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer leeftijdscategorie" />
            </SelectTrigger>
            <SelectContent>
              {AGE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gewicht (Kg)
          </label>
          <Input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
            min={0}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nierfunctie (eGFR)
          </label>
          <Input
            type="number"
            value={formData.kidneyFunction}
            onChange={(e) => setFormData(prev => ({ ...prev, kidneyFunction: Number(e.target.value) }))}
            min={0}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Geslacht
          </label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as Gender }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer geslacht" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Man</SelectItem>
              <SelectItem value="Female">Vrouw</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Farmacogenetica
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {FARMACOGENETICA_OPTIONS.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.farmacogenetica.includes(option)}
                onChange={() => handleMultiSelectChange('farmacogenetica', option)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Leverfunctie
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">ALT</label>
            <Input
              type="number"
              value={formData.liverFunction.alt}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                liverFunction: { ...prev.liverFunction, alt: Number(e.target.value) }
              }))}
              min={0}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">AST</label>
            <Input
              type="number"
              value={formData.liverFunction.ast}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                liverFunction: { ...prev.liverFunction, ast: Number(e.target.value) }
              }))}
              min={0}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Elektrolyten & Schildklierstoornissen
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {ELEKTROLYTEN_OPTIONS.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.elektrolyten.includes(option)}
                onChange={() => handleMultiSelectChange('elektrolyten', option)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CVRM
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {CVRM_OPTIONS.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.cvrm.includes(option)}
                onChange={() => handleMultiSelectChange('cvrm', option)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Diabetes
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {DIABETES_OPTIONS.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.diabetes.includes(option)}
                onChange={() => handleMultiSelectChange('diabetes', option)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Huidige Medicatie
        </label>
        <Textarea
          value={formData.currentMedication}
          onChange={(e) => setFormData(prev => ({ ...prev, currentMedication: e.target.value }))}
          rows={5}
          placeholder="Voer elk medicijn met de huidige (dag)dosering op een nieuwe regel in"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Samenvatting anamneses gesprek
        </label>
        <Textarea
          value={formData.anamnesisSummary}
          onChange={(e) => setFormData(prev => ({ ...prev, anamnesisSummary: e.target.value }))}
          rows={3}
          placeholder="Houd de informatie anoniem"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Overige informatie
        </label>
        <Textarea
          value={formData.additionalInfo}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
          rows={2}
          placeholder="Houd de informatie anoniem"
        />
      </div>

      <div className="flex justify-end">
        <ButtonCTA className={isSubmitting ? 'opacity-75 cursor-not-allowed' : ''} type="submit">
          {isSubmitting ? (
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
  );
};

export default MedicationReviewForm;
