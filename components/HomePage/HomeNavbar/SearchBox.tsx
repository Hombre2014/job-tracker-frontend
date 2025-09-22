import { useEffect, useState, useRef } from 'react';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSearchQuery, clearSearch } from '@/redux/search/searchSlice';

const SearchBox = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, isActive } = useAppSelector((state) => state.search);
  const [localQuery, setLocalQuery] = useState(query);

  // Global keyboard shortcut (Ctrl/Cmd + K to focus search)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Debounce search query updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchQuery(localQuery));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localQuery, dispatch]);

  // Sync with Redux state on mount/external changes
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClearSearch();
      e.currentTarget.blur();
    }
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    dispatch(clearSearch());
  };

  return (
    <div className="flex items-center relative">
      <RiSearchLine className="absolute left-1 text-gray-500" />
      <div className="w-40">
        <input
          type="text"
          ref={inputRef}
          value={localQuery}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          placeholder="Filter (2+ chars)"
          className={`rounded-md border pl-6 w-40 h-9 border-dashed transition-all duration-300 ease-in-out focus:w-40 focus:pl-8 focus:outline-none focus:border-solid ${
            isActive
              ? 'border-blue-600 w-40 pl-8 border-solid bg-blue-50 dark:bg-blue-900/20'
              : localQuery.length === 1
              ? 'border-amber-400 w-40 pl-8 border-solid bg-amber-50 dark:bg-amber-900/20'
              : 'border-slate-500 focus:border-blue-600'
          }`}
          maxLength={50}
          title="Press Ctrl+K to focus, Esc to clear"
        />
      </div>
      {(isActive || localQuery.length > 0) && (
        <button
          type="button"
          title="Clear search"
          onClick={handleClearSearch}
          className="absolute right-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <RiCloseLine className="text-gray-500 text-sm" />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
