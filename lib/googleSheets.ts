/**
 * Google Sheets Database Integration
 * 
 * Setup:
 * 1. Create a Google Sheet with tabs:
 *    - "providers" - Service provider data
 *    - "problems" - Pollution problems data
 * 
 * 2. Make the sheet "Viewer" accessible to anyone with the link
 * 
 * 3. Your sheet URL should look like:
 *    https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
 * 
 * 4. Set NEXT_PUBLIC_GOOGLE_SHEETS_ID in your .env.local:
 *    NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_sheet_id_here
 */

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;

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
}

export interface PollutionProblem {
  id: string;
  title: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High';
  category: string;
}

/**
 * Fetch providers from Google Sheets
 * Sheet tab name: "providers"
 * Headers: id, name, service, rating, reviews, estimate, specialties, responseTime, availability
 */
export async function fetchProvidersFromSheets(): Promise<Provider[]> {
  if (!SHEET_ID) {
    console.warn('NEXT_PUBLIC_GOOGLE_SHEETS_ID not configured, using fallback data');
    return getFallbackProviders();
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/query?tq=SELECT%20*%20FROM%20'providers'&tqx=out:json`;
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse Google Visualization API response
    const jsonString = text.substring(47).slice(0, -2);
    const json = JSON.parse(jsonString);
    
    const providers = json.table.rows.map((row: any, idx: number) => {
      const cols = row.c;
      return {
        id: cols[0]?.v || idx + 1,
        name: cols[1]?.v || '',
        service: cols[2]?.v || '',
        rating: parseFloat(cols[3]?.v) || 4.5,
        reviews: parseInt(cols[4]?.v) || 0,
        estimate: cols[5]?.v || '₹0',
        specialties: (cols[6]?.v || '').split(',').map((s: string) => s.trim()).filter((s: string) => s),
        responseTime: cols[7]?.v || '',
        availability: cols[8]?.v || '',
      };
    });

    return providers;
  } catch (error) {
    console.error('Error fetching providers from Google Sheets:', error);
    return getFallbackProviders();
  }
}

/**
 * Fetch problems from Google Sheets
 * Sheet tab name: "problems"
 * Headers: id, title, location, severity, category
 */
export async function fetchProblemsFromSheets(): Promise<PollutionProblem[]> {
  if (!SHEET_ID) {
    console.warn('NEXT_PUBLIC_GOOGLE_SHEETS_ID not configured, using fallback data');
    return getFallbackProblems();
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/query?tq=SELECT%20*%20FROM%20'problems'&tqx=out:json`;
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse Google Visualization API response
    const jsonString = text.substring(47).slice(0, -2);
    const json = JSON.parse(jsonString);
    
    const problems = json.table.rows.map((row: any, idx: number) => {
      const cols = row.c;
      return {
        id: cols[0]?.v || `P${idx + 1}`,
        title: cols[1]?.v || '',
        location: cols[2]?.v || '',
        severity: cols[3]?.v || 'Medium',
        category: cols[4]?.v || '',
      };
    });

    return problems;
  } catch (error) {
    console.error('Error fetching problems from Google Sheets:', error);
    return getFallbackProblems();
  }
}

function getFallbackProviders(): Provider[] {
  return [
    {
      id: 1,
      name: 'GreenFix Turfcare',
      service: 'Turf restoration & cleanup',
      rating: 4.8,
      reviews: 124,
      estimate: '₹2,05,000 - ₹4,10,000',
      specialties: ['Turf restoration', 'Soil remediation', 'Land cleanup'],
      responseTime: '2-4 hours',
      availability: 'Mon-Sat, 7AM-6PM',
    },
    {
      id: 2,
      name: 'DrainWell Solutions',
      service: 'Water drainage & treatment',
      rating: 4.6,
      reviews: 87,
      estimate: '₹1,23,000 - ₹2,87,000',
      specialties: ['Water treatment', 'Drainage systems', 'Stagnant water'],
      responseTime: '4-6 hours',
      availability: '24/7 Emergency',
    },
    {
      id: 3,
      name: 'CleanSoil Labs',
      service: 'Soil testing & remediation',
      rating: 4.9,
      reviews: 156,
      estimate: '₹2,46,000 - ₹6,56,000',
      specialties: ['Soil analysis', 'Contamination testing', 'Remediation'],
      responseTime: '1-2 hours',
      availability: 'Mon-Sun, 8AM-8PM',
    },
  ];
}

function getFallbackProblems(): PollutionProblem[] {
  return [
    {
      id: 'P001',
      title: 'Stagnant water at Market Street',
      location: 'Market Street, Downtown',
      severity: 'High',
      category: 'Water Pollution',
    },
    {
      id: 'P002',
      title: 'Soil contamination near Industrial Zone',
      location: 'Industrial Area, East Side',
      severity: 'High',
      category: 'Soil Pollution',
    },
    {
      id: 'P003',
      title: 'Air quality degradation at Main Road',
      location: 'Main Road Junction',
      severity: 'Medium',
      category: 'Air Pollution',
    },
    {
      id: 'P004',
      title: 'Plastic waste accumulation in Park',
      location: 'Central Park',
      severity: 'Medium',
      category: 'Waste Pollution',
    },
    {
      id: 'P005',
      title: 'Heavy metal residue at Abandoned Factory',
      location: 'Old Industrial Factory',
      severity: 'High',
      category: 'Chemical Pollution',
    },
  ];
}
