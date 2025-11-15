'use client';

import { ThumbsUp, Share2, CheckCircle, Flag } from 'lucide-react';
import { useState } from 'react';

interface EvidenceCardProps {
  id: number;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  note: string;
  reporter: string;
  date: string;
  zone: string;
  upvotes: number;
  verified: boolean;
  isAdmin?: boolean;
  imagePlaceholder?: string;
  onVerify?: (id: number) => void;
  onReport?: (id: number) => void;
}

const severityColors = {
  Low: { bg: '#c6f6d5', text: '#15803d' },
  Medium: { bg: '#fcd34d', text: '#78350f' },
  High: { bg: '#fca5a5', text: '#7f1d1d' },
};

export default function EvidenceCard({
  id,
  category,
  severity,
  note,
  reporter,
  date,
  zone,
  upvotes,
  verified,
  isAdmin = false,
  imagePlaceholder,
  onVerify,
  onReport,
}: EvidenceCardProps) {
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [userUpvotes, setUserUpvotes] = useState(upvotes);

  const handleUpvote = () => {
    setUserUpvoted(!userUpvoted);
    setUserUpvotes(userUpvoted ? userUpvotes - 1 : userUpvotes + 1);
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      {imagePlaceholder && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img src={imagePlaceholder || "/placeholder.svg"} alt="Evidence" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              Case #{id} — {category}
            </h3>
          </div>
          <span
            className="text-xs font-bold rounded-full px-2 py-1 flex-shrink-0 whitespace-nowrap"
            style={severityColors[severity]}
          >
            {severity}
          </span>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-1 text-xs text-gray-600">
          <span>• {formattedDate}</span>
          <span>• {zone}</span>
          {verified && (
            <span className="flex items-center gap-0.5 text-green-700">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          )}
        </div>

        {/* Note */}
        <p className="text-sm text-gray-700 line-clamp-2">{note}</p>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Reported by {reporter}</span>
          {!isAdmin && <span>{userUpvotes} upvotes</span>}
        </div>

        {/* Actions */}
        <div className="pt-2 flex gap-2">
          {!isAdmin ? (
            <>
              <button
                onClick={handleUpvote}
                className="flex-1 py-2 px-2 rounded text-xs font-medium border transition-all"
                style={{
                  borderColor: userUpvoted ? 'var(--peep-primary)' : '#e5e7eb',
                  color: userUpvoted ? 'var(--peep-primary)' : '#666',
                }}
              >
                <ThumbsUp className="w-3 h-3 inline mr-1" />
                Upvote
              </button>
              <button className="flex-1 py-2 px-2 rounded text-xs font-medium border border-gray-300 hover:bg-gray-50">
                <Share2 className="w-3 h-3 inline mr-1" />
                Share
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onVerify?.(id)}
                className="flex-1 py-2 px-2 rounded text-xs font-medium border transition-all"
                style={{
                  borderColor: verified ? 'var(--peep-primary)' : '#e5e7eb',
                  color: verified ? 'var(--peep-primary)' : '#666',
                  backgroundColor: verified ? 'var(--peep-neutral-1)' : 'transparent',
                }}
              >
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Verify
              </button>
              <button
                onClick={() => onReport?.(id)}
                className="flex-1 py-2 px-2 rounded text-xs font-medium border border-red-300 text-red-600 hover:bg-red-50"
              >
                <Flag className="w-3 h-3 inline mr-1" />
                Flag
              </button>
            </>
          )}
        </div>

        {/* Info text */}
        <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          This is public evidence. Authorities can view and action this case.
        </p>
      </div>
    </div>
  );
}
