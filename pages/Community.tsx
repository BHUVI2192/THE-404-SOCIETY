import React from 'react';
import { Section, Button } from '../components/UI';
import { Check } from 'lucide-react';

const Community: React.FC = () => {
  return (
    <>
      <Section theme="light" className="pt-32">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div>
            <h1 className="text-5xl font-black mb-6">JOIN THE NODE</h1>
            <p className="text-lg text-neutral-600 mb-8">
              Whether you're a "Hello World" beginner or a kernel hacker, there is a place for you here.
            </p>

            <h3 className="font-bold text-xl mb-4">MEMBERSHIP PERKS</h3>
            <ul className="space-y-4 mb-10">
              {[
                'Exclusive access to workshops',
                'Mentorship from seniors and alumni',
                'Cloud credits and dev tools',
                'Opportunity to lead squads',
                'Cool monochrome merch'
              ].map((perk, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="bg-black text-white p-1 rounded-full"><Check size={12} /></div>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <div className="p-6 bg-neutral-100 border border-neutral-300">
               <h4 className="font-bold mb-2">ELIGIBILITY</h4>
               <p className="text-sm text-neutral-600">
                 Currently open to all students of the University enrolled in any department. Tech enthusiasts from outside can join our discord as Guests.
               </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-black text-white p-8 md:p-12 border border-neutral-800 shadow-2xl">
            <h2 className="text-2xl font-mono font-bold mb-8 text-center">INITIALIZE_REGISTRATION</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-neutral-400">First Name</label>
                    <input type="text" className="w-full bg-neutral-900 border border-neutral-700 p-3 focus:border-white focus:outline-none transition-colors text-white" placeholder="Jane" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-neutral-400">Last Name</label>
                    <input type="text" className="w-full bg-neutral-900 border border-neutral-700 p-3 focus:border-white focus:outline-none transition-colors text-white" placeholder="Doe" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-mono uppercase text-neutral-400">University Email</label>
                 <input type="email" className="w-full bg-neutral-900 border border-neutral-700 p-3 focus:border-white focus:outline-none transition-colors text-white" placeholder="jane.doe@university.edu" />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-mono uppercase text-neutral-400">Primary Interest</label>
                 <select className="w-full bg-neutral-900 border border-neutral-700 p-3 focus:border-white focus:outline-none transition-colors text-white appearance-none">
                    <option>Full Stack Web Dev</option>
                    <option>Artificial Intelligence</option>
                    <option>Cybersecurity</option>
                    <option>UI/UX Design</option>
                    <option>DevOps / Cloud</option>
                 </select>
              </div>

              <div className="pt-4">
                <Button variant="primary" className="w-full" type="submit">SUBMIT APPLICATION</Button>
                <p className="text-center text-xs text-neutral-500 mt-4 font-mono">By joining, you agree to our Code of Conduct.</p>
              </div>
            </form>
          </div>

        </div>
      </Section>
    </>
  );
};

export default Community;