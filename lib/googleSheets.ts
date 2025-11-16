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
        email: cols[9]?.v || '',
        phone: cols[10]?.v || '',
        location: cols[11]?.v || '',
        experience: parseInt(cols[12]?.v) || 0,
        certification: cols[13]?.v || '',
        insurance: cols[14]?.v?.toLowerCase() === 'yes' || cols[14]?.v?.toLowerCase() === 'true',
        portfolio: cols[15]?.v || '',
        successRate: parseFloat(cols[16]?.v) || 0,
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
 * Headers: id, title, location, latitude, longitude, severity, category, description, reportedBy, reportedDate, status, priority, estimatedCost, deadline, images, tags
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
        latitude: parseFloat(cols[3]?.v) || undefined,
        longitude: parseFloat(cols[4]?.v) || undefined,
        severity: cols[5]?.v || 'Medium',
        category: cols[6]?.v || '',
        description: cols[7]?.v || '',
        reportedBy: cols[8]?.v || '',
        reportedDate: cols[9]?.v || '',
        status: cols[10]?.v || 'Open',
        priority: cols[11]?.v || 'Medium',
        estimatedCost: cols[12]?.v || '',
        deadline: cols[13]?.v || '',
        images: (cols[14]?.v || '').split('|').map((s: string) => s.trim()).filter((s: string) => s),
        tags: (cols[15]?.v || '').split(',').map((s: string) => s.trim()).filter((s: string) => s),
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
      email: 'contact@greenfixturfcare.com',
      phone: '+91-9876543210',
      location: 'Bangalore, India',
      experience: 12,
      certification: 'ISO 14001',
      insurance: true,
      portfolio: 'greenfixportfolio.com',
      successRate: 96.5,
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
      email: 'support@drainwell.com',
      phone: '+91-9876543211',
      location: 'Bangalore, India',
      experience: 8,
      certification: 'Water Management Expert',
      insurance: true,
      portfolio: 'drainwellsolutions.com',
      successRate: 94.2,
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
      email: 'labs@cleansoil.com',
      phone: '+91-9876543212',
      location: 'Bangalore, India',
      experience: 15,
      certification: 'NABL Accredited',
      insurance: true,
      portfolio: 'cleansoillabs.com',
      successRate: 98.1,
    },
  ];
}

function getFallbackProblems(): PollutionProblem[] {
  return [
    {
      id: 'P001',
      title: 'Stagnant water at Market Street',
      location: 'Market Street, Downtown',
      latitude: 11.0420,
      longitude: 77.0269,
      severity: 'High',
      category: 'Water Pollution',
      description: 'Accumulation of stagnant water causing mosquito breeding and foul odors',
      reportedBy: 'John Doe',
      reportedDate: '2025-11-10',
      status: 'Open',
      priority: 'High',
      estimatedCost: '₹1,50,000',
      deadline: '2025-11-25',
      images: [],
      tags: ['water', 'urgent', 'health-hazard'],
    },
    {
      id: 'P002',
      title: 'Soil contamination near Industrial Zone',
      location: 'Industrial Area, East Side',
      latitude: 11.0500,
      longitude: 77.0400,
      severity: 'High',
      category: 'Soil Pollution',
      description: 'Heavy metal contamination detected in soil samples',
      reportedBy: 'Environmental Officer',
      reportedDate: '2025-11-08',
      status: 'In Progress',
      priority: 'Critical',
      estimatedCost: '₹4,50,000',
      deadline: '2025-12-15',
      images: [],
      tags: ['soil', 'chemical', 'industrial'],
    },
    {
      id: 'P003',
      title: 'Air quality degradation at Main Road',
      location: 'Main Road Junction',
      latitude: 11.0350,
      longitude: 77.0200,
      severity: 'Medium',
      category: 'Air Pollution',
      description: 'High vehicle emission causing poor air quality readings',
      reportedBy: 'Resident',
      reportedDate: '2025-11-12',
      status: 'Open',
      priority: 'Medium',
      estimatedCost: '₹2,00,000',
      deadline: '2025-12-01',
      images: [],
      tags: ['air', 'traffic', 'emission'],
    },
    {
      id: 'P004',
      title: 'Plastic waste accumulation in Park',
      location: 'Central Park',
      latitude: 11.0450,
      longitude: 77.0300,
      severity: 'Medium',
      category: 'Waste Pollution',
      description: 'Large quantities of plastic waste scattered throughout the park area',
      reportedBy: 'Park Administrator',
      reportedDate: '2025-11-09',
      status: 'In Progress',
      priority: 'High',
      estimatedCost: '₹80,000',
      deadline: '2025-11-20',
      images: [],
      tags: ['waste', 'plastic', 'cleanup'],
    },
    {
      id: 'P005',
      title: 'Heavy metal residue at Abandoned Factory',
      location: 'Old Industrial Factory',
      latitude: 11.0550,
      longitude: 77.0350,
      severity: 'High',
      category: 'Chemical Pollution',
      description: 'Toxic chemical residue from factory operations affecting surrounding area',
      reportedBy: 'Environmental Inspector',
      reportedDate: '2025-11-07',
      status: 'Open',
      priority: 'Critical',
      estimatedCost: '₹7,50,000',
      deadline: '2025-12-31',
      images: [],
      tags: ['chemical', 'toxic', 'factory'],
    },
  ];
}
