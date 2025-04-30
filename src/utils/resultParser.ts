
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
    
    if (hasTables) {
      // Process markdown tables
      console.log("Detected markdown tables format");
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
        console.log(`FTP rows found: ${rows.length}`);
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
      // Try to find common patterns in the text format
      console.log("No markdown tables found, trying to parse text format");
      
      // Try to identify FTP sections using patterns
      parsePlainTextFTPSection(content, sections);
      
      // Look for treatment plan sections
      parsePlainTextTreatmentPlanSection(content, sections);
      
      // Look for condition guidelines sections
      parsePlainTextConditionSection(content, sections);
      
      // Look for side effects sections
      parsePlainTextSideEffectsSection(content, sections);
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

function parsePlainTextFTPSection(content: string, sections: ParsedSections) {
  try {
    // Look for a section that mentions FTP or starts with "1."
    const ftpSectionMatch = content.match(/(?:1\.|FTP|FTP's).*?(?=2\.|$)/is);
    if (ftpSectionMatch) {
      const ftpSection = ftpSectionMatch[0];
      console.log("Found potential FTP section:", ftpSection.substring(0, 50) + "...");
      
      // Look for patterns like "1. Hypertension" followed by details
      const ftpItems = ftpSection.match(/\d+\.\s*[^\n]+/g);
      if (ftpItems && ftpItems.length > 0) {
        console.log(`Found ${ftpItems.length} potential FTP items`);
        
        ftpItems.forEach((item, index) => {
          // Try to extract structured information
          const numberMatch = item.match(/^(\d+)\.?\s*/);
          const nr = numberMatch ? numberMatch[1] : String(index + 1);
          
          // Remove the number prefix and split by common separators
          const cleanItem = item.replace(/^\d+\.?\s*/, '');
          
          // Check if we have fields separated by delimiters
          const hasDelimiters = /[|;:]/.test(cleanItem);
          
          if (hasDelimiters) {
            // Split by common delimiters
            const parts = cleanItem.split(/[|;:]/).map(p => p.trim());
            sections.ftps.push({
              nr,
              ftp: parts[0] || '',
              medication: parts[1] || '',
              relevantData: parts[2] || '',
              action: parts[3] || '',
              source: parts[4] || ''
            });
          } else {
            // Try to extract based on keywords or just use the whole text
            const actionMatch = cleanItem.match(/STOP|START|consider/i);
            let action = '';
            let ftp = cleanItem;
            
            if (actionMatch) {
              const actionStartIndex = cleanItem.indexOf(actionMatch[0]);
              ftp = cleanItem.substring(0, actionStartIndex).trim();
              action = cleanItem.substring(actionStartIndex).trim();
            }
            
            sections.ftps.push({
              nr,
              ftp,
              medication: '',
              relevantData: '',
              action,
              source: ''
            });
          }
        });
      } else {
        // If no pattern was found, try to look for any structured data like tables
        const lines = ftpSection.split('\n').filter(line => line.trim().length > 0 && /\d+\./.test(line));
        lines.forEach((line, i) => {
          const match = line.match(/(\d+)\.?\s*(.*)/);
          if (match) {
            sections.ftps.push({
              nr: match[1],
              ftp: match[2] || '',
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
    console.error("Error parsing plain text FTP section:", error);
  }
}

function parsePlainTextTreatmentPlanSection(content: string, sections: ParsedSections) {
  try {
    // Look for a section that mentions Treatment plan or starts with "2."
    const planSectionMatch = content.match(/(?:2\.|Treatment plan|Behandelplan).*?(?=3\.|$)/is);
    if (planSectionMatch) {
      const planSection = planSectionMatch[0];
      console.log("Found potential Treatment Plan section");
      
      // Similar parsing logic as FTP section
      const planItems = planSection.match(/\d+\.\s*[^\n]+/g);
      if (planItems && planItems.length > 0) {
        planItems.forEach((item, index) => {
          const numberMatch = item.match(/^(\d+)\.?\s*/);
          const nr = numberMatch ? numberMatch[1] : String(index + 1);
          const cleanItem = item.replace(/^\d+\.?\s*/, '');
          
          const hasDelimiters = /[|;:]/.test(cleanItem);
          if (hasDelimiters) {
            const parts = cleanItem.split(/[|;:]/).map(p => p.trim());
            sections.treatmentPlan.push({
              nr,
              intervention: parts[0] || '',
              advantages: parts[1] || '',
              evaluation: parts[2] || '',
              source: parts[3] || ''
            });
          } else {
            sections.treatmentPlan.push({
              nr,
              intervention: cleanItem,
              advantages: '',
              evaluation: '',
              source: ''
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error parsing plain text Treatment Plan section:", error);
  }
}

function parsePlainTextConditionSection(content: string, sections: ParsedSections) {
  try {
    const conditionSectionMatch = content.match(/(?:3\.|Condition|Aandoening).*?(?=4\.|$)/is);
    if (conditionSectionMatch) {
      const conditionSection = conditionSectionMatch[0];
      console.log("Found potential Condition Guidelines section");
      
      // Similar parsing approach
      const conditionItems = conditionSection.match(/[^\n]+(?:\n|$)/g);
      if (conditionItems && conditionItems.length > 0) {
        conditionItems.forEach(item => {
          // Skip headers or empty lines
          if (item.match(/^(3\.|Condition|Aandoening|Guidelines|\s*$)/i)) return;
          
          const hasDelimiters = /[|;:]/.test(item);
          if (hasDelimiters) {
            const parts = item.split(/[|;:]/).map(p => p.trim());
            sections.conditionGuidelines.push({
              condition: parts[0] || '',
              guideline: parts[1] || '',
              deviation: parts[2] || ''
            });
          } else {
            sections.conditionGuidelines.push({
              condition: item.trim(),
              guideline: '',
              deviation: ''
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error parsing plain text Condition Guidelines section:", error);
  }
}

function parsePlainTextSideEffectsSection(content: string, sections: ParsedSections) {
  try {
    const sideEffectSectionMatch = content.match(/(?:4\.|Side Effects|Bijwerkingen).*?(?=5\.|$)/is);
    if (sideEffectSectionMatch) {
      const sideEffectSection = sideEffectSectionMatch[0];
      console.log("Found potential Side Effects section");
      
      // Similar parsing approach
      const sideEffectItems = sideEffectSection.match(/[^\n]+(?:\n|$)/g);
      if (sideEffectItems && sideEffectItems.length > 0) {
        sideEffectItems.forEach(item => {
          // Skip headers or empty lines
          if (item.match(/^(4\.|Side Effects|Bijwerkingen|\s*$)/i)) return;
          
          const hasDelimiters = /[|;:]/.test(item);
          if (hasDelimiters) {
            const parts = item.split(/[|;:]/).map(p => p.trim());
            sections.sideEffects.push({
              sideEffect: parts[0] || '',
              medications: parts[1] || '',
              timeline: parts[2] || '',
              alternativeCauses: parts[3] || '',
              monitoring: parts[4] || '',
              source: parts[5] || ''
            });
          } else {
            sections.sideEffects.push({
              sideEffect: item.trim(),
              medications: '',
              timeline: '',
              alternativeCauses: '',
              monitoring: '',
              source: ''
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error parsing plain text Side Effects section:", error);
  }
}
