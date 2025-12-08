import React from 'react';
import { Section } from '../components/UI';
import { TEAM_MEMBERS } from '../constants';
import { Github, Linkedin } from 'lucide-react';

const Team: React.FC = () => {
  const coreTeam = TEAM_MEMBERS.filter(m => m.group === 'Core');
  const techTeam = TEAM_MEMBERS.filter(m => m.group === 'Tech' || m.group === 'Design' || m.group === 'Events');

  const MemberCard: React.FC<{ member: typeof TEAM_MEMBERS[0] }> = ({ member }) => (
    <div className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col items-center text-center hover:border-white transition-colors group">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-neutral-800 grayscale group-hover:grayscale-0 transition-all">
        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
      <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">{member.role}</span>
      <p className="text-sm text-neutral-500 mb-6">{member.bio}</p>
      <div className="flex gap-3 mt-auto">
        <a href="#" className="text-neutral-400 hover:text-white"><Github size={18} /></a>
        <a href="#" className="text-neutral-400 hover:text-white"><Linkedin size={18} /></a>
      </div>
    </div>
  );

  return (
    <>
      <Section theme="dark" className="pt-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">THE SQUAD</h1>
          <p className="text-neutral-400">The people behind the commits.</p>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-mono font-bold mb-8 text-center text-white">:: FOUNDERS</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {coreTeam.map(member => <MemberCard key={member.id} member={member} />)}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-mono font-bold mb-8 text-center text-white">:: CO-FOUNDERS & LEADS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techTeam.map(member => <MemberCard key={member.id} member={member} />)}
          </div>
        </div>
      </Section>
    </>
  );
};

export default Team;