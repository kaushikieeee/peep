/**
 * Client-side helper for securely calling the sheet API
 * All updates go through the server, ensuring security
 */

export interface ProviderData {
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

export interface ProblemData {
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

/**
 * Convert provider object to row array for Google Sheets
 */
export function providerToRow(provider: ProviderData): any[] {
  return [
    provider.id,
    provider.name,
    provider.service,
    provider.rating,
    provider.reviews,
    provider.estimate,
    provider.specialties.join(','),
    provider.responseTime || '',
    provider.availability || '',
    provider.email || '',
    provider.phone || '',
    provider.location || '',
    provider.experience || '',
    provider.certification || '',
    provider.insurance ? 'Yes' : 'No',
    provider.portfolio || '',
    provider.successRate || '',
  ];
}

/**
 * Convert problem object to row array for Google Sheets
 */
export function problemToRow(problem: ProblemData): any[] {
  return [
    problem.id,
    problem.title,
    problem.location,
    problem.latitude || '',
    problem.longitude || '',
    problem.severity,
    problem.category,
    problem.description || '',
    problem.reportedBy || '',
    problem.reportedDate || '',
    problem.status || 'Open',
    problem.priority || 'Medium',
    problem.estimatedCost || '',
    problem.deadline || '',
    problem.images?.join('|') || '',
    problem.tags?.join(',') || '',
  ];
}

/**
 * Update a provider in Google Sheets
 */
export async function updateProvider(
  provider: ProviderData,
  rowIndex: number
): Promise<void> {
  const response = await fetch('/api/admin/sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
    },
    body: JSON.stringify({
      action: 'update',
      sheetName: 'providers',
      rowIndex,
      values: providerToRow(provider),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update provider');
  }
}

/**
 * Add a new provider to Google Sheets
 */
export async function createProvider(provider: ProviderData): Promise<void> {
  const response = await fetch('/api/admin/sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
    },
    body: JSON.stringify({
      action: 'append',
      sheetName: 'providers',
      values: providerToRow(provider),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create provider');
  }
}

/**
 * Delete a provider from Google Sheets
 */
export async function deleteProvider(rowIndex: number): Promise<void> {
  const response = await fetch('/api/admin/sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
    },
    body: JSON.stringify({
      action: 'delete',
      sheetName: 'providers',
      rowIndex,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete provider');
  }
}

/**
 * Update a problem in Google Sheets
 */
export async function updateProblem(
  problem: ProblemData,
  rowIndex: number
): Promise<void> {
  const response = await fetch('/api/admin/sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
    },
    body: JSON.stringify({
      action: 'update',
      sheetName: 'problems',
      rowIndex,
      values: problemToRow(problem),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update problem');
  }
}

/**
 * Add a new problem to Google Sheets
 */
export async function createProblem(problem: ProblemData): Promise<void> {
  const response = await fetch('/api/admin/sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
    },
    body: JSON.stringify({
      action: 'append',
      sheetName: 'problems',
      values: problemToRow(problem),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create problem');
  }
}

/**
 * Delete a problem from Google Sheets
 */
export async function deleteProblem(rowIndex: number): Promise<void> {
  const response = await fetch('/api/admin/sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
    },
    body: JSON.stringify({
      action: 'delete',
      sheetName: 'problems',
      rowIndex,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete problem');
  }
}
