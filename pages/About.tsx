import React from 'react';
import { Helmet } from 'react-helmet-async';
import AboutRevealSection from '../components/AboutRevealSection';

const About: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>About Us | The 404 Society</title>
                <meta name="description" content="Learn about The 404 Society's mission, vision, and how we are empowering student developers at PESITM Shivamogga." />
            </Helmet>
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
        </>
    );
};

export default About;
