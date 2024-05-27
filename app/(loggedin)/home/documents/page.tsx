import { Button } from '@/components/ui/button';

const UserDocuments = () => {
  return (
    <>
      <div className="w-full py-2 border-b flex justify-center items-center">
        <div className="h-9 flex items-center">
          <h1 className="font-semibold text-center">Documents</h1>
        </div>
      </div>
      <div className="w-3/4 mx-auto mt-8">
        <div className="w-full flex justify-between items-center pb-4 border-b">
          <div className="text-blue-500 font-medium bg-blue-200/40 rounded-md px-2">
            All
          </div>
          <Button variant="normal">+ New Document</Button>
        </div>
        <p className="text-center text-xl text-slate-400 mt-48">
          You have not created any documents yet
        </p>
      </div>
    </>
  );
};

export default UserDocuments;
