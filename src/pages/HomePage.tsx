import React from 'react';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';

interface HomePageProps {
  onGetStarted: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div>
      <Hero onGetStarted={onGetStarted} />
      <Features />
    </div>
  );
};
