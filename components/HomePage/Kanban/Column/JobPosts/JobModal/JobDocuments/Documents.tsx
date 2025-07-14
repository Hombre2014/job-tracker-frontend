'use client';

import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import DocumentCard from './DocumentCard';
import { getUser } from '@/redux/user/userThunk';
import { getJobPost } from '@/redux/jobs/jobsThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { LinkDocument } from '@/components/HomePage/HomeNavbar/LinkDocument';
import UploadDocumentModal from '@/components/Forms/AddDocument/UploadDocumentModal';
import {
  deleteDocument,
  detachDocumentFromJobApplication,
} from '@/redux/documents/documentsThunk';

const Documents = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.jobs);
  const user = useAppSelector((state) => state.user);
  const accessToken = localStorage.getItem('accessToken');
  const [uploaderInfo, setUploaderInfo] = useState<{
    lastName: string;
    firstName: string;
    profilePicUrl?: string;
  } | null>(null);

  // Find the current job and its documents
  const currentJob = jobs.jobPosts.find((job) => job.id === job_id);
  const jobDocuments = currentJob?.documents || [];

  // Function to refresh documents (called after successful upload)
  const handleDocumentsRefresh = async () => {
    // Simple refresh without disruptive re-renders - just re-fetch job data
    if (job_id && accessToken) {
      try {
        await dispatch(
          getJobPost({
            accessToken,
            jobPostId: job_id as string,
          })
        ).unwrap();
      } catch (error) {
        console.warn('Failed to refresh job documents:', error);
      }
    }
  };

  // Fetch user info for uploader details
  useEffect(() => {
    if (accessToken && !uploaderInfo) {
      // Check if user info is already in Redux state
      if (user.firstName && user.lastName) {
        setUploaderInfo({
          lastName: user.lastName,
          firstName: user.firstName,
          profilePicUrl: user.profilePicUrl,
        });
      } else {
        // Fetch user info if not available
        dispatch(getUser(accessToken)).then((result) => {
          if (result.payload) {
            setUploaderInfo({
              lastName: result.payload.lastName,
              firstName: result.payload.firstName,
              profilePicUrl: result.payload.profilePicUrl,
            });
          }
        });
      }
    }
  }, [
    dispatch,
    accessToken,
    uploaderInfo,
    user.lastName,
    user.firstName,
    user.profilePicUrl,
  ]);

  // Enhance documents with uploader information and file size from localStorage if available
  const enhancedDocuments = jobDocuments.map((doc) => {
    // Try to get file size from localStorage (stored during upload)
    const storedFileSize = localStorage.getItem(`fileSize_${doc.id}`);
    const fileSize = storedFileSize ? parseInt(storedFileSize) : doc.fileSize;

    return {
      ...doc,
      fileSize: fileSize,
      uploadedBy: uploaderInfo || undefined,
    };
  });

  const handleEditDocument = (document: JobDocument) => {
    // TODO: Implement edit functionality
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      // First, detach the document from the current job application
      if (job_id) {
        await dispatch(
          detachDocumentFromJobApplication({
            documentId,
            jobId: job_id as string,
            accessToken: accessToken as string,
          })
        ).unwrap();
      }

      // Then delete the document
      await dispatch(
        deleteDocument({
          documentId,
          accessToken: accessToken as string,
        })
      ).unwrap();

      toast.success('Document deleted successfully!');

      // Refresh the documents list
      handleDocumentsRefresh();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document. Please try again.');
    }
  };

  const handleDownloadDocument = async (jobDocument: JobDocument) => {
    try {
      if (!jobDocument.url) {
        toast.error('Document URL not available');
        return;
      }

      // Track if a new tab was opened and stayed open
      const newTab = window.open(jobDocument.url, '_blank', 'noopener,noreferrer');
      
      // Check after a short delay if the tab was closed (indicating a download)
      setTimeout(() => {
        if (!newTab || newTab.closed) {
          // Tab was closed or couldn't be opened, likely a download occurred
          toast.success('Document has been downloaded');
        }
        // If tab is still open, no toast needed as user can see the document
      }, 500);

    } catch (error) {
      console.error('Error opening document:', error);
      toast.error('Failed to open document. Please try again.');
    }
  };

  return (
    <>
      <div className="w-full mx-auto mt-6 h-full flex flex-col">
        <div className="w-full flex justify-between items-center pb-4 border-b flex-shrink-0">
          <div className="text-blue-500 font-medium bg-blue-200/40 rounded-md px-2">
            All ({jobDocuments.length})
          </div>
          <div className="flex gap-4">
            <LinkDocument
              searchItem="Documents"
              docs={enhancedDocuments}
              initialString="+ Link Document"
            />
            <UploadDocumentModal
              defaultJobId={job_id as string}
              onUploadSuccess={handleDocumentsRefresh}
            />
          </div>
        </div>

        {jobDocuments.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-xl text-slate-400 mt-48">
              You have not uploaded any documents yet
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mt-6 pr-2 document-grid-scrollbar max-h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 min-h-0">
              {enhancedDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onEdit={handleEditDocument}
                  onDelete={handleDeleteDocument}
                  onDownload={handleDownloadDocument}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Documents;
