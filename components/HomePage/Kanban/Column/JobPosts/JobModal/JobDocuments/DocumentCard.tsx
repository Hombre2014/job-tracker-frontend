'use client';

import Image from 'next/image';
import { BsThreeDots } from 'react-icons/bs';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { FiFile, FiImage, FiFileText } from 'react-icons/fi';

import {
  getTimeAgo,
  getFileInfo,
  getDocumentType,
  documentCategoryColors,
} from '@/utils/documentHelpers';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentCardProps {
  document: WorkDocument & {
    fileSize?: number;
    createdAt?: string;
    updatedAt?: string;
    uploadedBy?: {
      lastName: string;
      firstName: string;
      profilePicUrl?: string;
    };
  };
  onEdit?: (document: WorkDocument) => void;
  onDelete?: (documentId: string) => void;
  onDownload?: (document: WorkDocument) => void;
}

const DocumentCard = ({
  document,
  onEdit,
  onDelete,
  onDownload,
}: DocumentCardProps) => {
  const documentType = getDocumentType(document.title);
  const fileInfo = getFileInfo(document.title, document.fileSize);
  const timeAgo = getTimeAgo(document.createdAt || document.updatedAt || '');
  const categoryColor =
    documentCategoryColors[
      document.category as keyof typeof documentCategoryColors
    ] || documentCategoryColors['Other'];

  // Get appropriate icon based on document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <AiOutlineFilePdf className="w-8 h-8 text-red-500" />;
      case 'DOC':
        return <FiFileText className="w-8 h-8 text-blue-500" />;
      case 'IMG':
        return <FiImage className="w-8 h-8 text-green-500" />;
      default:
        return <FiFile className="w-8 h-8 text-gray-500" />;
    }
  };

  // Truncate filename if too long
  const truncateFilename = (filename: string, maxLength: number = 20) => {
    if (filename.length <= maxLength) return filename;
    const extension = filename.split('.').pop();
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const truncatedName = nameWithoutExt.substring(
      0,
      maxLength - extension!.length - 4
    );
    return `${truncatedName}...${extension}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header with file icon and three dots menu */}
      <div className="flex justify-between items-start mb-3">
        <div className="relative">
          {getDocumentIcon(documentType)}
          {/* Document type pill overlay */}
          <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
            {documentType}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Document options"
            >
              <BsThreeDots className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onDownload && (
              <DropdownMenuItem onClick={() => onDownload(document)}>
                Download
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(document)}>
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(document.id)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* File name */}
      <div className="mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">
          {truncateFilename(document.title)}
        </h3>
      </div>

      {/* File extension and size */}
      <div className="text-xs text-gray-500 mb-3">{fileInfo}</div>

      {/* Category badge */}
      <div className="mb-3">
        <span
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: categoryColor }}
        >
          {document.category}
        </span>
      </div>

      {/* Uploader info and time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {document.uploadedBy?.profilePicUrl ? (
            <Image
              width={24}
              height={24}
              src={document.uploadedBy.profilePicUrl}
              className="w-6 h-6 rounded-full object-cover"
              alt={`${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`}
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {document.uploadedBy?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <span className="text-xs text-gray-600 font-medium">
            {document.uploadedBy
              ? `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`
              : 'Unknown'}
          </span>
        </div>

        <span className="text-xs text-gray-500">{timeAgo}</span>
      </div>
    </div>
  );
};

export default DocumentCard;
