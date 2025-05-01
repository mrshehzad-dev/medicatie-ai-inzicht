
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
  
  if (!content || content.trim() === '') {
    console.log("No content to parse");
    return sections;
  }
  
  try {
    console.log("Starting to parse content:", content.substring(0, 100) + "...");
    
    // Check if content has markdown tables or just raw text
    const hasTables = content.includes("\n|") && content.includes("|-");
    
    // Split content by numbered sections
    const ftpSectionRegex = /1\.\s*\*?\*?FTP['s]*\*?\*?/i;
    const treatmentPlanRegex = /2\.\s*\*?\*?Behandelplan\*?\*?/i;
    const conditionGuidelinesRegex = /3\.\s*\*?\*?Aandoening\s*↔\s*Richtlijn\*?\*?|3\.\s*\*?\*?Aandoening\*?\*?/i;
    const sideEffectsRegex = /4\.\s*\*?\*?Bijwerkingenanalyse|4\.\s*\*?\*?Bijwerkingen\*?\*?/i;
    
    // Find the starting positions of each section
    const ftpStart = content.search(ftpSectionRegex);
    const treatmentPlanStart = content.search(treatmentPlanRegex);
    const conditionStart = content.search(conditionGuidelinesRegex);
    const sideEffectsStart = content.search(sideEffectsRegex);
    
    // Extract each section if found
    let ftpSection = '';
    let treatmentPlanSection = '';
    let conditionSection = '';
    let sideEffectsSection = '';
    
    if (ftpStart !== -1) {
      const endPos = treatmentPlanStart !== -1 ? treatmentPlanStart : content.length;
      ftpSection = content.substring(ftpStart, endPos).trim();
      console.log("FTP section found:", ftpSection.substring(0, 100) + "...");
    }
    
    if (treatmentPlanStart !== -1) {
      const endPos = conditionStart !== -1 ? conditionStart : content.length;
      treatmentPlanSection = content.substring(treatmentPlanStart, endPos).trim();
      console.log("Treatment plan section found:", treatmentPlanSection.substring(0, 100) + "...");
    }
    
    if (conditionStart !== -1) {
      const endPos = sideEffectsStart !== -1 ? sideEffectsStart : content.length;
      conditionSection = content.substring(conditionStart, endPos).trim();
      console.log("Condition section found:", conditionSection.substring(0, 100) + "...");
    }
    
    if (sideEffectsStart !== -1) {
      sideEffectsSection = content.substring(sideEffectsStart).trim();
      console.log("Side effects section found:", sideEffectsSection.substring(0, 100) + "...");
    }
    
    // Process each section content
    if (ftpSection) {
      parseFTPSection(ftpSection, sections);
    }
    
    if (treatmentPlanSection) {
      parseTreatmentPlanSection(treatmentPlanSection, sections);
    }
    
    if (conditionSection) {
      parseConditionSection(conditionSection, sections);
    }
    
    if (sideEffectsSection) {
      parseSideEffectsSection(sideEffectsSection, sections);
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

function parseFTPSection(content: string, sections: ParsedSections) {
  try {
    // Skip the header line
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Try to find a table structure first
    const hasTableFormat = content.includes('|');
    
    if (hasTableFormat) {
      // Find the header row that defines the columns
      const headerRowIndex = lines.findIndex(line => 
        line.includes('Nr') && line.includes('FTP') && line.includes('|'));
      
      if (headerRowIndex !== -1) {
        // Skip the header and separator rows
        for (let i = headerRowIndex + 2; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('|') && line.endsWith('|')) {
            const columns = line.split('|').map(col => col.trim()).filter(col => col);
            if (columns.length >= 5) {
              sections.ftps.push({
                nr: columns[0],
                ftp: columns[1],
                medication: columns[2],
                relevantData: columns[3],
                action: columns[4],
                source: columns.length > 5 ? columns[5] : ''
              });
            }
          }
        }
      } else {
        // Try to extract numbered items
        const ftpItems = lines.filter(line => /^\|\s*\d+\s*\|/.test(line));
        for (const item of ftpItems) {
          const columns = item.split('|').map(col => col.trim()).filter(col => col);
          if (columns.length >= 2) {
            sections.ftps.push({
              nr: columns[0],
              ftp: columns.length > 1 ? columns[1] : '',
              medication: columns.length > 2 ? columns[2] : '',
              relevantData: columns.length > 3 ? columns[3] : '',
              action: columns.length > 4 ? columns[4] : '',
              source: columns.length > 5 ? columns[5] : ''
            });
          }
        }
      }
    } else {
      // Handle non-table format
      const ftpItems = content.match(/\d+\s*\.\s*[^\n]+/g);
      if (ftpItems && ftpItems.length > 0) {
        ftpItems.forEach((item, i) => {
          const match = item.match(/(\d+)\s*\.\s*(.*)/);
          if (match) {
            sections.ftps.push({
              nr: match[1],
              ftp: match[2],
              medication: '',
              relevantData: '',
              action: '',
              source: ''
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error parsing FTP section:", error);
  }
}

function parseTreatmentPlanSection(content: string, sections: ParsedSections) {
  try {
    // Skip the header line
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Try to find a table structure first
    const hasTableFormat = content.includes('|');
    
    if (hasTableFormat) {
      // Find the header row that defines the columns
      const headerRowIndex = lines.findIndex(line => 
        line.includes('Nr') && line.includes('Interventie') && line.includes('|'));
      
      if (headerRowIndex !== -1) {
        // Skip the header and separator rows
        for (let i = headerRowIndex + 2; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('|') && line.endsWith('|')) {
            const columns = line.split('|').map(col => col.trim()).filter(col => col);
            if (columns.length >= 4) {
              sections.treatmentPlan.push({
                nr: columns[0],
                intervention: columns[1],
                advantages: columns[2], 
                evaluation: columns[3],
                source: columns.length > 4 ? columns[4] : ''
              });
            }
          }
        }
      } else {
        // Try to extract numbered items
        const planItems = lines.filter(line => /^\|\s*\d+\s*\|/.test(line));
        for (const item of planItems) {
          const columns = item.split('|').map(col => col.trim()).filter(col => col);
          if (columns.length >= 2) {
            sections.treatmentPlan.push({
              nr: columns[0],
              intervention: columns.length > 1 ? columns[1] : '',
              advantages: columns.length > 2 ? columns[2] : '',
              evaluation: columns.length > 3 ? columns[3] : '',
              source: columns.length > 4 ? columns[4] : ''
            });
          }
        }
      }
      
      // If we couldn't find any items, look for another structure
      if (sections.treatmentPlan.length === 0) {
        // Special handling for the given sample
        const totalFtpMatch = content.match(/Totaal aantal FTP['s]*:\s*(\d+)/i);
        if (totalFtpMatch) {
          console.log(`Found total FTP count: ${totalFtpMatch[1]}`);
        }
        
        // Look for items with a number prefix like "| 1 | Intervention..."
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.match(/\|\s*\d+\s*\|/)) {
            const columns = line.split('|').map(col => col.trim()).filter(col => col);
            if (columns.length >= 2) {
              sections.treatmentPlan.push({
                nr: columns[0],
                intervention: columns.length > 1 ? columns[1] : '',
                advantages: columns.length > 2 ? columns[2] : '',
                evaluation: columns.length > 3 ? columns[3] : '',
                source: columns.length > 4 ? columns[4] : ''
              });
            }
          }
        }
      }
    } else {
      // Handle non-table format
      const planItems = content.match(/\d+\s*\.\s*[^\n]+/g);
      if (planItems && planItems.length > 0) {
        planItems.forEach((item, i) => {
          const match = item.match(/(\d+)\s*\.\s*(.*)/);
          if (match) {
            sections.treatmentPlan.push({
              nr: match[1],
              intervention: match[2],
              advantages: '',
              evaluation: '',
              source: ''
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error parsing Treatment Plan section:", error);
  }
}

function parseConditionSection(content: string, sections: ParsedSections) {
  try {
    // Skip the header line
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Try to find a table structure
    const hasTableFormat = content.includes('|');
    
    if (hasTableFormat) {
      // Find the header row that defines the columns
      const headerRowIndex = lines.findIndex(line => 
        line.includes('Aandoening') && line.includes('Richtlijn') && line.includes('|'));
      
      if (headerRowIndex !== -1) {
        // Skip the header and separator rows
        for (let i = headerRowIndex + 2; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('|') && line.endsWith('|')) {
            const columns = line.split('|').map(col => col.trim()).filter(col => col);
            if (columns.length >= 3) {
              sections.conditionGuidelines.push({
                condition: columns[0],
                guideline: columns[1],
                deviation: columns[2]
              });
            }
          }
        }
      } else {
        // If no header row, try to find lines with the right structure
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('|') && line.endsWith('|') && !line.includes('---')) {
            const columns = line.split('|').map(col => col.trim()).filter(col => col);
            if (columns.length >= 3) {
              sections.conditionGuidelines.push({
                condition: columns[0],
                guideline: columns[1],
                deviation: columns[2]
              });
            }
          }
        }
      }
    } else {
      // Extract from the first line after the header if no table structure
      if (lines.length > 1) {
        const parts = lines[1].split(/\s*[|;:]\s*/);
        if (parts.length >= 3) {
          sections.conditionGuidelines.push({
            condition: parts[0],
            guideline: parts[1],
            deviation: parts[2]
          });
        } else {
          // Just use what we have
          sections.conditionGuidelines.push({
            condition: lines[1],
            guideline: '',
            deviation: ''
          });
        }
      }
    }
  } catch (error) {
    console.error("Error parsing Condition section:", error);
  }
}

function parseSideEffectsSection(content: string, sections: ParsedSections) {
  try {
    // Skip the header line
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Try to find a table structure
    const hasTableFormat = content.includes('|');
    
    if (hasTableFormat) {
      // Find the header row that defines the columns
      const headerRowIndex = lines.findIndex(line => 
        line.includes('Bijwerking') || line.includes('Side Effect'));
      
      if (headerRowIndex !== -1) {
        // Skip the header and separator rows
        for (let i = headerRowIndex + 2; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('|') && line.endsWith('|')) {
            const columns = line.split('|').map(col => col.trim()).filter(col => col);
            if (columns.length >= 5) {
              sections.sideEffects.push({
                sideEffect: columns[0],
                medications: columns[1],
                timeline: columns[2],
                alternativeCauses: columns[3],
                monitoring: columns[4],
                source: columns.length > 5 ? columns[5] : ''
              });
            }
          }
        }
      } else {
        // If no header row, try to find lines with the right structure
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('|') && line.endsWith('|') && !line.includes('---')) {
            const columns = line.split('|').map(col => col.trim()).filter(col => col);
            if (columns.length >= 5) {
              sections.sideEffects.push({
                sideEffect: columns[0],
                medications: columns[1],
                timeline: columns[2],
                alternativeCauses: columns[3],
                monitoring: columns[4],
                source: columns.length > 5 ? columns[5] : ''
              });
            }
          }
        }
      }
    } else {
      // Extract from the first line after the header if no table structure
      if (lines.length > 1) {
        const parts = lines[1].split(/\s*[|;:]\s*/);
        if (parts.length >= 5) {
          sections.sideEffects.push({
            sideEffect: parts[0],
            medications: parts[1],
            timeline: parts[2],
            alternativeCauses: parts[3],
            monitoring: parts[4],
            source: parts.length > 5 ? parts[5] : ''
          });
        } else {
          // Just use what we have
          sections.sideEffects.push({
            sideEffect: lines[1],
            medications: '',
            timeline: '',
            alternativeCauses: '',
            monitoring: '',
            source: ''
          });
        }
      }
    }
  } catch (error) {
    console.error("Error parsing Side Effects section:", error);
  }
}
