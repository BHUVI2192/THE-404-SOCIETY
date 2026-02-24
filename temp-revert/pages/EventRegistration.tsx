
import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Section, Button, ScrollReveal, GlitchText } from '../components/UI';
import { EVENTS } from '../constants';
import { Check, Loader2, Calendar, MapPin, ArrowLeft, Lock, Info, AlertTriangle } from 'lucide-react';

const EventRegistration: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = EVENTS.find(e => e.id === eventId);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    rollNo: '',
    department: '',
    semester: '1',
    notes: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      // Using FormSubmit for the registration process
      const response = await fetch("https://formsubmit.co/ajax/connect@the404society.in", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Event Registration: ${event?.title || 'Unknown Event'} - ${formData.fullName}`,
          eventTitle: event?.title || 'Unknown',
          ...formData,
          _template: "table"
        })
      });

      if (!response.ok) throw new Error('Submission failed');
      
      setFormStatus('success');
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration failed. Please try again.");
      setFormStatus('idle');
    }
  };

  if (!event && formStatus !== 'success') {
    return (
      <Section theme="light" className="pt-32 min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-black mb-4 uppercase text-black">Event Not Found</h1>
        <p className="text-neutral-500 mb-8">The event you are trying to register for does not exist in our logs.</p>
        <NavLink to="/events">
          <Button variant="outline" className="text-black border-black hover:bg-black hover:text-white">Back to Events</Button>
        </NavLink>
      </Section>
    );
  }

  // Handle Locked Registration
  if (event?.registrationStatus === 'locked' && formStatus !== 'success') {
    return (
      <Section theme="light" className="pt-32 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <NavLink to="/events" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black transition-colors mb-12 font-mono text-xs uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Archive
          </NavLink>

          <div className="bg-black text-white p-12 md:p-20 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 border-2 border-white/20 rounded-full flex items-center justify-center mb-8 bg-neutral-900">
                <Lock className="text-white" size={32} />
              </div>

              <span className="text-[10px] font-mono uppercase bg-white text-black px-3 py-1 mb-6 tracking-[0.2em] font-bold">
                Status: PENDING_INTAKE_INITIALIZATION
              </span>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-none">
                <GlitchText text="REGISTRATION_LOCKED" />
              </h1>

              <div className="max-w-2xl mx-auto space-y-6">
                <p className="text-lg text-neutral-400 font-light leading-relaxed">
                  The administrative nodes have not yet opened the intake sequence for <span className="text-white font-bold">{event.title}</span>. Access is currently restricted to lead coordinators.
                </p>
                
                <div className="p-6 border border-neutral-800 bg-neutral-900/50 inline-block text-left w-full">
                  <div className="flex items-start gap-4">
                    <Info className="text-white shrink-0 mt-1" size={20} />
                    <div className="space-y-4">
                      <p className="text-sm text-neutral-300 font-mono">
                        <span className="text-white font-bold block mb-1">:: COORDINATOR NOTE</span>
                        Registration portals are typically activated 7-10 days prior to the event date. The Society Leads are currently finalizing the infrastructure and logistics for this session.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
                  <NavLink to="/events">
                    <Button variant="primary" className="w-full md:w-auto">Return to Archive</Button>
                  </NavLink>
                  <a href="mailto:connect@the404society.in">
                    <Button variant="outline" className="w-full md:w-auto">Contact Admin</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
             <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
               Last State Sync: {new Date().toLocaleTimeString()} // Latency: Nominal
             </p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section theme="light" className="pt-32 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <NavLink to="/events" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black transition-colors mb-8 font-mono text-xs uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to Archive
        </NavLink>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Event Details Side (Now Light) */}
          <ScrollReveal>
            <div className="mb-8">
              <span className="text-xs font-mono uppercase bg-black text-white px-2 py-1 mb-4 inline-block">Registration Active</span>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none text-black">
                Register for <br/>
                <GlitchText text={event?.title || "EVENT"} className="text-black" />
              </h1>
              <p className="text-neutral-600 text-lg mb-8 leading-relaxed">
                {event?.description}
              </p>
            </div>

            <div className="space-y-6 border-l border-neutral-200 pl-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-100 border border-neutral-200">
                  <Calendar size={20} className="text-neutral-500" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-neutral-500 font-mono">Date & Time</span>
                  <span className="text-black font-bold">{event?.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-100 border border-neutral-200">
                  <MapPin size={20} className="text-neutral-500" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-neutral-500 font-mono">Venue</span>
                  <span className="text-black font-bold">Lab 404 / Seminar Hall</span>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-neutral-50 border border-neutral-200 rounded-sm">
              <h4 className="text-xs font-mono uppercase text-black mb-2 font-bold">Instructions:</h4>
              <ul className="text-xs text-neutral-500 space-y-2 list-disc pl-4">
                <li>Bring your University ID for on-spot verification.</li>
                <li>Reach the venue 15 minutes prior to the start.</li>
                <li>Laptop is mandatory for technical workshops.</li>
              </ul>
            </div>
          </ScrollReveal>

          {/* Registration Form Side (Now Dark) */}
          <ScrollReveal delay={0.2} className="bg-black text-white p-8 md:p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)]">
            {formStatus === 'success' ? (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} />
                </div>
                <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">REGISTRATION_LOCKED</h2>
                <p className="text-neutral-400 mb-8 max-w-xs mx-auto">
                  Transmission successful. Your slot for <span className="font-bold text-white">{event?.title}</span> has been provisionally reserved.
                </p>
                <div className="p-4 bg-neutral-900 border border-neutral-800 text-left mb-8">
                  <p className="text-[10px] font-mono uppercase text-neutral-500 mb-2">Next Steps:</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Check your email for the confirmation ticket. If you don't see it within 5 minutes, verify your spam folder.
                  </p>
                </div>
                <NavLink to="/events">
                  <Button variant="primary" className="w-full">Return to Events</Button>
                </NavLink>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-black uppercase mb-6 border-b-2 border-white pb-2">Participant Details</h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border-2 border-neutral-800 p-3 focus:border-white outline-none transition-colors text-white placeholder:text-neutral-600"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border-2 border-neutral-800 p-3 focus:border-white outline-none transition-colors text-white placeholder:text-neutral-600"
                      placeholder="name@university.edu"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border-2 border-neutral-800 p-3 focus:border-white outline-none transition-colors text-white placeholder:text-neutral-600"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">University ID / Roll No</label>
                    <input 
                      type="text" 
                      name="rollNo"
                      required
                      value={formData.rollNo}
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border-2 border-neutral-800 p-3 focus:border-white outline-none transition-colors text-white placeholder:text-neutral-600"
                      placeholder="e.g. 21CS001"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Semester</label>
                    <select 
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border-2 border-neutral-800 p-3 focus:border-white outline-none transition-colors text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Department</label>
                  <input 
                    type="text" 
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border-2 border-neutral-800 p-3 focus:border-white outline-none transition-colors text-white placeholder:text-neutral-600"
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Anything else we should know?</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-neutral-900 border-2 border-neutral-800 p-3 focus:border-white outline-none transition-colors text-white resize-none placeholder:text-neutral-600"
                    placeholder="Food preferences, accessibility needs, etc."
                  ></textarea>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full py-4 text-base"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={20} /> LOCKING SLOT...
                      </span>
                    ) : 'CONFIRM REGISTRATION'}
                  </Button>
                  <p className="text-[9px] font-mono text-center mt-4 text-neutral-500 uppercase tracking-widest">
                    Secure Transmission via UNIT_404 Protocols
                  </p>
                </div>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
};

export default EventRegistration;
