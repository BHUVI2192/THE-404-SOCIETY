import React from 'react';
import { Section, EventCard } from '../components/UI';
import { EVENTS } from '../constants';

const Events: React.FC = () => {
  const upcoming = EVENTS.filter(e => e.type === 'upcoming');
  const past = EVENTS.filter(e => e.type === 'past');

  return (
    <>
      <Section theme="dark" className="pt-32">
        <div className="mb-16">
          <h1 className="text-5xl font-black mb-4">EVENTS</h1>
          <p className="text-neutral-400 max-w-2xl">
            Where code meets culture. Join us for hands-on sessions, marathons, and showcases.
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-mono font-bold mb-8 border-b border-neutral-800 pb-4 inline-block">:: INCOMING_TRANSMISSION</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcoming.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>

        <div>
           <h2 className="text-2xl font-mono font-bold mb-8 border-b border-neutral-800 pb-4 inline-block text-neutral-500">:: ARCHIVE_LOGS</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-70 hover:opacity-100 transition-opacity">
            {past.map(event => (
              <EventCard key={event.id} {...event} isPast />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

export default Events;