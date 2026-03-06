'use client';

import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

import DocumentCard from './DocumentCard';
import { getUser } from '@/redux/user/userSlice';
import { getJobPost } from '@/redux/jobs/jobsThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUserDocuments } from '@/redux/documents/documentsSlice';
import { LinkDocument } from '@/components/HomePage/HomeNavbar/LinkDocument';
import UploadDocumentModal from '@/components/Forms/AddDocument/UploadDocumentModal';
import {
  getDocument,
  deleteDocument,
  getDocumentsPerUser,
  attachDocumentToJobApplication,
  detachDocumentFromJobApplication,
} from '@/redux/documents/documentsThunk';
import EditDocumentModal from '@/components/Forms/AddDocument/EditDocumentModal';

const Documents = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.jobs);
  const user = useAppSelector((state) => state.user);
  const userDocuments = useAppSelector(selectUserDocuments);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<JobDocument | null>(
    null
  );
  const [uploaderInfo, setUploaderInfo] = useState<{
    lastName: string;
    firstName: string;
    profilePicUrl?: string;
  } | null>(null);

  // Find the current job and its documents (memoized to prevent unnecessary re-renders)
  const currentJob = jobs.jobPosts.find((job) => job.id === job_id);
  const jobDocuments = useMemo(() => currentJob?.documents || [], [currentJob]);

  // Function to refresh documents (called after successful upload)
  const handleDocumentsRefresh = async () => {
    // Simple refresh without disruptive re-renders - just re-fetch job data
    if (job_id) {
      try {
        await dispatch(getJobPost(job_id as string)).unwrap();
      } catch (error) {
        console.warn('Failed to refresh job documents:', error);
      }
    }
  };

  // Fetch user info for uploader details
  useEffect(() => {
    if (!uploaderInfo) {
      // Check if user info is already in Redux state
      if (user.firstName && user.lastName) {
        setUploaderInfo({
          lastName: user.lastName,
          firstName: user.firstName,
          profilePicUrl: user.profilePicUrl,
        });
      } else {
        // Fetch user info if not available
        dispatch(getUser()).then((result) => {
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
    uploaderInfo,
    user.lastName,
    user.firstName,
    user.profilePicUrl,
  ]);

  // Fetch user documents for link document functionality
  useEffect(() => {
    dispatch(getDocumentsPerUser());
  }, [dispatch]);

  // Handle document selection from LinkDocument
  const handleDocumentSelect = async (
    documentTitle: string,
    documentId: string
  ) => {
    if (!job_id) {
      toast.error('Unable to attach document. Please try again.');
      return;
    }

    try {
      await dispatch(
        attachDocumentToJobApplication({
          documentId,
          jobId: job_id as string,
        })
      ).unwrap();

      toast.success('Document attached successfully!');

      // Refresh job data to show the newly attached document
      await handleDocumentsRefresh();
    } catch (error) {
      console.error('Error attaching document:', error);
      toast.error('Failed to attach document. Please try again.');
    }
  };

  // Filter out documents that are already attached to current job (memoized for performance)
  const availableDocuments = useMemo(
    () =>
      userDocuments.filter(
        (document) =>
          !jobDocuments.some((attachedDoc) => attachedDoc.id === document.id)
      ),
    [userDocuments, jobDocuments]
  );

  // Enhance documents with uploader information
  const enhancedDocuments = jobDocuments.map((doc) => {
    return {
      ...doc,
      uploadedBy: uploaderInfo || undefined,
    };
  });

  const handleEditDocument = (document: JobDocument) => {
    setDocumentToEdit(document);
    setIsEditModalOpen(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      // First, get the document details to check how many job applications it's attached to
      const documentDetailsResult = await dispatch(
        getDocument(documentId)
      ).unwrap();

      const jobApplicationsCount =
        documentDetailsResult.jobApplications?.length || 0;

      // Always detach the document from the current job application first
      if (job_id) {
        await dispatch(
          detachDocumentFromJobApplication({
            documentId,
            jobId: job_id as string
          })
        ).unwrap();
      }

      // Only delete the document if it was attached to 1 or fewer job applications
      // (meaning after detaching, it's not attached to any other job applications)
      if (jobApplicationsCount <= 1) {
        await dispatch(deleteDocument(documentId)).unwrap();
        toast.success('Document detached and deleted successfully!');
      } else {
        toast.success('Document detached from this job application!');
      }

      // Refresh the documents list
      handleDocumentsRefresh();
    } catch (error) {
      console.error('Error handling document deletion:', error);
      toast.error('Failed to remove document. Please try again.');
    }
  };

  const handleDownloadDocument = async (jobDocument: JobDocument) => {
    try {
      if (!jobDocument.url) {
        toast.error('Document URL not available');
        return;
      }

      // Try to open in new tab, with fallback for popup blockers
      const newTab = window.open(
        jobDocument.url,
        '_blank',
        'noopener,noreferrer'
      );

      // Handle popup blocker case
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        // Fallback: Create a download link
        const link = document.createElement('a');
        link.href = jobDocument.url;
        link.download = jobDocument.title || 'document';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Document download initiated');
      } else {
        // Use a more robust approach with proper error handling and longer timeout
        const checkTabStatus = setTimeout(() => {
          try {
            if (newTab && !newTab.closed) {
              toast.success('Document opened in new tab');
            } else {
              toast.success('Document has been downloaded');
            }
          } catch (error) {
            // Tab may be closed, cross-origin, or inaccessible
            console.warn('Could not check tab status:', error);
            toast.success('Document has been processed');
          }
        }, 1000);
      }
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
              docs={availableDocuments}
              initialString="+ Link Document"
              onDocumentSelect={handleDocumentSelect}
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

      {/* Edit Document Modal */}
      {isEditModalOpen && documentToEdit && (
        <EditDocumentModal
          isOpen={isEditModalOpen}
          documentToEdit={documentToEdit}
          onEditSuccess={async () => {
            await handleDocumentsRefresh();
            setIsEditModalOpen(false);
            setDocumentToEdit(null);
          }}
          onClose={() => {
            setIsEditModalOpen(false);
            setDocumentToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default Documents;
