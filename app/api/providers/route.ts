import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheetsAuth';

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

export async function GET() {
  const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;

  if (!SHEET_ID) {
    return NextResponse.json(
      { error: 'Google Sheets ID not configured' },
      { status: 500 }
    );
  }

  try {
    const rows = await getSheetData(SHEET_ID, 'providers!A2:Q1000');

    if (!rows || rows.length === 0) {
      console.log('Google Sheets providers table is empty');
      return NextResponse.json([]);
    }

    const providers: Provider[] = rows.map((row: any, idx: number) => {
      return {
        id: row[0] || idx + 1,
        name: row[1] || '',
        service: row[2] || '',
        rating: parseFloat(row[3]) || 4.5,
        reviews: parseInt(row[4]) || 0,
        estimate: row[5] || '₹0',
        specialties: (row[6] || '').split(',').map((s: string) => s.trim()).filter((s: string) => s),
        responseTime: row[7] || '',
        availability: row[8] || '',
        email: row[9] || '',
        phone: row[10] || '',
        location: row[11] || '',
        experience: parseInt(row[12]) || 0,
        certification: row[13] || '',
        insurance: row[14]?.toLowerCase() === 'yes' || row[14]?.toLowerCase() === 'true',
        portfolio: row[15] || '',
        successRate: parseFloat(row[16]) || 0,
      };
    });

    console.log(`✓ Fetched ${providers.length} providers from Google Sheets`);
    return NextResponse.json(providers);
  } catch (error) {
    console.error('Error fetching providers from Google Sheets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers data' },
      { status: 500 }
    );
  }
}
