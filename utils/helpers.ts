export const cleanupAfterContact = () => {
  // Contact personal info
  localStorage.removeItem('firstName');
  localStorage.removeItem('lastName');
  localStorage.removeItem('jobTitle');
  localStorage.removeItem('location');
  localStorage.removeItem('comment');
  localStorage.removeItem('photoUrl');
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
  localStorage.removeItem('boardValueChanged'); // Remove instead of setting to false
};

export const cleanupAfterLogout = () => {
  cleanupAfterContact();
  cleanupAfterJobPost();

  // Clear user data (but not tokens since they're HTTP-only cookies)
  localStorage.removeItem('user');

  // Clear application state
  localStorage.removeItem('columnId');
  localStorage.removeItem('chosenBoard');
  localStorage.removeItem('chosenColumn');
  localStorage.removeItem('currentJobPost');
  localStorage.removeItem('boardValueChanged');
  localStorage.removeItem('firstColumnOfTheBoard');

  // Clear Redux persist data
  localStorage.removeItem('persist:root');

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
