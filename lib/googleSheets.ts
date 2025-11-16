/**
 * Google Sheets Database Integration
 * 
 * Note: This now uses API endpoints for authentication:
 * - /api/providers - fetches providers from Google Sheets
 * - /api/problems - fetches problems from Google Sheets
 * - /api/evidence - fetches evidence from Google Sheets
 */

export interface Provider {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  estimate: string;
  specialties: string[];
  responseTime?: string;
  availability?: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: number;
  certification?: string;
  insurance?: boolean;
  portfolio?: string;
  successRate?: number;
}

export interface PollutionProblem {
  id: string;
  title: string;
  location: string;
  latitude?: number;
  longitude?: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  description?: string;
  reportedBy?: string;
  reportedDate?: string;
  status?: 'Open' | 'In Progress' | 'Resolved' | 'Pending';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedCost?: string;
  deadline?: string;
  images?: string[];
  tags?: string[];
}

/**
 * Fetch providers from Google Sheets
 * Sheet tab name: "providers"
 * Headers: id, name, service, rating, reviews, estimate, specialties, responseTime, availability, email, phone, location, experience, certification, insurance, portfolio, successRate
 */
export async function fetchProvidersFromSheets(): Promise<Provider[]> {
  try {
    const response = await fetch('/api/providers', { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch providers: ${response.status}`);
    }
    
    const providers: Provider[] = await response.json();
    
    if (!providers || providers.length === 0) {
      throw new Error('No providers found in Google Sheets');
    }

    console.log(`✓ Fetched ${providers.length} providers`);
    return providers;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
}


/**
 * Fetch problems from Google Sheets
 * Sheet tab name: "problems"
 * Headers: id, title, location, latitude, longitude, severity, category, description, reportedBy, reportedDate, status, priority, estimatedCost, deadline, images, tags
 */
export async function fetchProblemsFromSheets(): Promise<PollutionProblem[]> {
  try {
    const response = await fetch('/api/problems', { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch problems: ${response.status}`);
    }
    
    const problems: PollutionProblem[] = await response.json();
    
    if (!problems || problems.length === 0) {
      throw new Error('No problems found in Google Sheets');
    }

    console.log(`✓ Fetched ${problems.length} problems`);
    return problems;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
}
