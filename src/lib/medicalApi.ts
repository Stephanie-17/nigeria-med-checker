export interface InteractionResult {
  drugA: { rxcui: string; name: string };
  drugB: { rxcui: string; name: string };
  severity: 'high' | 'medium' | 'low';
  description: string;
  source: string;
}

export interface OpenFdaData {
  purpose?: string;
  indications?: string;
  warnings?: string;
  dosage?: string;
  brandName?: string;
  genericName?: string;
}

/**
 * Resolves a generic drug name (US spelling) to its RxCUI (Concept Unique Identifier) in RxNorm.
 */
export async function fetchRxCui(drugName: string): Promise<string | null> {
  const cleanName = encodeURIComponent(drugName.trim());
  try {
    const res = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${cleanName}&allsrc=0`);
    if (!res.ok) return null;
    const data = await res.json();
    const rxnormId = data.idGroup?.rxnormId;
    if (rxnormId && rxnormId.length > 0) {
      return rxnormId[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching RxCUI for ${drugName}:`, error);
    return null;
  }
}

/**
 * Resolves multiple active ingredients (including combinations like "Artemether + Lumefantrine") to RxCUIs.
 */
export async function fetchRxCuisForDrug(drugName: string): Promise<string[]> {
  // If the drug contains a '+' or 'and' or '/', resolve the parts individually
  const separators = /\s*(?:\+|\band\b|\/)\s*/gi;
  if (separators.test(drugName)) {
    const components = drugName.split(separators);
    const results = await Promise.all(components.map(comp => fetchRxCui(comp)));
    return results.filter((id): id is string => id !== null);
  }
  
  const singleId = await fetchRxCui(drugName);
  return singleId ? [singleId] : [];
}

/**
 * Check drug-to-drug interactions using a list of RxCUIs via RxNorm's interaction API.
 */
export async function fetchDrugInteractions(rxcuis: string[]): Promise<InteractionResult[]> {
  if (rxcuis.length < 2) return [];

  // Join RxCUIs with '+' sign
  const cuistring = rxcuis.join('+');
  try {
    const res = await fetch(`https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${cuistring}`);
    if (!res.ok) return [];
    const data = await res.json();
    
    const interactions: InteractionResult[] = [];
    const groups = data.fullInteractionTypeGroup || [];
    
    for (const group of groups) {
      const types = group.fullInteractionType || [];
      for (const type of types) {
        const comment = type.comment || '';
        const pairs = type.interactionPair || [];
        
        for (const pair of pairs) {
          const concepts = pair.interactionConcept || [];
          if (concepts.length >= 2) {
            const conceptA = concepts[0].minConceptItem;
            const conceptB = concepts[1].minConceptItem;
            
            const rawSeverity = pair.severity || '';
            const description = pair.description || '';
            
            // Map severity to high, medium, low based on keywords
            let severity: 'high' | 'medium' | 'low' = 'medium';
            const descLower = description.toLowerCase();
            
            if (
              rawSeverity.toLowerCase() === 'high' || 
              descLower.includes('severe') || 
              descLower.includes('life-threatening') || 
              descLower.includes('contraindicated') ||
              descLower.includes('avoid') ||
              descLower.includes('fatal') ||
              descLower.includes('respiratory depression')
            ) {
              severity = 'high';
            } else if (descLower.includes('minor') || descLower.includes('mild')) {
              severity = 'low';
            }
            
            interactions.push({
              drugA: { rxcui: conceptA.rxcui, name: conceptA.name },
              drugB: { rxcui: conceptB.rxcui, name: conceptB.name },
              severity,
              description,
              source: group.sourceName || 'RxNorm'
            });
          }
        }
      }
    }
    
    return interactions;
  } catch (error) {
    console.error("Error fetching drug interactions:", error);
    return [];
  }
}

/**
 * Queries OpenFDA for details on a generic drug as a fallback.
 */
export async function fetchOpenFdaInfo(genericName: string): Promise<OpenFdaData | null> {
  const cleanName = encodeURIComponent(genericName.trim());
  try {
    const res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${cleanName}"&limit=1`);
    if (!res.ok) return null;
    
    const data = await res.json();
    const results = data.results || [];
    if (results.length === 0) return null;
    
    const result = results[0];
    return {
      purpose: result.purpose ? result.purpose[0] : undefined,
      indications: result.indications_and_usage ? result.indications_and_usage[0] : undefined,
      warnings: result.warnings ? result.warnings[0] : undefined,
      dosage: result.dosage_and_administration ? result.dosage_and_administration[0] : undefined,
      brandName: result.openfda?.brand_name ? result.openfda.brand_name[0] : undefined,
      genericName: result.openfda?.generic_name ? result.openfda.generic_name[0] : undefined,
    };
  } catch (error) {
    console.error(`Error fetching OpenFDA info for ${genericName}:`, error);
    return null;
  }
}
