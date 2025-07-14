'use client';

import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { getUser } from '@/redux/user/userThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { LinkDocument } from '@/components/HomePage/HomeNavbar/LinkDocument';
import UploadDocumentModal from '@/components/Forms/AddDocument/UploadDocumentModal';
import DocumentCard from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/DocumentCard';
import {
  selectUserDocuments,
  selectBoardDocuments,
  selectBoardDocumentsStatus,
} from '@/redux/documents/documentsSlice';
import {
  getDocument,
  deleteDocument,
  getDocumentsPerUser,
  getDocumentsPerBoard,
} from '@/redux/documents/documentsThunk';

// Constants for document display
const TITLE_MAX_LENGTH = 20;
const RESPONSIVE_GRID_STYLES = {
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
} as const;

const BoardDocuments = () => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const accessToken = (() => {
    try {
      return localStorage.getItem('accessToken');
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
      return null;
    }
  })();
  const userDocuments = useAppSelector(selectUserDocuments);
  const boardDocuments = useAppSelector(selectBoardDocuments);
  const boardDocumentsStatus = useAppSelector(selectBoardDocumentsStatus);
  const [uploaderInfo, setUploaderInfo] = useState<{
    lastName: string;
    firstName: string;
    profilePicUrl?: string;
  } | null>(null);

  // Type-safe board ID extraction
  const boardId = Array.isArray(board_id) ? board_id[0] : board_id;

  // Function to refresh board documents
  const handleDocumentsRefresh = async () => {
    if (boardId && accessToken) {
      try {
        await dispatch(
          getDocumentsPerBoard({
            accessToken,
            boardId: boardId,
          })
        ).unwrap();
      } catch (error) {
        console.warn('Failed to refresh board documents:', error);
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

  // Fetch board documents and user documents on mount
  useEffect(() => {
    if (accessToken && boardId) {
      dispatch(
        getDocumentsPerBoard({
          accessToken,
          boardId: boardId,
        })
      );
      dispatch(getDocumentsPerUser(accessToken));
    }
  }, [dispatch, accessToken, boardId]);

  // Early return after all hooks are called
  if (!boardId) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-center text-xl text-red-500">Invalid board ID</p>
      </div>
    );
  }

  // Handle document selection from LinkDocument (this would be used for linking existing documents)
  const handleDocumentSelect = async (
    documentTitle: string,
    documentId: string
  ) => {
    // TODO: Implement document linking for board context
    // This should allow users to link existing documents from other boards to this board
    toast.warning('Document linking feature is coming soon!');
  };

  // Filter out documents that are already in this board
  const availableDocuments = userDocuments.filter(
    (document) =>
      !boardDocuments.some((boardDoc) => boardDoc.id === document.id)
  );

  // Enhance documents with uploader information and truncated titles for board view
  const enhancedDocuments = boardDocuments.map((doc) => {
    let fileSize = doc.fileSize;
    try {
      const storedFileSize = localStorage.getItem(`fileSize_${doc.id}`);
      fileSize = storedFileSize ? parseInt(storedFileSize) : doc.fileSize;
    } catch (error) {
      console.warn('Failed to access localStorage for file size:', error);
    }

    // Truncate title to ~20 characters for better board layout
    const truncateTitle = (
      title: string,
      maxLength: number = TITLE_MAX_LENGTH
    ) => {
      if (title.length <= maxLength) return title;
      return title.substring(0, maxLength - 3) + '...';
    };

    return {
      ...doc,
      fileSize: fileSize,
      title: truncateTitle(doc.title), // Use truncated title for board view
      uploadedBy: uploaderInfo || undefined,
    };
  });

  const handleEditDocument = (document: JobDocument) => {
    // TODO: Implement edit functionality - Allow users to edit document metadata (title, category, description)
    // This should open a modal similar to UploadDocumentModal but for editing existing documents
    toast.info('Document editing functionality will be implemented soon');
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      // For board documents, we need to check if document is attached to job applications
      const documentDetailsResult = await dispatch(
        getDocument({
          documentId,
          accessToken: accessToken as string,
        })
      ).unwrap();

      const jobApplicationsCount =
        documentDetailsResult.jobApplications?.length || 0;

      // If attached to job applications, only delete from database if no attachments
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

  if (boardDocumentsStatus === 'loading') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full flex justify-between items-center p-6 border-b flex-shrink-0 bg-white">
        <div className="text-blue-500 font-medium bg-blue-200/40 rounded-md px-2">
          All ({boardDocuments.length})
        </div>
        <div className="flex gap-4">
          <LinkDocument
            searchItem="Documents"
            docs={availableDocuments}
            initialString="+ Link Document"
            onDocumentSelect={handleDocumentSelect}
          />
          <UploadDocumentModal onUploadSuccess={handleDocumentsRefresh} />
        </div>
      </div>

      {boardDocuments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-xl text-slate-400">
            You have not created any documents yet
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4" style={RESPONSIVE_GRID_STYLES}>
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

export default BoardDocuments;
