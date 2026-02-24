
import React from 'react';
import { Section, Button, GlitchText, EventCard, ScrollReveal } from '../components/UI';
import { ArrowRight, Code, Cpu, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { EVENTS } from '../constants';

const Home: React.FC = () => {
  // Get the first 3 upcoming events for the highlight section
  const upcomingHighlights = EVENTS.filter(e => e.type === 'upcoming').slice(0, 3);

  return (
    <>
      {/* HERO SECTION */}
      <Section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden" theme="dark">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 border border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 border border-white/10 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-dashed border-white/5 rounded-full"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="mb-6 inline-block">
              <span className="px-3 py-1 border border-white/30 rounded-full text-xs font-mono uppercase tracking-widest text-neutral-400">Est. 2025</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
              WE ARE <br className="hidden md:block" />
              <GlitchText text="THE 404 SOCIETY" />
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 mb-10 max-w-2xl mx-auto font-light">
              We build. We break. We fix. <br/>
              A student-driven community defining the future of tech.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <NavLink to="/community">
                <Button variant="primary">Join the Community</Button>
              </NavLink>
              <NavLink to="/events">
                <Button variant="outline">View Upcoming Events</Button>
              </NavLink>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* ABOUT PREVIEW */}
      <Section theme="light">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <ScrollReveal>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">NOT JUST AN ERROR CODE.</h2>
              <p className="text-lg text-neutral-600 mb-6">
                The 404 Society is a platform for students to learn by doing. We bridge the gap between academic theory and real-world engineering.
              </p>
              <ul className="space-y-4 mb-8">
                 <li className="flex items-center gap-4">
                   <div className="p-2 bg-black text-white"><Code size={20} /></div>
                   <span className="font-bold">Full-Stack Development</span>
                 </li>
                 <li className="flex items-center gap-4">
                   <div className="p-2 bg-black text-white"><Cpu size={20} /></div>
                   <span className="font-bold">AI & Machine Learning</span>
                 </li>
                 <li className="flex items-center gap-4">
                   <div className="p-2 bg-black text-white"><Users size={20} /></div>
                   <span className="font-bold">Peer-to-Peer Learning</span>
                 </li>
              </ul>
               <NavLink to="/about">
                <Button variant="secondary" className="border-black">More About Us</Button>
               </NavLink>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.2} className="relative h-96 bg-neutral-100 border-2 border-black p-4 grayscale">
             {/* Placeholder for About Image */}
             <img src="https://picsum.photos/600/600" alt="Community working together" className="w-full h-full object-cover border border-black" />
          </ScrollReveal>
        </div>
      </Section>

      {/* VISION & MISSION */}
      <Section theme="dark" className="border-t border-neutral-900">
        <div className="grid md:grid-cols-2 gap-12 text-center md:text-left">
           <ScrollReveal className="p-8 border border-neutral-800 bg-neutral-900/30">
              <h3 className="text-2xl font-mono font-bold mb-4 text-white">:: VISION</h3>
              <p className="text-neutral-400 leading-relaxed">
                To become the leading student tech hub that empowers learners to experiment without fear, nurturing the next generation of engineers, innovators, and disruptors.
              </p>
           </ScrollReveal>
           <ScrollReveal delay={0.2} className="p-8 border border-neutral-800 bg-neutral-900/30">
              <h3 className="text-2xl font-mono font-bold mb-4 text-white">:: MISSION</h3>
              <p className="text-neutral-400 leading-relaxed">
                To provide a platform for curiosity, collaboration, and execution. We foster a culture where "I don't know" is just the start of a journey to "I built this."
              </p>
           </ScrollReveal>
        </div>
      </Section>

      {/* EVENTS HIGHLIGHT */}
      <Section theme="light">
        <ScrollReveal className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">UPCOMING ACTIVITIES</h2>
            <p className="text-neutral-500">Join us at our next gathering.</p>
          </div>
          <NavLink to="/events" className="hidden md:flex items-center font-bold border-b-2 border-black pb-1 hover:pr-4 transition-all">
            Full Calendar <ArrowRight size={18} className="ml-2" />
          </NavLink>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-6">
          {upcomingHighlights.map((event, idx) => (
            <ScrollReveal key={event.id} delay={idx * 0.1}>
              <EventCard 
                id={event.id}
                title={event.title} 
                date={event.date} 
                category={event.category} 
                image={event.image} 
                registrationStatus={event.registrationStatus}
              />
            </ScrollReveal>
          ))}
          {upcomingHighlights.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-neutral-200">
               <p className="text-neutral-500 font-mono">No upcoming transmissions detected.</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 md:hidden">
           <NavLink to="/events">
             <Button variant="secondary" className="w-full">View All Events</Button>
           </NavLink>
        </div>
      </Section>

      {/* CALL TO ACTION */}
      <Section theme="dark" className="text-center py-32">
        <ScrollReveal>
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
            READY TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-white">DEPLOY?</span>
          </h2>
          <p className="text-xl text-neutral-400 max-w-xl mx-auto mb-10">
            Join a network of creators. Access mentorship, projects, and a community that speaks your language.
          </p>
          <NavLink to="/community">
            <Button variant="primary" className="text-lg px-12 py-4">Initialize Sequence</Button>
          </NavLink>
        </ScrollReveal>
      </Section>
    </>
  );
};

export default Home;
