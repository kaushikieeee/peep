import { NextResponse } from 'next/server';
import { fetchEvidenceFromSheets } from '@/lib/evidenceSheets';

export async function GET() {
  try {
    const evidence = await fetchEvidenceFromSheets();
    console.log(`[Reports API] Fetched ${evidence.length} reports from sheets`);
    return NextResponse.json(evidence);
  } catch (error) {
    console.error('Error fetching evidence from sheets:', error);
    return NextResponse.json([], { status: 500 });
  }
}
