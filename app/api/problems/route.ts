import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheetsAuth';

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

export async function GET() {
  const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;

  if (!SHEET_ID) {
    return NextResponse.json(
      { error: 'Google Sheets ID not configured' },
      { status: 500 }
    );
  }

  try {
    const rows = await getSheetData(SHEET_ID, 'problems!A2:P1000');

    if (!rows || rows.length === 0) {
      console.log('Google Sheets problems table is empty');
      return NextResponse.json([]);
    }

    const problems: PollutionProblem[] = rows.map((row: any, idx: number) => {
      return {
        id: row[0] || `P${idx + 1}`,
        title: row[1] || '',
        location: row[2] || '',
        latitude: parseFloat(row[3]) || undefined,
        longitude: parseFloat(row[4]) || undefined,
        severity: row[5] || 'Medium',
        category: row[6] || '',
        description: row[7] || '',
        reportedBy: row[8] || '',
        reportedDate: row[9] || '',
        status: row[10] || 'Open',
        priority: row[11] || 'Medium',
        estimatedCost: row[12] || '',
        deadline: row[13] || '',
        images: (row[14] || '').split('|').map((s: string) => s.trim()).filter((s: string) => s),
        tags: (row[15] || '').split(',').map((s: string) => s.trim()).filter((s: string) => s),
      };
    });

    console.log(`✓ Fetched ${problems.length} problems from Google Sheets`);
    return NextResponse.json(problems);
  } catch (error) {
    console.error('Error fetching problems from Google Sheets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems data' },
      { status: 500 }
    );
  }
}
