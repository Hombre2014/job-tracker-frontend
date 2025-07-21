import React from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { DocumentCategory } from '@/enums';
import { useAppDispatch } from '@/redux/hooks';
import { updateDocument } from '@/redux/documents/documentsThunk';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

  // Local state for fields

  const [title, setTitle] = useState(documentToEdit.title || '');
  const [category, setCategory] = useState<DocumentCategory | ''>(
    (Object.values(DocumentCategory).includes(
      documentToEdit.category as DocumentCategory
    )
      ? documentToEdit.category
      : '') as DocumentCategory | ''
  );
  const [description, setDescription] = useState(
    documentToEdit.description || ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = async () => {
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }
    if (!title.trim() || !category) {
      toast.error('Title and category are required.');
      return;
    }
    setIsSaving(true);
    try {
      await dispatch(
        updateDocument({
          accessToken,
          title: title.trim(),
          category,
          documentId: documentToEdit.id,
          description,
        })
      ).unwrap();
      toast.success('Document updated successfully!');
      onEditSuccess();
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AlertDialogModal
      open={isOpen}
      buttonCancel="Cancel"
      onOpenChange={onClose}
      dialogTitle="Edit Document"
      actionFunction={handleEdit}
      buttonConfirm={isSaving ? 'Saving...' : 'Save Changes'}
      contentWidth="!max-w-[910px] !min-h-[840px] !max-h-[840px]"
      isFormValid={!!title.trim() && !!category && !isSaving}
    >
      <div className="px-2 pt-2 pb-0">
        {/* Title Field */}
        <div className="mb-4 w-1/2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-left">Title</label>
            <span className="text-xs text-gray-500">Required</span>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Category Field */}
        <div className="mb-4 w-1/2">
          <div className="flex justify-between items-center mb-2">
            <Label
              htmlFor="category"
              className="block text-sm font-medium text-left"
            >
              Category
            </Label>
            <span className="text-xs text-gray-500">Required</span>
          </div>
          <Select
            value={category}
            onValueChange={(value: string) =>
              setCategory(value as DocumentCategory)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(DocumentCategory).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Description Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-left mb-2">
            Description
          </label>
          <textarea
            rows={12}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Document Description"
            className="w-full p-2 border rounded"
            style={{ resize: 'vertical', overflow: 'auto' }}
          />
        </div>
      </div>
    </AlertDialogModal>
  );
};

export default EditDocumentModal;
