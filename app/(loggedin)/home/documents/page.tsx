'use client';

import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import { getUser } from '@/redux/user/userThunk';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { TITLE_MAX_LENGTH, FIXED_GRID_STYLES } from '@/data/constants';
import DocumentCard from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/DocumentCard';
import EditDocumentModal from '@/components/Forms/AddDocument/EditDocumentModal';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<JobDocument | null>(
    null
  );

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

  const handleEditDocument = (document: JobDocument) => {
    // Find the original document with the full title from userDocuments
    const originalDocument = userDocuments.find(doc => doc.id === document.id);
    // Use the original document if found, otherwise use the provided document
    setDocumentToEdit(originalDocument || document);
    setIsEditModalOpen(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      // For user documents, always delete the document entirely from the database
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

      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        // Fallback: Create a download link for popup blocker case
        const link = document.createElement('a');
        link.href = jobDocument.url;
        link.download = jobDocument.title || 'document';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Document download initiated');
        return;
      }

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

      {/* Filter Bar - above the cards, full width, white bg */}
      <div className="w-full bg-white pt-6 pb-2 px-6 border-b">
        <div className="flex items-center gap-2">
          {/* All filter */}
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-lg cursor-pointer font-medium text-sm transition ${
              selectedCategory === null
                ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-300'
                : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
            }`}
            style={{ minWidth: 48 }}
            onClick={() => setSelectedCategory(null)}
            tabIndex={0}
            role="button"
            aria-pressed={selectedCategory === null}
          >
            <span>All</span>
            <span className="ml-1 px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-semibold text-xs">
              {userDocuments.length}
            </span>
          </div>
          {/* Category filters */}
          {categoryCounts.map(({ category, count }) => {
            // Color mapping for categories
            const colorMap: Record<string, string> = {
              Resume: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
              'Cover Letter': 'bg-green-100 text-green-700 hover:bg-green-200',
              'Writing Sample':
                'bg-orange-100 text-orange-700 hover:bg-orange-200',
              Portfolio: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
              Recommendation: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
              'Job Post': 'bg-lime-100 text-lime-700 hover:bg-lime-200',
              'Offer Letter': 'bg-amber-300 text-amber-800 hover:bg-amber-400',
              Certification: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
              Other: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
              Transcript: 'bg-red-100 text-red-700 hover:bg-red-200',
              Uncategorized: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            };
            const selectedColorMap: Record<string, string> = {
              Resume: 'bg-blue-100 text-blue-700 ring-2 ring-blue-300',
              'Cover Letter':
                'bg-green-100 text-green-700 ring-2 ring-green-300',
              'Writing Sample':
                'bg-orange-100 text-orange-700 ring-2 ring-orange-300',
              Portfolio: 'bg-purple-100 text-purple-700 ring-2 ring-purple-300',
              Recommendation: 'bg-pink-100 text-pink-700 ring-2 ring-pink-300',
              'Job Post': 'bg-lime-100 text-lime-700 ring-2 ring-lime-300',
              'Offer Letter':
                'bg-amber-300 text-amber-800 ring-2 ring-amber-500',
              Certification: 'bg-teal-100 text-teal-700 ring-2 ring-teal-300',
              Other: 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300',
              Transcript: 'bg-red-100 text-red-700 ring-2 ring-red-300',
              Uncategorized: 'bg-gray-100 text-gray-700 ring-2 ring-gray-300',
            };
            const colorClass =
              selectedCategory === category
                ? selectedColorMap[category] ||
                  'bg-gray-100 text-gray-700 ring-2 ring-gray-300'
                : colorMap[category] ||
                  'bg-gray-100 text-gray-700 hover:bg-gray-200';
            return (
              <div
                tabIndex={0}
                role="button"
                key={category}
                style={{ minWidth: 48 }}
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg cursor-pointer font-medium text-sm transition ${colorClass}`}
              >
                <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-semibold text-xs">
                  {count}
                </span>
                <span>{category}</span>
              </div>
            );
          })}
        </div>
      </div>

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
        <div className="flex-1 overflow-y-auto p-6">
          <div style={FIXED_GRID_STYLES}>
            {filteredDocuments.map((document) => (
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
            // Close the modal first
            setIsEditModalOpen(false);
            setDocumentToEdit(null);
            
            // Then refresh the documents
            if (accessToken) {
              try {
                // Directly dispatch the action to ensure it updates the Redux store
                await dispatch(getDocumentsPerUser(accessToken));
              } catch (error) {
                console.error('Failed to refresh documents after edit:', error);
              }
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
