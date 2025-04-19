
export type AgeCategory = "0-18" | "18-60" | "60-70" | "70+";
export type Gender = "Male" | "Female";

export type FarmacogeneticaOption =
  | "CYP2D6 PM"
  | "CYP2D6 IM"
  | "CYP2D6 UM"
  | "CYP3A4 PM"
  | "CYP3A4 IM"
  | "CYP3A4 UM"
  | "CYP2C19 PM"
  | "CYP2C19 IM"
  | "CYP2C19 UM"
  | "UGT1A1 PM"
  | "UGT1A1 IM"
  | "UGT1A1 UM"
  | "DPYD AS 0,5"
  | "DPYD AS 1,0"
  | "DPYD AS 1,5"
  | "DPYD AS 2,0";

export type ElektrolytenOption =
  | "Hyponatriëmie"
  | "Hypernatriëmie"
  | "Hypokaliëmie"
  | "Hyperkaliëmie"
  | "Hypocalciëmie"
  | "Hypercalciëmie"
  | "Hypomagnesiëmie"
  | "Hypermagnesiëmie"
  | "Hypothyreoïdie"
  | "Hyperthyreoïdie";

export type CVRMOption =
  | "Hypertensie"
  | "Hypotensie"
  | "Verhoogd LDL‑cholesterol"
  | "Laag LDL‑cholesterol"
  | "Verhoogd HDL‑cholesterol"
  | "Laag HDL‑cholesterol"
  | "Verhoogd totaal cholesterol"
  | "Hypertriglyceridemie"
  | "Diabetes mellitus type 1"
  | "Diabetes mellitus type 2"
  | "Hartfalen"
  | "Atriumfibrilleren"
  | "Coronaire hartziekte / status post‑MI"
  | "Perifeer arterieel vaatlijden"
  | "Cerebrovasculaire ziekte (beroerte / TIA)"
  | "Metabool syndroom";

export type DiabetesOption =
  | "Verhoogd HbA1C"
  | "Verlaagd HbA1C"
  | "Verhoogd nuchtere glucose"
  | "Verlaagd nuchtere glucose";

export interface FormData {
  ageCategory: AgeCategory;
  weight: number;
  kidneyFunction: number;
  gender: Gender;
  farmacogenetica: FarmacogeneticaOption[];
  liverFunction: {
    alt: number;
    ast: number;
  };
  elektrolyten: ElektrolytenOption[];
  cvrm: CVRMOption[];
  diabetes: DiabetesOption[];
  currentMedication: string;
  anamnesisSummary: string;
  additionalInfo: string;
}
