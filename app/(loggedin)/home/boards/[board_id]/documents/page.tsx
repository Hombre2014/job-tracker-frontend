'use client';

import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { getUser } from '@/redux/user/userThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { TITLE_MAX_LENGTH, FIXED_GRID_STYLES } from '@/data/constants';
import { LinkDocument } from '@/components/HomePage/HomeNavbar/LinkDocument';
import EditDocumentModal from '@/components/Forms/AddDocument/EditDocumentModal';
import UploadDocumentModal from '@/components/Forms/AddDocument/UploadDocumentModal';
import DocumentCard from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/DocumentCard';
import {
  deleteDocument,
  getDocumentsPerUser,
  getDocumentsPerBoard,
} from '@/redux/documents/documentsThunk';
import {
  selectUserDocuments,
  selectBoardDocuments,
  selectBoardDocumentsStatus,
} from '@/redux/documents/documentsSlice';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<JobDocument | null>(
    null
  );

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
      title: truncateTitle(doc.title), // Use truncated title for board view
      uploadedBy: uploaderInfo || undefined,
    };
  });

  const handleEditDocument = (document: JobDocument) => {
    setDocumentToEdit(document);
    setIsEditModalOpen(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      // For board documents, we always delete the document entirely from the database
      // This will automatically detach it from all job applications and remove it completely
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

  const openDocumentInNewTab = (url: string) => {
    return window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePopupBlocker = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title || 'document';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Document download initiated');
  };

  const checkTabStatusWithTimeout = (newTab: Window) => {
    const timeoutId = setTimeout(() => {
      try {
        if (newTab && !newTab.closed) {
          toast.success('Document opened in new tab');
        } else {
          toast.success('Document has been downloaded');
        }
      } catch (error) {
        console.warn('Could not check tab status:', error);
        toast.success('Document has been processed');
      }
    }, 1000);
    return timeoutId;
  };

  const handleDownloadDocument = async (jobDocument: JobDocument) => {
    try {
      if (!jobDocument.url) {
        toast.error('Document URL not available');
        return;
      }

      const newTab = openDocumentInNewTab(jobDocument.url);

      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        handlePopupBlocker(jobDocument.url, jobDocument.title);
      } else {
        checkTabStatusWithTimeout(newTab);
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
          <div style={FIXED_GRID_STYLES}>
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
    </div>
  );
};

export default BoardDocuments;
