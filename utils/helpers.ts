export const cleanupAfterContact = () => {
  // Contact personal info
  localStorage.removeItem('comment');
  localStorage.removeItem('lastName');
  localStorage.removeItem('jobTitle');
  localStorage.removeItem('location');
  localStorage.removeItem('photoUrl');
  localStorage.removeItem('firstName');
  localStorage.removeItem('contactId');

  // Contact communication
  localStorage.removeItem('phones');
  localStorage.removeItem('emails');

  // Social media URLs
  localStorage.removeItem('githubUrl');
  localStorage.removeItem('twitterUrl');
  localStorage.removeItem('linkedinUrl');
  localStorage.removeItem('facebookUrl');

  // Company connections
  localStorage.removeItem('companies');
  localStorage.removeItem('companyIds');
  localStorage.removeItem('jobsConnectedToContact');
};

export const cleanupAfterJobPost = () => {
  localStorage.removeItem('company');
  localStorage.removeItem('jobTitle');
  localStorage.removeItem('companyId');
  localStorage.removeItem('chosenColumn');
  localStorage.removeItem('jobLocation');
  localStorage.removeItem('jobDescription');
  localStorage.removeItem('jobPostUrl');
  localStorage.removeItem('jobSalary');
  localStorage.removeItem('boardValueChanged');
};

export const cleanupAfterLogout = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  cleanupAfterContact();
  cleanupAfterJobPost();

  // Clear authentication tokens
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userDeletionContext');

  // Clear Redux Persist (if used)
  localStorage.removeItem('persist:root');

  // Clear application state
  localStorage.removeItem('columnId');
  localStorage.removeItem('chosenBoard');
  localStorage.removeItem('chosenBoardId');
  localStorage.removeItem('currentJobPost');
  localStorage.removeItem('firstColumnOfTheBoard');

  // Clear sessionStorage (defensive)
  try {
    sessionStorage.clear();
  } catch {}

  // Drop default auth header on API client (if set globally)
  try {
    const client = require('@/api/client').default;
    const headers = client?.defaults?.headers as any;
    if (headers) {
      // Axios keeps defaults under `common` and per-method buckets
      if (headers.common) delete headers.common.Authorization;
      delete headers.Authorization;
      ['get', 'post', 'put', 'patch', 'delete'].forEach((m) => {
        if (headers[m]) delete headers[m].Authorization;
      });
    }
  } catch {}

  // Clear any debug data
  localStorage.removeItem('debug');
};

// ⚠️ SECURITY WARNING: This function decodes JWT without signature verification
// Used for UX purposes only (showing countdown timers, logout warnings)
// Never use for security decisions - server must verify signatures
export const getTokenExpiration = (token: string): number | null => {
  try {
    // ⚠️ UX ONLY: Decoding without verification - can be forged!
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

/**
 * Calculate time ago from timestamp
 * @param item - Object with updatedAt or createdAt timestamp
 * @returns Formatted time string like "2 hours ago" or "3 days ago"
 */
export const getTimeAgo = (item: {
  updatedAt?: string;
  createdAt?: string;
}) => {
  // Use updatedAt if available, otherwise fall back to createdAt, then to fallback text
  const timestamp = item.updatedAt || item.createdAt;
  if (!timestamp) return 'Recently';

  try {
    const now = Date.now();
    const updatedAt = new Date(timestamp);

    // Check if date is valid
    if (isNaN(updatedAt.getTime())) return 'Recently';

    const diffInSeconds = Math.floor((now - updatedAt.getTime()) / 1000);

    const formatTimeUnit = (value: number, unit: string) => {
      return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
    };

    if (diffInSeconds < 60) {
      return diffInSeconds <= 0
        ? 'Just now'
        : formatTimeUnit(diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return formatTimeUnit(diffInMinutes, 'minute');
    } else if (diffInSeconds < 86400) {
      const diffInHours = Math.floor(diffInSeconds / 3600);
      return formatTimeUnit(diffInHours, 'hour');
    } else {
      const diffInDays = Math.floor(diffInSeconds / 86400);
      return formatTimeUnit(diffInDays, 'day');
    }
  } catch (error) {
    console.warn('Error parsing timestamp:', error);
    return 'Recently';
  }
};
