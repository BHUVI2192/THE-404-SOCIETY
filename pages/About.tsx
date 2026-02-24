import React from 'react';
import AboutRevealSection from '../components/AboutRevealSection';

const About: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* 
         The AboutRevealSection handles the Hero + Reveal Animation.
         It has its own internal scrolling logic (Wheel Hijack or whatever was last implemented).
       */}
            <AboutRevealSection />

            {/* 
         You can add more sections below if needed, 
         but currently AboutRevealSection handles the main "About" experience 
         and exits to the footer.
       */}
        </div>
    );
};

export default About;
