'use client';

import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import { getUser } from '@/redux/user/userThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import DocumentCard from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/DocumentCard';
import {
  getDocument,
  deleteDocument,
  getDocumentsPerUser,
} from '@/redux/documents/documentsThunk';
import {
  selectUserDocuments,
  selectUserDocumentsStatus,
} from '@/redux/documents/documentsSlice';

const UserDocuments = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const accessToken = localStorage.getItem('accessToken');
  const userDocuments = useAppSelector(selectUserDocuments);
  const userDocumentsStatus = useAppSelector(selectUserDocumentsStatus);
  const [uploaderInfo, setUploaderInfo] = useState<{
    lastName: string;
    firstName: string;
    profilePicUrl?: string;
  } | null>(null);

  // Function to refresh user documents
  const handleDocumentsRefresh = async () => {
    if (accessToken) {
      try {
        await dispatch(getDocumentsPerUser(accessToken)).unwrap();
      } catch (error) {
        console.warn('Failed to refresh user documents:', error);
      }
    }
  };

  // Fetch user info for uploader details
  useEffect(() => {
    if (accessToken && !uploaderInfo) {
      if (user.firstName && user.lastName) {
        setUploaderInfo({
          lastName: user.lastName,
          firstName: user.firstName,
          profilePicUrl: user.profilePicUrl,
        });
      } else {
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

  // Fetch user documents on mount
  useEffect(() => {
    if (accessToken) {
      dispatch(getDocumentsPerUser(accessToken));
    }
  }, [dispatch, accessToken]);

  // Enhance documents with uploader information and truncated titles for user view
  const enhancedDocuments = userDocuments.map((doc) => {
    const storedFileSize = localStorage.getItem(`fileSize_${doc.id}`);
    const fileSize = storedFileSize ? parseInt(storedFileSize) : doc.fileSize;

    // Truncate title to ~20 characters for better layout
    const truncateTitle = (title: string, maxLength: number = 20) => {
      if (title.length <= maxLength) return title;
      return title.substring(0, maxLength - 3) + '...';
    };

    return {
      ...doc,
      title: truncateTitle(doc.title), // Use truncated title for consistent layout
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

      // For user documents, check if document is attached to job applications
      const documentDetailsResult = await dispatch(
        getDocument({
          documentId,
          accessToken: accessToken as string,
        })
      ).unwrap();

      const jobApplicationsCount = documentDetailsResult.jobApplications?.length || 0;

      // If attached to job applications, warn user
      if (jobApplicationsCount > 0) {
        toast.info(
          'This document is attached to job applications. Delete it from those jobs first.'
        );
        return;
      }

      // Delete the document entirely since it's not attached to any job applications
      await dispatch(
        deleteDocument({
          documentId,
          accessToken: accessToken as string,
        })
      ).unwrap();

      toast.success('Document deleted successfully!');
      await handleDocumentsRefresh();
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

      const newTab = window.open(
        jobDocument.url,
        '_blank',
        'noopener,noreferrer'
      );

      setTimeout(() => {
        if (!newTab || newTab.closed) {
          toast.success('Document has been downloaded');
        }
      }, 500);
    } catch (error) {
      console.error('Error opening document:', error);
      toast.error('Failed to open document. Please try again.');
    }
  };

  if (userDocumentsStatus === 'loading') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full py-2 border-b flex justify-center items-center flex-shrink-0 bg-white">
        <div className="h-9 flex items-center">
          <h1 className="font-semibold text-center">Documents</h1>
        </div>
      </div>

      <div className="w-full flex justify-between items-center p-6 border-b flex-shrink-0 bg-white">
        <div className="text-blue-500 font-medium bg-blue-200/40 rounded-md px-2">
          All ({userDocuments.length})
        </div>
        <div className="text-sm text-gray-500">
          To upload documents, visit a specific board&apos;s documents page
        </div>
      </div>

      {userDocuments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-xl text-slate-400">
            You have not created any documents yet
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
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
  );
};

export default UserDocuments;
