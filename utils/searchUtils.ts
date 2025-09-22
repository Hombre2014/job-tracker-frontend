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
  if (!query || query.trim().length === 0) {
    return jobApplications;
  }

  // Split query into keywords and clean them
  const keywords = query
    .toLowerCase()
    .trim()
    .split(/\s+/) // Split on any whitespace
    .filter(keyword => keyword.length > 0);

  if (keywords.length === 0) {
    return jobApplications;
  }

  return jobApplications.filter(job => {
    const title = job.title?.toLowerCase() || '';
    const companyName = job.company?.name?.toLowerCase() || '';
    
    // Combine searchable text
    const searchableText = `${title} ${companyName}`;

    // OR logic: job matches if ANY keyword is found
    return keywords.some(keyword => 
      searchableText.includes(keyword)
    );
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
  if (!query || query.trim().length === 0) {
    return columns;
  }

  return columns.map(column => ({
    ...column,
    jobApplications: filterJobApplications(column.jobApplications || [], query)
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
  const isFiltering = query.trim().length > 0;

  return {
    totalJobs,
    filteredJobs,
    isFiltering,
    hasResults: filteredJobs > 0,
    keywords: query.toLowerCase().trim().split(/\s+/).filter(k => k.length > 0)
  };
};