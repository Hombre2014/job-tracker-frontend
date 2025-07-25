// Document category color mappings for filter buttons
export const documentColorMap: Record<string, string> = {
  Resume: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  'Cover Letter': 'bg-green-100 text-green-700 hover:bg-green-200',
  'Writing Sample': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  Portfolio: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  Recommendation: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
  'Job Post': 'bg-lime-100 text-lime-700 hover:bg-lime-200',
  'Offer Letter': 'bg-amber-300 text-amber-800 hover:bg-amber-400',
  Certification: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
  Other: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  Transcript: 'bg-red-100 text-red-700 hover:bg-red-200',
  Uncategorized: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
};

// Selected state color mappings for filter buttons (darker shades like hover state)
export const selectedDocumentColorMap: Record<string, string> = {
  Resume: 'bg-blue-200 text-blue-800',
  'Cover Letter': 'bg-green-200 text-green-800',
  'Writing Sample': 'bg-orange-200 text-orange-800',
  Portfolio: 'bg-purple-200 text-purple-800',
  Recommendation: 'bg-pink-200 text-pink-800',
  'Job Post': 'bg-lime-200 text-lime-800',
  'Offer Letter': 'bg-amber-400 text-amber-900',
  Certification: 'bg-teal-200 text-teal-800',
  Other: 'bg-indigo-200 text-indigo-800',
  Transcript: 'bg-red-200 text-red-800',
  Uncategorized: 'bg-gray-200 text-gray-800',
};
