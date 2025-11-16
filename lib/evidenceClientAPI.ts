/**
 * Client-side API helpers for evidence/report management
 */

import { Evidence } from './evidenceSheets';

export async function updateEvidence(
  evidence: Evidence,
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
      sheetName: 'evidence',
      rowIndex,
      values: evidenceToRow(evidence),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update evidence');
  }
}

export async function createEvidence(evidence: Evidence): Promise<void> {
  const response = await fetch('/api/admin/sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
    },
    body: JSON.stringify({
      action: 'append',
      sheetName: 'evidence',
      values: evidenceToRow(evidence),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create evidence');
  }
}

export async function deleteEvidence(rowIndex: number): Promise<void> {
  const response = await fetch('/api/admin/sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
    },
    body: JSON.stringify({
      action: 'delete',
      sheetName: 'evidence',
      rowIndex,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete evidence');
  }
}

export function evidenceToRow(evidence: Evidence): any[] {
  return [
    evidence.id,
    evidence.lat,
    evidence.lng,
    evidence.category,
    evidence.severity,
    evidence.note,
    evidence.reporter,
    evidence.date,
    evidence.zone,
    evidence.upvotes,
    evidence.verified ? 'Yes' : 'No',
    evidence.status,
    evidence.images?.join('|') || '',
    evidence.assignedTo || '',
    evidence.assignedDate || '',
  ];
}
