'use client';

import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import { getUser } from '@/redux/user/userThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { TITLE_MAX_LENGTH } from '@/data/constants';
import useDocumentActions from '@/hooks/useDocumentActions';
import DocumentGrid from '@/components/Documents/DocumentGrid';
import EditDocumentModal from '@/components/Forms/AddDocument/EditDocumentModal';
import DocumentFilterBar, { CategoryCount } from '@/components/Documents/DocumentFilterBar';
import {
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
  const accessToken = (() => {
    try {
      return localStorage.getItem('accessToken');
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
      return null;
    }
  })();
  const userDocuments = useAppSelector(selectUserDocuments);
  const userDocumentsStatus = useAppSelector(selectUserDocumentsStatus);
  const [uploaderInfo, setUploaderInfo] = useState<{
    lastName: string;
    firstName: string;
    profilePicUrl?: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // null = All
  // We'll use the document action states from the hook instead of defining them here

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
  
  // Use the shared document actions hook
  const {
    isEditModalOpen,
    documentToEdit,
    handleEditDocument,
    handleDeleteDocument,
    handleDownloadDocument,
    setIsEditModalOpen,
    setDocumentToEdit
  } = useDocumentActions(userDocuments, accessToken, handleDocumentsRefresh);

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

  // Extract unique document categories and their counts from userDocuments
  type CategoryCount = {
    category: string;
    count: number;
  };

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

  // Document action handlers are now provided by the useDocumentActions hook

  // handleDeleteDocument is now provided by the useDocumentActions hook

  // handleDownloadDocument is now provided by the useDocumentActions hook

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
        allCount={userDocuments.length}
        categoryCounts={categoryCounts}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {userDocuments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-xl text-slate-400">
            You have not created any documents yet
          </p>
        </div>
      ) : (
        <DocumentGrid
          documents={filteredDocuments}
          onEdit={handleEditDocument}
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
          onEditSuccess={async () => {
            // Close the modal first
            setIsEditModalOpen(false);
            setDocumentToEdit(null);
            
            // Then refresh the documents
            await handleDocumentsRefresh();
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
