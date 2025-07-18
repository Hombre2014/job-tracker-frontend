import React from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Modal from '@/components/Misc/Modal';
import { EditDocumentSchema } from '@/schemas';
import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { updateDocument } from '@/redux/documents/documentsThunk';

interface EditDocumentsProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  documentToEdit: JobDocument;
}

const EditDocumentModal = ({
  isOpen,
  onClose,
  onEditSuccess,
  documentToEdit,
}: EditDocumentsProps) => {
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');

  const form = useForm({
    resolver: zodResolver(EditDocumentSchema),
    defaultValues: {
      title: documentToEdit.title || '',
      category: documentToEdit.category || '',
      description: documentToEdit.description || '',
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      // Use the title exactly as entered by the user
      const newTitle = data.title;

      await dispatch(
        updateDocument({
          accessToken,
          title: newTitle,
          category: data.category,
          documentId: documentToEdit.id,
          description: data.description,
        })
      ).unwrap();

      toast.success('Document updated successfully!');
      onEditSuccess();
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal stylings="sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-[960px] bg-white">
      <div className="min-h-[840px]">
        <div className="flex justify-between items-center p-4 border-b w-full mb-8">
          <h1 className="text-xl font-semibold mb-4">Edit Document</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(documentToEdit.url, '_blank')}
            >
              Download
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
        <div className="px-4">
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                {...form.register('title')}
                placeholder="Document Title"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                {...form.register('category')}
                placeholder="Document Category"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                {...form.register('description')}
                placeholder="Document Description"
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditDocumentModal;
