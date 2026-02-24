
import React from 'react';
import { Section, EventCard, ScrollReveal } from '../components/UI';
import { EVENTS } from '../constants';

const Events: React.FC = () => {
  const upcoming = EVENTS.filter(e => e.type === 'upcoming');
  const past = EVENTS.filter(e => e.type === 'past');

  return (
    <>
      <Section theme="dark" className="pt-32">
        <ScrollReveal className="mb-16">
          <h1 className="text-5xl font-black mb-4 uppercase">EVENTS_ARCHIVE</h1>
          <p className="text-neutral-400 max-w-2xl leading-relaxed">
            Where code meets culture. Join us for hands-on sessions, marathons, and showcases. All upcoming sessions require pre-registration.
          </p>
        </ScrollReveal>

        <div className="mb-20">
          <ScrollReveal>
            <h2 className="text-2xl font-mono font-bold mb-8 border-b border-neutral-800 pb-4 inline-block tracking-tighter uppercase">
              :: INCOMING_TRANSMISSIONS
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcoming.map((event, idx) => (
              <ScrollReveal key={event.id} delay={idx * 0.1}>
                <EventCard {...event} />
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div>
           <ScrollReveal>
             <h2 className="text-2xl font-mono font-bold mb-8 border-b border-neutral-800 pb-4 inline-block text-neutral-500 tracking-tighter uppercase">
               :: LEGACY_LOGS
             </h2>
           </ScrollReveal>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-60 hover:opacity-100 transition-opacity">
            {past.map((event, idx) => (
              <ScrollReveal key={event.id} delay={idx * 0.1}>
                <EventCard {...event} isPast />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

export default Events;
