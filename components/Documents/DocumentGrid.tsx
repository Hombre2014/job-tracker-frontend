import { FIXED_GRID_STYLES } from '@/data/constants';
import DocumentCard from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobDocuments/DocumentCard';

export const DocumentGrid = ({
  onEdit,
  onDelete,
  documents,
  onDownload,
  emptyMessage = 'No documents found for this category',
}: DocumentGridProps) => {
  if (documents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-center text-xl text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div style={FIXED_GRID_STYLES}>
        {documents.map((document) => (
          <DocumentCard
            onEdit={onEdit}
            key={document.id}
            document={document}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentGrid;
