// CreateContactForm.tsx useEffect, which solves the issue with only deault company being selected when the form is loaded.

// Add this useEffect near the top of your component, after the state declarations
useEffect(() => {
  // Check if we're in edit mode (contactId exists in localStorage)
  const contactId = localStorage.getItem('contactId');
  if (contactId) {
    console.log('In edit mode, loading data from localStorage');

    // Load companies and companyIds from localStorage
    const storedCompanies = localStorage.getItem('companies');
    const storedCompanyIds = localStorage.getItem('companyIds');

    console.log('Stored companies:', storedCompanies);
    console.log('Stored companyIds:', storedCompanyIds);

    if (storedCompanies) {
      try {
        const parsedCompanies = JSON.parse(storedCompanies);
        console.log('Parsed companies:', parsedCompanies);
        setCompanies(parsedCompanies);
      } catch (e) {
        console.error('Error parsing companies from localStorage:', e);
      }
    }

    if (storedCompanyIds) {
      try {
        const parsedCompanyIds = JSON.parse(storedCompanyIds);
        console.log('Parsed companyIds:', parsedCompanyIds);
        setCompanyIds(parsedCompanyIds);
      } catch (e) {
        console.error('Error parsing companyIds from localStorage:', e);
      }
    }

    // Load other fields as needed
    setFirstName(localStorage.getItem('firstName') || '');
    setLastName(localStorage.getItem('lastName') || '');
    setJobTitle(localStorage.getItem('jobTitle') || '');
    setLocation(localStorage.getItem('location') || '');
    setComment(localStorage.getItem('comment') || '');

    // Load photo URL if available
    const storedPhotoUrl = localStorage.getItem('photoUrl');
    if (storedPhotoUrl && storedPhotoUrl !== 'null') {
      setPhotoUrl(storedPhotoUrl);
    }

    // Load social media links
    setGithubUrl(localStorage.getItem('githubUrl') || '');
    setTwitterUrl(localStorage.getItem('twitterUrl') || '');
    setLinkedinUrl(localStorage.getItem('linkedinUrl') || '');
    setFacebookUrl(localStorage.getItem('facebookUrl') || '');

    // Load emails and phones if needed
    // ... (similar code for emails and phones)
  }
}, []); // Empty dependency array means this runs once when component mounts
