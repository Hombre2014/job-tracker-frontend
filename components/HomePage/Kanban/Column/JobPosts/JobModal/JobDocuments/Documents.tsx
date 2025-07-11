import { useParams } from 'next/navigation';

import documents from '@/data/documents';
import UploadDocumentModal from '@/components/Forms/AddDocument/UploadDocumentModal';
import { LinkDocument } from '@/components/HomePage/HomeNavbar/LinkDocument';

const Documents = () => {
  const { job_id } = useParams();

  return (
    <>
      <div className="w-full mx-auto mt-6">
        <div className="w-full flex justify-between items-center pb-4 border-b">
          <div className="text-blue-500 font-medium bg-blue-200/40 rounded-md px-2">
            All
          </div>
          <div className="flex gap-4">
            <LinkDocument
              docs={documents}
              searchItem="Documents"
              initialString="+ Link Document"
            />
            <UploadDocumentModal defaultJobId={job_id as string} />
          </div>
        </div>
        <p className="text-center text-xl text-slate-400 mt-48">
          You have not created any documents yet
        </p>
      </div>
    </>
  );
};

export default Documents;
