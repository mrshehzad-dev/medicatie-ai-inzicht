
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
    console.log("Starting to parse content:", content.substring(0, 100) + "...");
    
    // Check if content has markdown tables or just raw text
    const hasTables = content.includes("\n|") && content.includes("|-");
    
    if (hasTables) {
      // Process markdown tables
      const ftpMatch = content.match(/#+\s*1\.\s*FTP['s]*[\s\S]*?(?=\n#+\s*2\.|\n$)/i);
      const treatmentPlanMatch = content.match(/#+\s*2\.\s*Behandelplan[\s\S]*?(?=\n#+\s*3\.|\n$)/i);
      const conditionGuidelinesMatch = content.match(/#+\s*3\.\s*Aandoening[\s\S]*?(?=\n#+\s*4\.|\n$)/i);
      const sideEffectsMatch = content.match(/#+\s*4\.\s*Bijwerkingen[\s\S]*?(?=\n#+\s*5\.|\n$)/i);
      
      console.log("Markdown tables found - Sections detected:", {
        ftps: !!ftpMatch,
        treatmentPlan: !!treatmentPlanMatch,
        guidelines: !!conditionGuidelinesMatch,
        sideEffects: !!sideEffectsMatch
      });
      
      // Process FTPs table
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

      // Process Treatment Plan table
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

      // Process Condition Guidelines table
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

      // Process Side Effects table
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
    } else {
      // Process raw text format
      console.log("No markdown tables found, parsing raw text");
      
      // FTP section - Try to parse a format like: "1. FTPs | No | FTP | Current medication"
      const ftpRegex = /(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]*)/g;
      let ftpMatch;
      while ((ftpMatch = ftpRegex.exec(content)) !== null) {
        sections.ftps.push({
          nr: ftpMatch[1].trim(),
          ftp: ftpMatch[2].trim(),
          medication: ftpMatch[3].trim(),
          relevantData: ftpMatch[4].trim(),
          action: ftpMatch[5].trim(),
          source: ftpMatch[6]?.trim() || ''
        });
      }
      
      // Treatment plan section
      const treatmentRegex = /(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]*)/g;
      const treatmentSectionStart = content.indexOf("2. Treatment plan");
      const treatmentSectionEnd = content.indexOf("3.", treatmentSectionStart);
      
      if (treatmentSectionStart > -1) {
        const treatmentSection = content.substring(
          treatmentSectionStart, 
          treatmentSectionEnd > -1 ? treatmentSectionEnd : undefined
        );
        
        let treatmentMatch;
        while ((treatmentMatch = treatmentRegex.exec(treatmentSection)) !== null) {
          sections.treatmentPlan.push({
            nr: treatmentMatch[1].trim(),
            intervention: treatmentMatch[2].trim(),
            advantages: treatmentMatch[3].trim(),
            evaluation: treatmentMatch[4].trim(),
            source: treatmentMatch[5]?.trim() || ''
          });
        }
      }
    }
    
    console.log("Parsing complete. Sections found:", {
      ftpsCount: sections.ftps.length,
      treatmentPlanCount: sections.treatmentPlan.length,
      guidelinesCount: sections.conditionGuidelines.length,
      sideEffectsCount: sections.sideEffects.length
    });
  } catch (error) {
    console.error("Error parsing structured content:", error);
  }
  
  return sections;
};
