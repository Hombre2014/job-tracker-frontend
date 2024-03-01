'use client';

import ContentSection from '@/components/LandingPage/ContentSection';
import Footer from '@/components/LandingPage/Footer';
import HeroSection from '@/components/LandingPage/HeroSection';
import Navbar from '@/components/LandingPage/Navbar';
import { Fragment } from 'react';

const Home = () => {
  return (
    <Fragment>
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
    </Fragment>
  );
};

export default Home;
