/**
 * Server-side Google Sheets API Client
 * Uses Service Account for secure server-side operations
 * 
 * Setup:
 * 1. Create a Google Service Account:
 *    - Go to Google Cloud Console
 *    - Create a new project (or use existing)
 *    - Enable Google Sheets API
 *    - Create Service Account with Editor role
 *    - Create and download JSON key
 * 
 * 2. Share your Google Sheet with the service account email:
 *    - Copy the "client_email" from the JSON key
 *    - Share the sheet with that email, give it Editor access
 * 
 * 3. Set environment variables in .env.local:
 *    GOOGLE_SHEETS_PRIVATE_KEY=your_private_key_here
 *    GOOGLE_SHEETS_CLIENT_EMAIL=your_client_email_here
 *    GOOGLE_SHEETS_ID=your_sheet_id_here (same as NEXT_PUBLIC version)
 */

import { google } from 'googleapis';

let sheetsClient: any = null;

function getAuthClient() {
  if (!sheetsClient) {
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

    if (!privateKey || !clientEmail) {
      throw new Error('Google Sheets credentials not configured. Please set GOOGLE_SHEETS_PRIVATE_KEY and GOOGLE_SHEETS_CLIENT_EMAIL in .env.local');
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheetsClient = google.sheets({ version: 'v4', auth });
  }

  return sheetsClient;
}

export interface UpdateRowParams {
  sheetName: string;
  rowIndex: number;
  values: any[];
}

export interface AppendRowParams {
  sheetName: string;
  values: any[];
}

/**
 * Update a row in the Google Sheet
 * @param sheetName - Name of the sheet tab (e.g., 'providers', 'problems')
 * @param rowIndex - 1-based row index (1 = header, 2 = first data row)
 * @param values - Array of values to update
 */
export async function updateSheetRow({
  sheetName,
  rowIndex,
  values,
}: UpdateRowParams) {
  try {
    const sheets = getAuthClient();
    const sheetId = process.env.GOOGLE_SHEETS_ID;

    if (!sheetId) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    // Get sheet metadata to find proper range
    const metadata = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const sheet = metadata.data.sheets?.find((s: any) => s.properties?.title === sheetName);

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;

    const result = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });

    return result.data;
  } catch (error) {
    console.error('Error updating sheet row:', error);
    throw error;
  }
}

/**
 * Append a new row to the Google Sheet
 * @param sheetName - Name of the sheet tab
 * @param values - Array of values for the new row
 */
export async function appendSheetRow({
  sheetName,
  values,
}: AppendRowParams) {
  try {
    const sheets = getAuthClient();
    const sheetId = process.env.GOOGLE_SHEETS_ID;

    if (!sheetId) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const range = `${sheetName}!A:Z`;

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });

    return result.data;
  } catch (error) {
    console.error('Error appending sheet row:', error);
    throw error;
  }
}

/**
 * Delete a row from the Google Sheet (by clearing it)
 * @param sheetName - Name of the sheet tab
 * @param rowIndex - 1-based row index
 */
export async function deleteSheetRow(
  sheetName: string,
  rowIndex: number
) {
  try {
    const sheets = getAuthClient();
    const sheetId = process.env.GOOGLE_SHEETS_ID;

    if (!sheetId) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;

    const result = await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range,
    });

    return result.data;
  } catch (error) {
    console.error('Error deleting sheet row:', error);
    throw error;
  }
}

/**
 * Get all rows from a sheet
 * @param sheetName - Name of the sheet tab
 */
export async function getSheetRows(sheetName: string) {
  try {
    const sheets = getAuthClient();
    const sheetId = process.env.GOOGLE_SHEETS_ID;

    if (!sheetId) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:Z`,
    });

    return result.data.values || [];
  } catch (error) {
    console.error('Error getting sheet rows:', error);
    throw error;
  }
}
