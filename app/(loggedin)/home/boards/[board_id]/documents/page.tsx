import { Button } from '@/components/ui/button';

const BoardDocuments = () => {
  return (
    <>
      <div className="w-3/4 mx-auto mt-6">
        <div className="w-full flex justify-between items-center pb-4 border-b">
          <div className="text-blue-500 font-medium bg-blue-200/40 rounded-md px-2">
            All
          </div>
          <div className="flex gap-4">
            <Button
              variant="outlineNew"
              className="hover:shadow-md transition-all duration-150"
            >
              + Link Document
            </Button>
            <Button variant="normal">+ Upload</Button>
          </div>
        </div>
        <p className="text-center text-xl text-slate-400 mt-48">
          You have not created any documents yet
        </p>
      </div>
    </>
  );
};

export default BoardDocuments;
