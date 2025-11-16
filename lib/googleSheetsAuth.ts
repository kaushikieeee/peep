'use server';

import { google } from 'googleapis';

/**
 * Authenticated Google Sheets API client using service account credentials
 * This allows reading from private sheets that the service account has access to
 * 
 * IMPORTANT: This file MUST only be used from server-side contexts (Server Components, API routes)
 * Do NOT import this in Client Components
 */

interface ServiceAccountCredentials {
  type: 'service_account';
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

/**
 * Get authenticated Google Sheets client
 */
function getAuthenticatedSheets() {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    console.warn('Google Sheets authentication credentials not configured');
    return null;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        private_key: privateKey,
        client_email: clientEmail,
      } as any,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/spreadsheets.readonly',
      ],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Failed to authenticate with Google Sheets:', error);
    return null;
  }
}

/**
 * Fetch data from a specific sheet range
 */
export async function getSheetData(spreadsheetId: string, range: string) {
  const sheets = getAuthenticatedSheets();
  if (!sheets) {
    throw new Error('Google Sheets client not initialized');
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error(`Failed to fetch sheet data from ${range}:`, error);
    throw error;
  }
}

/**
 * Convert sheet rows to objects using headers
 */
export async function rowsToObjects(rows: any[][]): Promise<Record<string, any>[]> {
  if (rows.length < 2) return [];

  const [headers, ...dataRows] = rows;
  return dataRows.map(row => {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

/**
 * Append a row to a Google Sheet
 */
export async function appendSheetRow(spreadsheetId: string, range: string, values: any[][]) {
  const sheets = getAuthenticatedSheets();
  if (!sheets) {
    throw new Error('Google Sheets client not initialized');
  }

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Failed to append to sheet ${range}:`, error);
    throw error;
  }
}
