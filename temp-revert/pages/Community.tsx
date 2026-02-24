
import React, { useState } from 'react';
import { Section, Button, ScrollReveal } from '../components/UI';
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

    try {
      // NOTE: If this is the first time submitting to this email via FormSubmit,
      // you MUST check your inbox (and spam) for an "Activate" email from FormSubmit.
      // The form data will not arrive until you click that activation link.
      
      const response = await fetch("https://formsubmit.co/ajax/connect@the404society.in", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          // Standard fields for better email formatting
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: `Interest Area: ${formData.interest}`,
          
          // Custom fields (will also be included)
          firstName: formData.firstName,
          lastName: formData.lastName,
          interest: formData.interest,

          // FormSubmit Configuration
          _subject: `New Application: ${formData.firstName} ${formData.lastName}`,
          _template: "table", // Formats the email nicely
          _captcha: "false", // Disable captcha to prevent blocking automated requests
          _autoresponse: "your application has been received" // Optional auto-reply to user
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      console.log("FormSubmit Result:", result);
      
      // On success, show the confirmation screen
      setFormStatus('success');
      
    } catch (error) {
      console.error("Submission Error:", error);
      alert("There was an error submitting your application. Please check your internet connection and try again.");
      setFormStatus('idle');
    }
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
            <ScrollReveal>
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
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="p-6 bg-neutral-100 border border-neutral-300">
               <h4 className="font-bold mb-2">ELIGIBILITY</h4>
               <p className="text-sm text-neutral-600">
                 Currently open to all students of the University enrolled in any department. Tech enthusiasts from outside can join our Discord as Guests.
               </p>
            </ScrollReveal>
          </div>

          {/* Form Side */}
          <ScrollReveal delay={0.3} className="bg-black text-white p-8 md:p-12 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col justify-center min-h-[500px]">
            
            {formStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500 w-full">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-6">
                  <Check size={32} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 tracking-tight">TRANSMISSION COMPLETE</h3>
                
                <p className="text-neutral-400 text-sm mb-6 max-w-xs mx-auto">
                  Your application dossier has been securely forwarded to <span className="text-white font-mono">connect@the404society.in</span> for review.
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
                        <span className="text-sm font-mono text-white">404 Workspace 3rd Floor, B-Wing</span>
                        <span className="text-xs font-mono text-neutral-400 block">P E S Campus, Shivamogga</span>
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
                <form className="space-y-6" onSubmit={handleSubmit}>
                  
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
                        <option value="Others">Others</option>
                    </select>
                  </div>
    
                  <div className="pt-4">
                    <Button variant="primary" className="w-full" type="submit" disabled={formStatus === 'submitting'}>
                      {formStatus === 'submitting' ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin" size={18} /> TRANSMITTING...
                        </span>
                      ) : 'SUBMIT APPLICATION'}
                    </Button>
                    <p className="text-center text-xs text-neutral-500 mt-4 font-mono">By joining, you agree to our Code of Conduct.</p>
                  </div>
                </form>
              </>
            )}
          </ScrollReveal>

        </div>
      </Section>
    </>
  );
};

export default Community;
