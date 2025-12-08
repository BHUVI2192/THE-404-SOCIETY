import React, { useState } from 'react';
import { Section, Button } from '../components/UI';
import { Check, Loader2, MapPin, Clock } from 'lucide-react';

const Community: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: 'Full Stack Web Dev'
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate Backend API Call (Email Service)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // NOTE: In a real production build, this is where you would call your backend endpoint
    // to actually send the email to cnbhuvan011@gmail.com.
    // Example: axios.post('/api/send-application', { ...formData, recipient: 'cnbhuvan011@gmail.com' })
    
    console.log("SYSTEM LOG: Application data securely transmitted.");
    console.log("RECIPIENT: cnbhuvan011@gmail.com");
    console.log("PAYLOAD:", formData);

    setFormStatus('success');
  };

  const handleReset = () => {
    setFormStatus('idle');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      interest: 'Full Stack Web Dev'
    });
  };

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
          <div className="bg-black text-white p-8 md:p-12 border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[500px]">
            
            {formStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500 w-full">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-6">
                  <Check size={32} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 tracking-tight">TRANSMISSION COMPLETE</h3>
                
                <p className="text-neutral-400 text-sm mb-6 max-w-xs mx-auto">
                  Your application dossier has been securely forwarded to <span className="text-white font-mono">cnbhuvan011@gmail.com</span> for review.
                </p>

                {/* Meeting Details Box */}
                <div className="bg-neutral-900 border-l-4 border-white p-4 mb-8 text-left w-full">
                  <h4 className="text-white font-bold font-mono mb-3 uppercase text-xs tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Verification Required
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-neutral-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-neutral-500 uppercase font-bold">Location</span>
                        <span className="text-sm font-mono text-white">Student Center, Room 404</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-neutral-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-neutral-500 uppercase font-bold">Time</span>
                        <span className="text-sm font-mono text-white">2:00 PM (14:00)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" onClick={handleReset} className="text-xs">Submit Another Application</Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-mono font-bold mb-8 text-center">INITIALIZE_REGISTRATION</h2>
                <form className="space-y-6 relative z-0" onSubmit={handleSubmit}>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono uppercase text-neutral-400">First Name</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full bg-neutral-900 border border-neutral-700 p-3 focus:border-white focus:outline-none transition-colors text-white disabled:opacity-50" 
                          placeholder="Jane" 
                          required 
                          disabled={formStatus === 'submitting'}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-mono uppercase text-neutral-400">Last Name</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full bg-neutral-900 border border-neutral-700 p-3 focus:border-white focus:outline-none transition-colors text-white disabled:opacity-50" 
                          placeholder="Doe" 
                          required 
                          disabled={formStatus === 'submitting'}
                        />
                    </div>
                  </div>
    
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-neutral-400">University Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border border-neutral-700 p-3 focus:border-white focus:outline-none transition-colors text-white disabled:opacity-50" 
                      placeholder="jane.doe@university.edu" 
                      required 
                      disabled={formStatus === 'submitting'}
                    />
                  </div>
    
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-neutral-400">Primary Interest</label>
                    <select 
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border border-neutral-700 p-3 focus:border-white focus:outline-none transition-colors text-white appearance-none disabled:opacity-50"
                      disabled={formStatus === 'submitting'}
                    >
                        <option value="Full Stack Web Dev">Full Stack Web Dev</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="DevOps / Cloud">DevOps / Cloud</option>
                        <option value="Android App Development">Android App Development</option>
                    </select>
                  </div>
    
                  <div className="pt-4">
                    <Button variant="primary" className="w-full" type="submit" disabled={formStatus === 'submitting'}>
                      {formStatus === 'submitting' ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin" size={18} /> PROCESSING...
                        </span>
                      ) : 'SUBMIT APPLICATION'}
                    </Button>
                    <p className="text-center text-xs text-neutral-500 mt-4 font-mono">By joining, you agree to our Code of Conduct.</p>
                  </div>
                </form>
              </>
            )}
          </div>

        </div>
      </Section>
    </>
  );
};

export default Community;