import { NextRequest, NextResponse } from 'next/server';
import { appendSheetRow } from '@/lib/googleSheetsAuth';
import { processImageForSubmission } from '@/lib/imageStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Evidence Submit] Received request:', {
      lat: body.lat,
      lng: body.lng,
      category: body.category,
      severity: body.severity,
      hasImages: !!body.images?.length,
      imageCount: body.images?.length || 0,
      reporter: body.reporter,
    });

    // Validate required fields
    if (!body.lat || !body.lng || !body.category) {
      console.warn('[Evidence Submit] Missing required fields:', {
        lat: !!body.lat,
        lng: !!body.lng,
        category: !!body.category,
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
    if (!SHEET_ID) {
      return NextResponse.json(
        { error: 'Google Sheets ID not configured' },
        { status: 500 }
      );
    }

    // Process images (convert base64 to URLs if needed)
    const processedImages = await processImageForSubmission(body.images?.[0] || null);

    // Prepare row data for Google Sheets
    const evidenceId = `E${Date.now()}`;
    const row = [
      [
        evidenceId,                           // id
        body.lat.toString(),                   // lat
        body.lng.toString(),                   // lng
        body.category,                         // category
        body.severity || 'Low',                // severity
        body.note || '',                       // note
        body.reporter || 'Anonymous',          // reporter
        body.date || new Date().toISOString().split('T')[0],  // date
        body.zone || 'User Submitted',         // zone
        '0',                                   // upvotes
        'no',                                  // verified
        body.status || 'Open',                 // status
        processedImages?.join('|') || '',      // images (URL or base64)
        body.assignedTo || '',                 // assignedTo
        body.assignedDate || '',               // assignedDate
      ]
    ];

    // Append to evidence sheet
    await appendSheetRow(SHEET_ID, 'evidence!A:O', row);

    console.log('✓ Evidence saved to Google Sheets:', { 
      id: evidenceId,
      reporter: body.reporter || 'Anonymous',
      category: body.category, 
      severity: body.severity,
      hasImage: processedImages.length > 0,
      lat: body.lat,
      lng: body.lng,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Report submitted successfully',
        id: evidenceId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Evidence Submit] Error submitting evidence:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit report' },
      { status: 500 }
    );
  }
}
