import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/redux/hooks';
import { deleteDocument } from '@/redux/documents/documentsThunk';

export const useDocumentActions = (
  documents: JobDocument[],
  accessToken: string | null,
  refreshDocuments: () => Promise<void>
) => {
  const dispatch = useAppDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<JobDocument | null>(null);

  const handleEditDocument = (document: JobDocument) => {
    // Find the original document with the full title
    const originalDocument = documents.find(doc => doc.id === document.id);
    setDocumentToEdit(originalDocument || document);
    setIsEditModalOpen(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      await dispatch(
        deleteDocument({
          documentId,
          accessToken: accessToken as string,
        })
      ).unwrap();

      toast.success('Document deleted successfully!');
      await refreshDocuments();
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

      // Check tab status
      setTimeout(() => {
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
    } catch (error) {
      console.error('Error opening document:', error);
      toast.error('Failed to open document. Please try again.');
    }
  };

  return {
    isEditModalOpen,
    documentToEdit,
    handleEditDocument,
    handleDeleteDocument,
    handleDownloadDocument,
    setIsEditModalOpen,
    setDocumentToEdit,
  };
};

export default useDocumentActions;