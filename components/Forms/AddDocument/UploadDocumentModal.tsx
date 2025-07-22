'use client';

import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

import { DocumentCategory } from '@/enums';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import DocumentSideBar from './DocumentSideBar';
import { MAX_FILE_SIZE } from '@/data/constants';
import { Textarea } from '@/components/ui/textarea';
import { getJobPost } from '@/redux/jobs/jobsThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import {
  uploadDocument,
  attachDocumentToJobApplication,
} from '@/redux/documents/documentsThunk';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

// Helper functions
const validateFileSize = (file: File): boolean => {
  if (file.size > MAX_FILE_SIZE) {
    toast.error('File size must be less than 10MB');
    return false;
  }
  return true;
};

const UploadDocumentModal = ({
  onClose,
  isVisible,
  buttonLabel,
  dialogTitle,
  defaultJobId,
  onUploadSuccess,
  showButton = true,
}: UploadDocumentModalProps) => {
  const { board_id, job_id } = useParams();
  const dispatch = useAppDispatch();
  const { accessToken, firstName, lastName, email } = useAppSelector(
    (state) => state.user
  );

  // Create user object for DocumentSideBar
  const user = {
    email,
    lastName,
    firstName,
  };

  // Modal state
  const [isFormValid, setIsFormValid] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [category, setCategory] = useState<DocumentCategory | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Jobs linking state
  const [jobsConnectedToDocument, setJobsConnectedToDocument] = useState<
    JobApplication[]
  >([]);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading state
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isVisible !== undefined) {
      setShowUploadModal(isVisible);
    }
  }, [isVisible]);

  // Validate form
  useEffect(() => {
    const isValid =
      selectedFile !== null && title.trim() !== '' && category !== '';
    setIsFormValid(isValid);
  }, [selectedFile, title, category]);

  // Reset form when modal closes
  useEffect(() => {
    if (!showUploadModal) {
      setTitle('');
      setCategory('');
      setDescription('');
      setIsDragOver(false);
      setSelectedFile(null);
      setIsUploading(false);
      setJobsConnectedToDocument([]);
    }
  }, [showUploadModal]);

  const handleFileSelect = (file: File) => {
    // Validate file size before setting
    if (!validateFileSize(file)) {
      return;
    }

    setSelectedFile(file);
    // Auto-populate title with filename (INCLUDING extension) if title is empty
    // IMPORTANT: Always preserve the original filename with extension
    if (!title.trim()) {
      setTitle(file.name); // This includes the extension: "image.png", "document.pdf", etc.
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    // Validate file size
    if (selectedFile && !validateFileSize(selectedFile)) {
      return;
    }

    if (
      !selectedFile ||
      !title.trim() ||
      !category ||
      !board_id ||
      !accessToken
    ) {
      // Add debugging to identify which validation is failing
      console.log('Upload validation failed:', { 
        hasFile: !!selectedFile, 
        hasTitle: !!title.trim(), 
        hasCategory: !!category, 
        hasBoardId: !!board_id, 
        hasAccessToken: !!accessToken 
      });
      
      if (!selectedFile) toast.error('No file selected');
      if (!title.trim()) toast.error('Title is required');
      if (!category) toast.error('Category is required');
      if (!board_id) toast.error('Board ID is missing');
      if (!accessToken) toast.error('Authentication required');
      
      return;
    }

    setIsUploading(true);

    try {
      // CRITICAL FIX: Always preserve original file extension
      const originalExtension = selectedFile.name.split('.').pop() || '';
      const userTitle = title.trim();

      // If user changed the title and it doesn't have an extension, add the original extension
      let finalTitle = userTitle;
      if (originalExtension && !userTitle.includes('.')) {
        finalTitle = `${userTitle}.${originalExtension}`;
      }

      // Step 1: Upload the document with preserved extension
      const uploadResult = await dispatch(
        uploadDocument({
          category,
          accessToken,
          title: finalTitle, // Use title with preserved extension
          file: selectedFile,
          boardId: board_id as string,
          description: description.trim(),
        })
      ).unwrap();

      // Step 2: Attach document to all linked jobs (parallel processing)
      if (uploadResult?.id && jobsConnectedToDocument.length > 0) {
        const attachmentPromises = jobsConnectedToDocument.map((job) =>
          dispatch(
            attachDocumentToJobApplication({
              accessToken,
              jobId: job.id,
              documentId: uploadResult.id,
            })
          ).unwrap()
        );
        await Promise.all(attachmentPromises);
      }

      // Step 3: Refresh job data sequentially to avoid state conflicts
      if (uploadResult?.id) {
        try {
          // First, refresh linked jobs if any
          if (jobsConnectedToDocument.length > 0) {
            for (const job of jobsConnectedToDocument) {
              await dispatch(
                getJobPost({
                  accessToken,
                  jobPostId: job.id,
                })
              ).unwrap();
            }
          }

          // Note: Current job refresh is handled by onUploadSuccess callback
          // to avoid duplicate refresh calls and race conditions
        } catch (refreshError) {
          console.warn('Some job data refresh failed:', refreshError);
          // Don't throw - upload was successful, just refresh failed
        }
      }

      // Show success message
      toast.success('Document uploaded successfully!');

      // Call the success callback to refresh documents list
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Close modal immediately (no artificial delay)
      setShowUploadModal(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
      // Show error toast to user
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const documentCategories = Object.values(DocumentCategory);

  return (
    <div>
      {showButton && (
        <Button
          variant="normal"
          onClick={() => {
            setShowUploadModal(true);
          }}
        >
          {buttonLabel || '+ Upload'}
        </Button>
      )}
      {showUploadModal && (
        <AlertDialogModal
          buttonVariant="none"
          buttonCancel="Discard"
          open={showUploadModal}
          actionFunction={handleUpload}
          isFormValid={isFormValid && !isUploading}
          dialogTitle={dialogTitle || 'Upload Document'}
          buttonConfirm={isUploading ? 'Uploading...' : 'Create'}
          contentWidth="!max-w-[910px] !min-h-[840px] !max-h-[840px]"
          onOpenChange={(open) => {
            setShowUploadModal(open);
            if (!open && onClose) {
              onClose();
            }
          }}
        >
          <div className="flex gap-8 h-full">
            {/* Left Column - Form Fields */}
            <div className="flex-[2] space-y-6 w-3/4 overflow-y-auto pr-2 max-h-[640px]">
              {/* File Upload Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="file-upload" className="text-left">
                    Select file
                  </Label>
                  <span className="text-sm text-gray-500">Required</span>
                </div>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50'
                      : selectedFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="file"
                    accept="*/*"
                    id="file-upload"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileInputChange}
                    aria-label="Select document file"
                  />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="text-green-600 font-medium">
                        ✓ File Selected
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{selectedFile.name}</div>
                        <div className="text-xs">
                          {formatFileSize(selectedFile.size)} •{' '}
                          {selectedFile.type || 'Unknown type'}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setTitle('');
                        }}
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        type="button"
                        className="mb-2"
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Upload file
                      </Button>
                      <div className="text-xs text-gray-400">
                        or drag and drop a file here
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="title" className="text-left">
                    Title
                  </Label>
                  <span className="text-sm text-gray-500">Required</span>
                </div>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  className="w-full"
                  placeholder="Enter document title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="category" className="text-left">
                    Document Category
                  </Label>
                  <span className="text-sm text-gray-500">Required</span>
                </div>
                <Select
                  value={category}
                  onValueChange={(value: string) =>
                    setCategory(value as DocumentCategory)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-left">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  className="w-full min-h-[200px]"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for this document"
                />
              </div>
            </div>

            {/* Right Column - DocumentSideBar */}
            <div className="w-1/4 flex-shrink-0">
              {user && (
                <DocumentSideBar
                  user={user}
                  job_id={defaultJobId}
                  onJobsChange={setJobsConnectedToDocument}
                  jobsConnectedToDocument={jobsConnectedToDocument}
                />
              )}
            </div>
          </div>
        </AlertDialogModal>
      )}
    </div>
  );
};

export default UploadDocumentModal;
