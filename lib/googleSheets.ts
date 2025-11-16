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
      console.warn('Failed to fetch providers from API:', response.status);
      return getFallbackProviders();
    }
    
    const providers: Provider[] = await response.json();
    
    if (!providers || providers.length === 0) {
      return getFallbackProviders();
    }

    console.log(`✓ Fetched ${providers.length} providers`);
    return providers;
  } catch (error) {
    console.error('Error fetching providers:', error);
    return getFallbackProviders();
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
      console.warn('Failed to fetch problems from API:', response.status);
      return getFallbackProblems();
    }
    
    const problems: PollutionProblem[] = await response.json();
    
    if (!problems || problems.length === 0) {
      return getFallbackProblems();
    }

    console.log(`✓ Fetched ${problems.length} problems`);
    return problems;
  } catch (error) {
    console.error('Error fetching problems:', error);
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
