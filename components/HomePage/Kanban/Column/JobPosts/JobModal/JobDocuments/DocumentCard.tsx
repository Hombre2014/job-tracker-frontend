'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';

import { fileTypeColors } from '@/data/constants';
import { getTimeAgo, documentCategoryColors } from '@/utils/documentHelpers';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentCardProps {
  document: JobDocument;
  onDelete?: (documentId: string) => void;
  onEdit?: (document: JobDocument) => void;
  onDownload?: (document: JobDocument) => void;
}

const DocumentCard = ({
  document,
  onEdit,
  onDelete,
  onDownload,
}: DocumentCardProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const timeAgo = getTimeAgo(document.createdAt || document.updatedAt || '');
  const categoryColor =
    documentCategoryColors[
      document.category as keyof typeof documentCategoryColors
    ] || documentCategoryColors.Other;

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(false);
    if (onDelete) {
      onDelete(document.id);
    }
  };

  // Simple and reliable file extension detection
  const getFileExtensionInfo = () => {
    // Use title as the filename (it should contain the full filename with extension)
    const filename = document.title || '';

    // Extract extension from filename - case insensitive
    const extensionMatch = filename.match(/\.([^.]+)$/i);

    if (extensionMatch) {
      const ext = extensionMatch[1].toLowerCase();

      // Map extensions to display types consistently
      let displayType = ext.toUpperCase();

      switch (ext) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'svg':
        case 'webp':
          displayType = 'IMG';
          break;
        case 'doc':
        case 'docx':
          displayType = 'DOC';
          break;
        case 'xls':
        case 'xlsx':
          displayType = 'XLS';
          break;
        case 'ppt':
        case 'pptx':
          displayType = 'PPT';
          break;
        case 'pdf':
          displayType = 'PDF';
          break;
        case 'txt':
          displayType = 'TXT';
          break;
        case 'zip':
        case 'rar':
        case '7z':
          displayType = 'ZIP';
          break;
        default:
          displayType = ext.toUpperCase();
      }

      return {
        extension: ext,
        isLegacy: false,
        extensionUpper: displayType,
      };
    }

    // No extension found - use category as fallback
    let defaultExt = 'file';
    let defaultDisplay = 'FILE';

    switch (document.category) {
      case 'Resume':
      case 'Portfolio':
      case 'Transcript':
      case 'Certification':
        defaultExt = 'pdf';
        defaultDisplay = 'PDF';
        break;
      case 'Cover Letter':
        defaultExt = 'doc';
        defaultDisplay = 'DOC';
        break;
      default:
        defaultExt = 'file';
        defaultDisplay = 'FILE';
    }

    return {
      isLegacy: true,
      extension: defaultExt,
      extensionUpper: defaultDisplay,
    };
  };

  const { extension: fileExtension, extensionUpper: fileExtensionUpper } =
    getFileExtensionInfo();

  const fileColor =
    fileTypeColors[fileExtension as keyof typeof fileTypeColors] ||
    fileTypeColors.default;

  // Get file size display in format: "PDF - 1.2 KB" or just "PDF"
  const getFileSizeDisplay = () => {
    // First try to get from document object
    let fileSize = document.fileSize;

    // If not available, try localStorage (for newly uploaded documents)
    if (!fileSize || fileSize <= 0) {
      const storedFileSize = localStorage.getItem(`fileSize_${document.id}`);
      fileSize = storedFileSize ? parseInt(storedFileSize) : undefined;
    }

    // Format: "PDF - 1.2 KB" or just "PDF"
    if (fileSize && fileSize > 0) {
      const sizeInKB = (fileSize / 1024).toFixed(1);
      return `${fileExtensionUpper} - ${sizeInKB} KB`;
    }

    return fileExtensionUpper;
  };

  // Truncate filename if too long - simple truncation with ellipsis at the end
  const truncateFilename = (filename: string, maxLength: number = 25) => {
    if (filename.length <= maxLength) return filename;
    return filename.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200">
      {/* Document title */}
      <div className="text-center mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
          {truncateFilename(document.title)}
        </h3>
        {/* File type and size */}
        <p className="text-xs text-gray-500 mt-1">{getFileSizeDisplay()}</p>
      </div>

      {/* File type display with pill-shaped badge */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div
            className="w-16 h-20 rounded-lg flex items-center justify-center border-2 bg-gray-50"
            style={{
              borderColor: '#E5E7EB',
            }}
          >
            {/* Pill-shaped colored badge with file extension ONLY */}
            <div
              className="px-3 py-1 rounded-full text-white text-xs font-bold uppercase"
              style={{ backgroundColor: fileColor }}
            >
              {fileExtensionUpper}
            </div>
          </div>
        </div>
      </div>

      {/* Uploader info - centered */}
      <div className="flex items-center justify-center space-x-2 mb-1">
        {document.uploadedBy?.profilePicUrl ? (
          <Image
            width={20}
            height={20}
            src={document.uploadedBy.profilePicUrl}
            className="w-5 h-5 rounded-full object-cover"
            alt={`${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`}
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {document.uploadedBy?.firstName?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        <span className="text-xs text-gray-700 font-medium">
          {document.uploadedBy
            ? `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`
            : 'Unknown'}
        </span>
      </div>

      {/* Upload time - centered */}
      <div className="mb-4 text-center">
        <span className="text-xs text-gray-500">uploaded {timeAgo}</span>
      </div>

      {/* Separator */}
      <hr className="border-gray-200 mb-3" />

      {/* Category badge and menu */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: categoryColor }}
        >
          {document.category}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Options for ${document.title}`}
              className="border border-gray-300 rounded-md p-1.5 hover:bg-gray-50 transition-colors"
            >
              <BsThreeDots className="w-4 h-4 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(document)}>
                Edit
              </DropdownMenuItem>
            )}
            {onDownload && (
              <DropdownMenuItem onClick={() => onDownload(document)}>
                Open/Download Document
              </DropdownMenuItem>
            )}
            {onDelete && (
              <div onClick={(e) => e.stopPropagation()}>
                <AlertDialogModal
                  buttonCancel="Cancel"
                  buttonVariant="ghost"
                  buttonConfirm="Delete"
                  destructiveVariant={true}
                  dialogTitle="Delete Document"
                  buttonLabel="Delete Document"
                  open={showDeleteConfirmation}
                  actionFunction={handleDeleteClick}
                  onOpenChange={setShowDeleteConfirmation}
                  dialogText={`Are you sure you want to delete "${document.title}"? This action cannot be undone.`}
                  stylings="ml-0 pl-2 font-normal inline-flex justify-start w-full text-left text-red-600 hover:text-red-700"
                />
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DocumentCard;
