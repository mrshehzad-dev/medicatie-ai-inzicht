
type ParsedSections = {
  ftps: Array<{
    nr: string;
    ftp: string;
    medication: string;
    relevantData: string;
    action: string;
    source: string;
  }>;
  treatmentPlan: Array<{
    nr: string;
    intervention: string;
    advantages: string;
    evaluation: string;
    source: string;
  }>;
  conditionGuidelines: Array<{
    condition: string;
    guideline: string;
    deviation: string;
  }>;
  sideEffects: Array<{
    sideEffect: string;
    medications: string;
    timeline: string;
    alternativeCauses: string;
    monitoring: string;
    source: string;
  }>;
};

export const parseStructuredContent = (content: string): ParsedSections => {
  const sections: ParsedSections = {
    ftps: [],
    treatmentPlan: [],
    conditionGuidelines: [],
    sideEffects: []
  };
  
  try {
    const ftpMatch = content.match(/### 1\. FTP's[\s\S]*?(?=\n### 2\.|\n$)/);
    const treatmentPlanMatch = content.match(/### 2\. Behandelplan[\s\S]*?(?=\n### 3\.|\n$)/);
    const conditionGuidelinesMatch = content.match(/### 3\. Aandoening ↔ Richtlijn[\s\S]*?(?=\n### 4\.|\n$)/);
    const sideEffectsMatch = content.match(/### 4\. Bijwerkingenanalyse[\s\S]*?(?=\n### 5\.|\n$)/);
    
    if (ftpMatch && ftpMatch[0]) {
      const rows = ftpMatch[0].split('\n').filter(row => row.includes('|'));
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

    if (treatmentPlanMatch && treatmentPlanMatch[0]) {
      const rows = treatmentPlanMatch[0].split('\n').filter(row => row.includes('|'));
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

    if (conditionGuidelinesMatch && conditionGuidelinesMatch[0]) {
      const rows = conditionGuidelinesMatch[0].split('\n').filter(row => row.includes('|'));
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

    if (sideEffectsMatch && sideEffectsMatch[0]) {
      const rows = sideEffectsMatch[0].split('\n').filter(row => row.includes('|'));
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
  } catch (error) {
    console.error("Error parsing structured content:", error);
  }
  
  return sections;
};
