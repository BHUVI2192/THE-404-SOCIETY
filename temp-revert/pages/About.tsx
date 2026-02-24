import React from 'react';
import { ScrollReveal, Section } from '../components/UI';

const About: React.FC = () => {
  return (
    <>
      <Section theme="dark" className="pt-32 pb-20">
        <ScrollReveal>
          <h1 className="text-5xl md:text-7xl font-black mb-8">ABOUT US</h1>
          <p className="text-2xl text-neutral-400 max-w-3xl font-light">
            We are the outliers. The debuggers. The ones who stare at a screen until the solution appears.
          </p>
        </ScrollReveal>
      </Section>

      <Section theme="light">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-4">WHO WE ARE</h2>
              <p className="text-neutral-700 leading-relaxed">
                The 404 Society was born out of a simple observation: computer science curriculums teach theory, but communities build engineers. We are a student-led collective at the intersection of creativity and logic.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h2 className="text-3xl font-bold mb-4">WHY WE EXIST</h2>
              <p className="text-neutral-700 leading-relaxed">
                To fill the gap. To provide a space where it's okay to break things. To create an environment where senior students mentor juniors not because they have to, but because they want to build a stronger culture.
              </p>
            </ScrollReveal>
          </div>
          
          <ScrollReveal delay={0.3} className="bg-black p-1">
             <div className="bg-white h-full w-full flex items-center justify-center border-2 border-black p-8">
                <blockquote className="text-2xl font-bold font-mono text-center">
                  "Move fast and fix things."
                </blockquote>
             </div>
          </ScrollReveal>
        </div>
      </Section>

      <Section theme="dark">
         <ScrollReveal>
            <h2 className="text-3xl font-bold mb-12 text-center">OUR FOCUS AREAS</h2>
         </ScrollReveal>
         <div className="grid md:grid-cols-4 gap-4">
            {['Workshops', 'Hackathons', 'Open Source', 'Career Prep'].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1} className="border border-neutral-800 p-8 hover:bg-neutral-900 transition-colors">
                <h3 className="text-xl font-bold mb-2 text-white">0{idx + 1}</h3>
                <p className="text-lg font-mono text-neutral-400">{item}</p>
              </ScrollReveal>
            ))}
         </div>
      </Section>
    </>
  );
};

export default About;