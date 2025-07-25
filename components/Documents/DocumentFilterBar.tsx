import {
  documentColorMap,
  selectedDocumentColorMap,
} from '@/utils/documentColorMaps';

export const DocumentFilterBar = ({
  allCount,
  categoryCounts,
  selectedCategory,
  setSelectedCategory,
}: DocumentFilterBarProps) => {
  return (
    <div className="w-full bg-white pt-6 pb-2 px-6 border-b">
      <div className="flex items-center gap-2">
        {/* All filter */}
        <div
          tabIndex={0}
          role="button"
          onClick={() => setSelectedCategory(null)}
          aria-pressed={selectedCategory === null ? 'true' : 'false'}
          className={`min-w-12 flex items-center gap-1 px-3 py-1 rounded-lg cursor-pointer font-medium text-sm transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-violet-200 text-violet-800'
              : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
          }`}
        >
          <span>All</span>
          <span className="ml-1 px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-semibold text-xs">
            {allCount}
          </span>
        </div>

        {/* Category filters */}
        {categoryCounts.map(({ category, count }) => {
          const colorClass =
            selectedCategory === category
              ? selectedDocumentColorMap[category] ||
                'bg-gray-100 text-gray-700 ring-2 ring-gray-300'
              : documentColorMap[category] ||
                'bg-gray-100 text-gray-700 hover:bg-gray-200';

          return (
            <div
              tabIndex={0}
              role="button"
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category ? 'true' : 'false'}
              className={`min-w-12 flex items-center gap-1 px-3 py-1 rounded-lg cursor-pointer font-medium text-sm transition-all duration-200 ${colorClass}`}
            >
              <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-semibold text-xs">
                {count}
              </span>
              <span>{category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentFilterBar;
