/**
 * Search and filter utilities for job applications
 */

/**
 * Filters job applications based on search query
 * Searches in job title and company name with case-insensitive OR logic
 *
 * @param jobApplications - Array of job applications to filter
 * @param query - Search query string (space-separated keywords)
 * @returns Filtered array of job applications
 */
export const filterJobApplications = (
  jobApplications: JobApplication[],
  query: string
): JobApplication[] => {
  // Early returns for edge cases
  if (!query || query.trim().length < 2 || !Array.isArray(jobApplications)) {
    return jobApplications;
  }

  // Split query into keywords and clean them with smart prioritization
  let keywords = query
    .toLowerCase()
    .trim()
    .split(/\s+/) // Split on any whitespace
    .filter((keyword) => keyword.length > 0);

  // Smart keyword prioritization for better search relevance
  if (keywords.length > 10) {
    keywords = keywords
      .map((keyword, index) => ({ keyword, originalIndex: index }))
      .sort((a, b) => {
        // Priority 1: Longer keywords (more specific)
        if (b.keyword.length !== a.keyword.length) {
          return b.keyword.length - a.keyword.length;
        }
        // Priority 2: Original order (user intent)
        return a.originalIndex - b.originalIndex;
      })
      .slice(0, 10) // Performance limit: max 10 keywords
      .map((item) => item.keyword);
  }

  if (keywords.length === 0) {
    return jobApplications;
  }

  return jobApplications.filter((job) => {
    // Safely extract searchable text with null checks
    const title = job?.title?.toLowerCase() || '';
    const companyName = job?.company?.name?.toLowerCase() || '';

    // Skip jobs with missing essential data
    if (!title && !companyName) {
      return false;
    }

    // Performance optimization: avoid string concatenation for single-keyword searches
    if (keywords.length === 1) {
      const keyword = keywords[0];
      return title.includes(keyword) || companyName.includes(keyword);
    }

    // Combine searchable text for multi-keyword searches
    const searchableText = `${title} ${companyName}`;

    // OR logic: job matches if ANY keyword is found
    return keywords.some((keyword) => searchableText.includes(keyword));
  });
};

/**
 * Filters board columns' job applications based on search query
 * Maintains column structure while filtering job applications within each column
 *
 * @param columns - Array of board columns
 * @param query - Search query string
 * @returns Columns with filtered job applications
 */
export const filterBoardColumns = (
  columns: Column[],
  query: string
): Column[] => {
  if (!query || query.trim().length < 2 || !Array.isArray(columns)) {
    return columns;
  }

  return columns.map((column) => ({
    ...column,
    jobApplications: filterJobApplications(column.jobApplications || [], query),
  }));
};

/**
 * Counts total filtered job applications across all columns
 *
 * @param columns - Array of board columns (potentially filtered)
 * @returns Total count of job applications
 */
export const countFilteredJobs = (columns: Column[]): number => {
  return columns.reduce((total, column) => {
    return total + (column.jobApplications?.length || 0);
  }, 0);
};

/**
 * Gets search result summary
 *
 * @param originalColumns - Original unfiltered columns
 * @param filteredColumns - Filtered columns
 * @param query - Search query
 * @returns Search result summary object
 */
export const getSearchSummary = (
  originalColumns: Column[],
  filteredColumns: Column[],
  query: string
) => {
  const totalJobs = countFilteredJobs(originalColumns);
  const filteredJobs = countFilteredJobs(filteredColumns);
  const isFiltering = query.trim().length >= 2;

  return {
    totalJobs,
    filteredJobs,
    isFiltering,
    hasResults: filteredJobs > 0,
    keywords: query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((k) => k.length > 0),
  };
};

/**
 * Performance-aware search function for development
 */
export const searchWithPerformanceTracking = (
  columns: Column[],
  query: string
): {
  filteredColumns: Column[];
  performance: { duration: number; jobCount: number };
} => {
  const now =
    typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? () => performance.now()
      : () => Date.now();
  const startTime = now();
  const jobCount = countFilteredJobs(columns);

  const filteredColumns = filterBoardColumns(columns, query);

  const duration = now() - startTime;

  // Log warning for slow searches in development
  if (process.env.NODE_ENV === 'development' && duration > 50) {
    console.warn(
      `Search took ${duration.toFixed(
        2
      )}ms for ${jobCount} jobs. Consider optimizing for better performance.`
    );
  }

  return {
    filteredColumns,
    performance: { duration, jobCount },
  };
};
