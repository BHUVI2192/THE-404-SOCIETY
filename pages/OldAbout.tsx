import React from 'react';
import { Section, Footer } from '../components/UI';
import AboutRevealSection from '../components/AboutRevealSection';

const About: React.FC = () => {
  return (
    <div className="bg-white">
      <AboutRevealSection />
      <Section theme="light" className="py-40">
        <div className="text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-8">Ready?</h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            This is just the beginning.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default About;
