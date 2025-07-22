// Category color mapping for both filter bar and document card pills
// These match the Document Card pill colors as seen in your UI
export const categoryColors: Record<string, string> = {
  Resume: 'bg-blue-600', // blue
  Other: 'bg-indigo-500', // indigo
  Transcript: 'bg-red-500', // red
  'Job Post': 'bg-lime-500', // lime
  Portfolio: 'bg-purple-500', // purple (darker for distinction)
  Certification: 'bg-teal-500', // teal (distinct from Writing Sample)
  Uncategorized: 'bg-gray-500', // gray
  Recommendation: 'bg-pink-500', // pink (darker for distinction)
  'Offer Letter': 'bg-amber-700', // amber (darker for distinction)
  'Cover Letter': 'bg-green-600', // green
  'Writing Sample': 'bg-orange-400', // orange (lighter for distinction)
};

export const defaultJobPostColor = 'rgb(147 51 234)'; // theme.colors.purple[600] from Tailwind

// Design system integrated file type colors
// Using Tailwind's theme colors for consistency and maintainability
export const fileTypeColors = {
  // Document types - Professional blue tones
  pdf: 'rgb(239 68 68)', // theme.colors.red[500] - attention-grabbing for PDFs
  doc: 'rgb(59 130 246)', // theme.colors.blue[500] - professional blue for documents
  docx: 'rgb(59 130 246)', // theme.colors.blue[500] - professional blue for documents
  txt: 'rgb(107 114 128)', // theme.colors.gray[500] - muted tone for plain text

  // Spreadsheet types - Success green tones
  xls: 'rgb(34 197 94)', // theme.colors.green[500] - green for spreadsheets
  xlsx: 'rgb(34 197 94)', // theme.colors.green[500] - green for spreadsheets

  // Presentation types - Warning amber tones
  ppt: 'rgb(245 158 11)', // theme.colors.amber[500] - amber for presentations
  pptx: 'rgb(245 158 11)', // theme.colors.amber[500] - amber for presentations

  // Image types - Creative purple tones
  jpg: 'rgb(147 51 234)', // theme.colors.purple[600] - purple for images
  jpeg: 'rgb(147 51 234)', // theme.colors.purple[600] - purple for images
  png: 'rgb(147 51 234)', // theme.colors.purple[600] - purple for images
  gif: 'rgb(147 51 234)', // theme.colors.purple[600] - purple for images

  // Default fallback - Neutral muted tone
  default: 'rgb(107 114 128)', // theme.colors.gray[500] - muted for unknown types
} as const;

// Constants for document display
export const TITLE_MAX_LENGTH = 20;
export const FIXED_GRID_STYLES = {
  gap: '16px',
  display: 'grid',
  justifyContent: 'start',
  gridTemplateColumns: 'repeat(auto-fill, 200px)',
} as const;

// Max file size for uploads
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
