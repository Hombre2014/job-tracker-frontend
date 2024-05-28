import { RiSearchLine } from 'react-icons/ri';

const SearchBox = () => {
  return (
    <div className="flex items-center relative">
      <RiSearchLine className="absolute left-1" />
      <div className="w-40">
        <input
          type="text"
          placeholder="Filter"
          className="rounded-md border border-slate-500 pl-6 w-20 h-9 border-dashed transition-all duration-300 ease-in-out focus:w-40 focus:pl-8 focus:outline-none focus:border-blue-600 focus:border-solid"
        />
      </div>
    </div>
  );
};

export default SearchBox;
