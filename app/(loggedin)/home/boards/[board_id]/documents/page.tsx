'use client';

import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { getUser } from '@/redux/user/userSlice';
import { TITLE_MAX_LENGTH } from '@/data/constants';
import useDocumentActions from '@/hooks/useDocumentActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import DocumentGrid from '@/components/Documents/DocumentGrid';
import DocumentFilterBar from '@/components/Documents/DocumentFilterBar';
// import { LinkDocument } from '@/components/HomePage/HomeNavbar/LinkDocument';
import EditDocumentModal from '@/components/Forms/AddDocument/EditDocumentModal';
import UploadDocumentModal from '@/components/Forms/AddDocument/UploadDocumentModal';
import {
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

  const userDocuments = useAppSelector(selectUserDocuments);
  const boardDocuments = useAppSelector(selectBoardDocuments);
  const boardId = Array.isArray(board_id) ? board_id[0] : board_id;
  const boardDocumentsStatus = useAppSelector(selectBoardDocumentsStatus);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // null = All
  const [uploaderInfo, setUploaderInfo] = useState<{
    lastName: string;
    firstName: string;
    profilePicUrl?: string;
  } | null>(null);
  // We'll use the document action states from the hook instead of defining them here

  // Function to refresh board documents
  const handleDocumentsRefresh = async () => {
    if (boardId) {
      try {
        await dispatch(
          getDocumentsPerBoard({
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
    if (!uploaderInfo) {
      if (user.firstName && user.lastName) {
        setUploaderInfo({
          lastName: user.lastName,
          firstName: user.firstName,
          profilePicUrl: user.profilePicUrl,
        });
      } else {
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

  // Fetch board documents and user documents on mount
  useEffect(() => {
    if (boardId) {
      dispatch(
        getDocumentsPerBoard({
          boardId: boardId,
        })
      );
      dispatch(getDocumentsPerUser());
    }
  }, [dispatch, boardId]);

  // Use the shared document actions hook - MUST be called before any conditional returns
  const {
    documentToEdit,
    isEditModalOpen,
    setDocumentToEdit,
    setIsEditModalOpen,
    handleEditDocument,
    handleDeleteDocument,
    handleDocumentUpdate,
    handleDownloadDocument,
  } = useDocumentActions(
    boardDocuments,
    handleDocumentsRefresh,
    true
  ); // Enable optimistic updates

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

  // Count documents per category
  const categoryCounts: CategoryCount[] = [];
  const categoryMap: Record<string, number> = {};
  boardDocuments.forEach((doc) => {
    const cat = doc.category || 'Uncategorized';
    if (categoryMap[cat]) {
      categoryMap[cat] += 1;
    } else {
      categoryMap[cat] = 1;
    }
  });
  for (const [category, count] of Object.entries(categoryMap)) {
    categoryCounts.push({ category, count });
  }

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

  // Filtered documents based on selected category
  const filteredDocuments = selectedCategory
    ? enhancedDocuments.filter(
        (doc) => (doc.category || 'Uncategorized') === selectedCategory
      )
    : enhancedDocuments;

  if (boardDocumentsStatus === 'loading') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header with actions */}
      <div className="w-full flex justify-end items-center p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-900">
        <div className="flex gap-4">
          {/* <LinkDocument
            searchItem="Documents"
            docs={availableDocuments}
            initialString="+ Link Document"
            onDocumentSelect={handleDocumentSelect}
          /> */}
          <UploadDocumentModal
            onUploadSuccess={handleDocumentsRefresh}
            defaultJobId={boardId} // Pass the board ID to fix upload issues
          />
        </div>
      </div>

      {/* Filter Bar using the shared component */}
      <DocumentFilterBar
        categoryCounts={categoryCounts}
        allCount={boardDocuments.length}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <DocumentGrid
        onEdit={handleEditDocument}
        documents={filteredDocuments}
        onDelete={handleDeleteDocument}
        onDownload={handleDownloadDocument}
        emptyMessage="No documents found for this category"
      />
      {/* Edit Document Modal */}
      {isEditModalOpen && documentToEdit && (
        <EditDocumentModal
          isOpen={isEditModalOpen}
          documentToEdit={documentToEdit}
          onEditSuccess={async (updatedDocument) => {
            setIsEditModalOpen(false);
            setDocumentToEdit(null);
            if (updatedDocument) {
              await handleDocumentUpdate(updatedDocument);
            }
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
