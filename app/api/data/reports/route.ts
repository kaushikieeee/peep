import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheetsAuth';

interface Evidence {
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

export async function GET() {
  const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;

  if (!SHEET_ID) {
    return NextResponse.json(
      { error: 'Google Sheets ID not configured' },
      { status: 500 }
    );
  }

  try {
    const rows = await getSheetData(SHEET_ID, 'evidence!A2:O1000');

    if (!rows || rows.length === 0) {
      console.log('[Reports API] No evidence found in Google Sheets');
      return NextResponse.json([]);
    }

    const evidence: Evidence[] = rows.map((row: any, idx: number) => {
      return {
        id: row[0] || `E${idx + 1}`,
        lat: parseFloat(row[1]) || 0,
        lng: parseFloat(row[2]) || 0,
        category: row[3] || '',
        severity: row[4] || 'Low',
        note: row[5] || '',
        reporter: row[6] || '',
        date: row[7] || new Date().toISOString().split('T')[0],
        zone: row[8] || '',
        upvotes: parseInt(row[9]) || 0,
        verified: row[10]?.toString().toLowerCase() === 'yes' || row[10]?.toString().toLowerCase() === 'true',
        status: row[11] || 'Open',
        images: (row[12] || '').split('|').filter((s: string) => s.trim()),
        assignedTo: row[13] || '',
        assignedDate: row[14] || '',
      };
    });

    console.log(`[Reports API] Fetched ${evidence.length} reports from Google Sheets`);
    return NextResponse.json(evidence);
  } catch (error) {
    console.error('[Reports API] Error fetching from Google Sheets:', error);
    return NextResponse.json([], { status: 500 });
  }
}
