'use client';

import Footer from '@/components/LandingPage/Footer';
import Navbar from '@/components/LandingPage/Navbar';
import HeroSection from '@/components/LandingPage/HeroSection';
import ContentSection from '@/components/LandingPage/ContentSection';

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ContentSection
        id="applications"
        name="Applications"
        description="Record and track your job applications."
      />
      <ContentSection
        id="documents"
        name="Documents"
        description="Upload your resumes and cover letters."
      />
      <ContentSection
        id="contacts"
        name="Contacts"
        description="Add your job search contacts."
      />
      <Footer />
    </>
  );
};

export default Home;
