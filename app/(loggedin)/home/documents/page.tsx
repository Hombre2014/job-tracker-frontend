'use client';

import { useEffect, useState } from 'react';

import { getUser } from '@/redux/user/userThunk';
import { TITLE_MAX_LENGTH } from '@/data/constants';
import useDocumentActions from '@/hooks/useDocumentActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import DocumentGrid from '@/components/Documents/DocumentGrid';
import { getDocumentsPerUser } from '@/redux/documents/documentsThunk';
import DocumentFilterBar from '@/components/Documents/DocumentFilterBar';
import EditDocumentModal from '@/components/Forms/AddDocument/EditDocumentModal';
import {
  selectUserDocuments,
  selectUserDocumentsStatus,
} from '@/redux/documents/documentsSlice';

const UserDocuments = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const userDocuments = useAppSelector(selectUserDocuments);
  const userDocumentsStatus = useAppSelector(selectUserDocumentsStatus);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // null = All
  const [uploaderInfo, setUploaderInfo] = useState<{
    lastName: string;
    firstName: string;
    profilePicUrl?: string;
  } | null>(null);
  const accessToken = (() => {
    try {
      return localStorage.getItem('accessToken');
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
      return null;
    }
  })();

  // Function to refresh user documents
  const handleDocumentsRefresh = async () => {
    if (accessToken) {
      try {
        // Directly dispatch the action without unwrapping to ensure Redux store is updated
        await dispatch(getDocumentsPerUser(accessToken));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    accessToken,
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

  // Count documents per category
  const categoryCounts: CategoryCount[] = [];
  const categoryMap: Record<string, number> = {};
  userDocuments.forEach((doc) => {
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

  // Enhance documents with uploader information and truncated titles for user view
  const enhancedDocuments = userDocuments.map((doc) => {
    // Truncate title to ~20 characters for better layout
    const truncateTitle = (
      title: string,
      maxLength: number = TITLE_MAX_LENGTH
    ) => {
      if (title.length <= maxLength) return title;
      return title.substring(0, maxLength - 3) + '...';
    };

    return {
      ...doc,
      title: truncateTitle(doc.title), // Use truncated title for consistent layout
      uploadedBy: uploaderInfo || undefined,
    };
  });

  // Filtered documents based on selected category
  const filteredDocuments = selectedCategory
    ? enhancedDocuments.filter(
        (doc) => (doc.category || 'Uncategorized') === selectedCategory
      )
    : enhancedDocuments;

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
    userDocuments,
    accessToken,
    handleDocumentsRefresh,
    true
  ); // Enable optimistic updates

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

      {/* Filter Bar using the shared component */}
      <DocumentFilterBar
        categoryCounts={categoryCounts}
        allCount={userDocuments.length}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {userDocuments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-xl text-slate-400">
            You have not created any documents yet
          </p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-xl text-slate-400">
            No documents found for this category
          </p>
        </div>
      ) : (
        <DocumentGrid
          onEdit={handleEditDocument}
          documents={filteredDocuments}
          onDelete={handleDeleteDocument}
          onDownload={handleDownloadDocument}
          emptyMessage="No documents found for this category"
        />
      )}

      {/* Edit Document Modal */}
      {isEditModalOpen && documentToEdit && (
        <EditDocumentModal
          isOpen={isEditModalOpen}
          documentToEdit={documentToEdit}
          onEditSuccess={async (updatedDocument?: JobDocument) => {
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

export default UserDocuments;
