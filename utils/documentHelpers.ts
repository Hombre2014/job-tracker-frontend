import { DocumentCategory } from '@/enums';

export const documentCategoryColors = {
  [DocumentCategory.Other]: '#6B7280', // Gray
  [DocumentCategory.Resume]: '#3B82F6', // Blue
  [DocumentCategory.JobPost]: '#84CC16', // Lime
  [DocumentCategory.Portfolio]: '#8B5CF6', // Purple
  [DocumentCategory.Transcript]: '#EF4444', // Red
  [DocumentCategory.OfferLetter]: '#06B6D4', // Cyan
  [DocumentCategory.CoverLetter]: '#10B981', // Green
  [DocumentCategory.Certification]: '#F59E0B', // Amber
  [DocumentCategory.WritingSample]: '#F97316', // Orange
  [DocumentCategory.Recommendation]: '#EC4899', // Pink
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
  const now = new Date();
  const uploadDate = new Date(dateString);
  const diffInMs = now.getTime() - uploadDate.getTime();

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
