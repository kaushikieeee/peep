import { NextRequest, NextResponse } from 'next/server';
import { updateSheetRow, appendSheetRow, deleteSheetRow } from '@/lib/googleSheetsServerClient';

// Verify admin authentication
function verifyAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  // For now, we'll use a simple token verification
  // In production, you should use proper session management (JWT, etc.)
  return token === process.env.ADMIN_API_TOKEN || 
         request.cookies.get('admin-auth')?.value === 'true';
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin is authenticated
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action, sheetName, rowIndex, values, data } = await request.json();

    if (!sheetName) {
      return NextResponse.json(
        { error: 'sheetName is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'update':
        if (!rowIndex || !values) {
          return NextResponse.json(
            { error: 'rowIndex and values are required for update' },
            { status: 400 }
          );
        }
        const updateResult = await updateSheetRow({
          sheetName,
          rowIndex,
          values,
        });
        return NextResponse.json({ success: true, data: updateResult });

      case 'append':
        if (!values) {
          return NextResponse.json(
            { error: 'values are required for append' },
            { status: 400 }
          );
        }
        const appendResult = await appendSheetRow({
          sheetName,
          values,
        });
        return NextResponse.json({ success: true, data: appendResult });

      case 'delete':
        if (!rowIndex) {
          return NextResponse.json(
            { error: 'rowIndex is required for delete' },
            { status: 400 }
          );
        }
        const deleteResult = await deleteSheetRow(sheetName, rowIndex);
        return NextResponse.json({ success: true, data: deleteResult });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
