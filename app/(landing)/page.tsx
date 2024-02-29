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
      <ContentSection />
      <Footer />
    </Fragment>
  );
};

export default Home;
