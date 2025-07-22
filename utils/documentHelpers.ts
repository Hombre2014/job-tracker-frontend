import { DocumentCategory } from '@/enums';

// Design system integrated document category colors
// Using HSL values that align with our theme and ensure accessibility
export const documentCategoryColors = {
  [DocumentCategory.Other]: 'hsl(239 84% 67%)', // Indigo-500 - medium indigo
  [DocumentCategory.Resume]: 'hsl(221.2 83.2% 53.3%)', // Primary blue - important documents
  [DocumentCategory.JobPost]: 'hsl(84.2 80.5% 45.1%)', // Success green - opportunities
  [DocumentCategory.Portfolio]: 'hsl(270.7 91% 65.1%)', // Creative purple - showcase work
  [DocumentCategory.Transcript]: 'hsl(0 84.2% 60.2%)', // Alert red - official records
  [DocumentCategory.OfferLetter]: 'hsl(26 100% 37%)', // Amber-700 - good news
  [DocumentCategory.WritingSample]: 'hsl(24.6 95% 53.1%)', // Creative orange - samples
  [DocumentCategory.CoverLetter]: 'hsl(142.1 76.2% 36.3%)', // Professional green - applications
  [DocumentCategory.Certification]: 'hsl(166.2 76.5% 41.4%)', // Teal-500 - credentials
  [DocumentCategory.Recommendation]: 'hsl(316.7 75.8% 55.9%)', // Trust pink - endorsements
};

// Helper function to get document type from file extension
export const getDocumentType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  switch (extension) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
      return 'DOC';
    case 'xls':
    case 'xlsx':
      return 'XLS';
    case 'ppt':
    case 'pptx':
      return 'PPT';
    case 'txt':
      return 'TXT';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'IMG';
    default:
      return 'FILE';
  }
};

// Helper function to get file extension and size display
export const getFileInfo = (filename: string, size?: number): string => {
  const extension = filename.split('.').pop()?.toUpperCase() || 'FILE';
  if (size) {
    const sizeInKB = (size / 1024).toFixed(1);
    return `${extension} • ${sizeInKB} KB`;
  }
  return extension;
};

// Helper function to calculate time ago
export const getTimeAgo = (dateString: string): string => {
  const now = Date.now(); // Use timestamp for better performance
  const uploadDate = new Date(dateString);

  // Handle invalid dates
  if (isNaN(uploadDate.getTime()) || !dateString) {
    return 'unknown';
  }

  const diffInMs = now - uploadDate.getTime();

  // Handle future dates
  if (diffInMs < 0) {
    return 'just now';
  }

  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
};
