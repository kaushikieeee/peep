import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/mock-reports.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const mockReports = JSON.parse(fileContents);
    return NextResponse.json(mockReports);
  } catch (error) {
    console.error('Error reading mock reports:', error);
    return NextResponse.json([], { status: 500 });
  }
}
