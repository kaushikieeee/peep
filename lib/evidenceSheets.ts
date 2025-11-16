/**
 * Evidence/Report data management
 * Fetches data from the API endpoint /api/evidence which connects to Google Sheets
 */

export interface Evidence {
  id: string;
  lat: number;
  lng: number;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  note: string;
  reporter: string;
  date: string;
  zone: string;
  upvotes: number;
  verified: boolean;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  images?: string[];
  assignedTo?: string;
  assignedDate?: string;
}

/**
 * Fetch evidence from the API endpoint
 */
export async function fetchEvidenceFromSheets(): Promise<Evidence[]> {
  try {
    const response = await fetch('/api/evidence', { cache: 'no-store' });
    
    if (!response.ok) {
      console.warn('Failed to fetch evidence from API:', response.status);
      return [];
    }
    
    const evidence: Evidence[] = await response.json();
    
    if (!evidence || evidence.length === 0) {
      console.log('No evidence items found');
      return [];
    }

    console.log(`✓ Fetched ${evidence.length} evidence items`);
    return evidence;
  } catch (error) {
    console.error('Error fetching evidence:', error);
    return [];
  }
}
