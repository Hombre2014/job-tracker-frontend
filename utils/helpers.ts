export const cleanupAfterContact = () => {
  localStorage.removeItem('phones');
  localStorage.removeItem('emails');
  localStorage.removeItem('comment');
  localStorage.removeItem('jobTitle');
  localStorage.removeItem('lastName');
  localStorage.removeItem('location');
  localStorage.removeItem('photoUrl');
  localStorage.removeItem('companies');
  localStorage.removeItem('firstName');
  localStorage.removeItem('contactId');
  localStorage.removeItem('githubUrl');
  localStorage.removeItem('companyIds');
  localStorage.removeItem('twitterUrl');
  localStorage.removeItem('companyIds');
  localStorage.removeItem('linkedinUrl');
  localStorage.removeItem('facebookUrl');
  localStorage.removeItem('jobsConnectedToContact');
};

export const cleanupAfterJobPost = () => {
  localStorage.removeItem('company');
  localStorage.removeItem('jobTitle');
  localStorage.removeItem('companyId');
  localStorage.removeItem('chosenColumn');
  localStorage.setItem('boardValueChanged', 'false');
};

export const cleanupAfterLogout = () => {
  cleanupAfterContact();
  cleanupAfterJobPost();
  localStorage.removeItem('user');
  localStorage.removeItem('columnId');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('chosenBoard');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentJobPost');
  localStorage.removeItem('boardValueChanged');
  localStorage.removeItem('firstColumnOfTheBoard');
};

export const getTokenExpiration = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};
