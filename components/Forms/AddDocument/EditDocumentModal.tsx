import React from 'react';
import { toast } from 'react-toastify';

import { DocumentCategory } from '@/enums';
import { Label } from '@/components/ui/label';
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

const EditDocumentModal = ({
  isOpen,
  onClose,
  onEditSuccess,
  documentToEdit,
}: EditDocumentsProps) => {
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = React.useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [title, setTitle] = React.useState(documentToEdit.title || '');
  const [description, setDescription] = React.useState(
    documentToEdit.description || ''
  );
  const [category, setCategory] = React.useState<DocumentCategory | ''>(
    (Object.values(DocumentCategory).includes(
      documentToEdit.category as DocumentCategory
    )
      ? documentToEdit.category
      : '') as DocumentCategory | ''
  );

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
          category,
          description,
          accessToken,
          title: title.trim(),
          documentId: documentToEdit.id,
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
      isFormValid={!!title.trim() && !!category && !isSaving}
      contentWidth="!max-w-[910px] !min-h-[880px] !max-h-[880px]"
    >
      <div className="px-2 pt-2 pb-0">
        {/* Title Field */}
        <div className="mb-4 w-full">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-left">Title</label>
            <span className="text-xs text-gray-500">Required</span>
          </div>
          <input
            value={title}
            placeholder="Document Title"
            className="w-full p-2 border rounded"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* Category Field */}
        <div className="mb-4 w-full">
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
            placeholder="Document Description"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded resize-y overflow-auto"
          />
        </div>
      </div>
    </AlertDialogModal>
  );
};

export default EditDocumentModal;
