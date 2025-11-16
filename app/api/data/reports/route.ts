import { NextResponse } from 'next/server';
import { fetchEvidenceFromSheets } from '@/lib/evidenceSheets';

export async function GET() {
  try {
    const evidence = await fetchEvidenceFromSheets();
    return NextResponse.json(evidence);
  } catch (error) {
    console.error('Error fetching evidence from sheets:', error);
    return NextResponse.json([], { status: 500 });
  }
}
