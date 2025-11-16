import { NextResponse } from 'next/server';
import { fetchEvidenceFromSheets } from '@/lib/evidenceSheets';

// Mock evidence for testing
const mockEvidence = [
  {
    id: 'E1',
    lat: 12.9716,
    lng: 77.5946,
    category: 'Soil contamination',
    severity: 'High',
    note: 'Heavy soil contamination near the school',
    reporter: 'John Doe',
    date: '2024-11-16',
    zone: 'Zone P1',
    upvotes: 5,
    verified: false,
    status: 'Open',
  },
  {
    id: 'E2',
    lat: 12.9740,
    lng: 77.5955,
    category: 'Stagnant water',
    severity: 'Medium',
    note: 'Stagnant water in the park',
    reporter: 'Jane Smith',
    date: '2024-11-15',
    zone: 'Zone W2',
    upvotes: 3,
    verified: false,
    status: 'Open',
  },
  {
    id: 'E3',
    lat: 12.9705,
    lng: 77.5935,
    category: 'Plastic / microplastics',
    severity: 'Medium',
    note: 'Plastic debris in playground',
    reporter: 'Ram Kumar',
    date: '2024-11-14',
    zone: 'Zone P2',
    upvotes: 2,
    verified: true,
    status: 'Open',
  },
];

export async function GET() {
  try {
    const evidence = await fetchEvidenceFromSheets();
    // Return mock data if empty, otherwise return real data
    const result = evidence && evidence.length > 0 ? evidence : mockEvidence;
    console.log(`[Reports API] Returning ${result.length} reports`);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching evidence from sheets:', error);
    return NextResponse.json(mockEvidence, { status: 200 });
  }
}
