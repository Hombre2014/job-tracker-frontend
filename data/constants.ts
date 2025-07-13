export const defaultJobPostColor = 'hsl(270.7 91% 65.1%)'; // Purple from design system

// Design system integrated file type colors
// Using HSL values that match our theme system and ensure accessibility
export const fileTypeColors = {
  // Document types - Professional blue tones
  pdf: 'hsl(0 84.2% 60.2%)',        // Red tone for PDFs (attention-grabbing)
  doc: 'hsl(221.2 83.2% 53.3%)',    // Professional blue for documents  
  docx: 'hsl(221.2 83.2% 53.3%)',   // Professional blue for documents
  txt: 'hsl(215.4 16.3% 46.9%)',    // Muted tone for plain text
  
  // Spreadsheet types - Success green tones  
  xls: 'hsl(142.1 76.2% 36.3%)',    // Green for spreadsheets
  xlsx: 'hsl(142.1 76.2% 36.3%)',   // Green for spreadsheets
  
  // Presentation types - Warning amber tones
  ppt: 'hsl(32.6 94.6% 43.7%)',     // Amber for presentations
  pptx: 'hsl(32.6 94.6% 43.7%)',    // Amber for presentations
  
  // Image types - Creative purple tones
  jpg: 'hsl(270.7 91% 65.1%)',      // Purple for images
  jpeg: 'hsl(270.7 91% 65.1%)',     // Purple for images  
  png: 'hsl(270.7 91% 65.1%)',      // Purple for images
  gif: 'hsl(270.7 91% 65.1%)',      // Purple for images
  
  // Default fallback - Neutral muted tone
  default: 'hsl(215.4 16.3% 46.9%)', // Muted foreground for unknown types
} as const;
