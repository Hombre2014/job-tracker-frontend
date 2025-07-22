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
  const [documentToEdit, setDocumentToEdit] = useState<JobDocument | null>(
    null
  );

  const handleEditDocument = (document: JobDocument) => {
    // Find the original document with the full title
    const originalDocument = documents.find((doc) => doc.id === document.id);
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

      // Try to open in new tab first
      const newTab = window.open('', '_blank', 'noopener,noreferrer');

      if (!newTab) {
        // Popup blocked - use download link as fallback
        const link = document.createElement('a');
        link.href = jobDocument.url;
        link.download = jobDocument.title || 'document';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Document download initiated');
        return;
      }

      // Set the URL after successful popup creation
      newTab.location.href = jobDocument.url;

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
    documentToEdit,
    isEditModalOpen,
    setDocumentToEdit,
    handleEditDocument,
    setIsEditModalOpen,
    handleDeleteDocument,
    handleDownloadDocument,
  };
};

export default useDocumentActions;
