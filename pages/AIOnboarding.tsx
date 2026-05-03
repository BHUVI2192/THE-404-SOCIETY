import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Terminal, Cpu, Bug, Activity, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AIOnboarding() {
  const [activeSection, setActiveSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    frameworks: '',
    hardestIssue: '',
    experiences: [] as string[],
    currentDebugging: '',
    shareTraces: '',
    whyTest: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (experience: string) => {
    setFormData(prev => {
      const exists = prev.experiences.includes(experience);
      if (exists) {
        return { ...prev, experiences: prev.experiences.filter(e => e !== experience) };
      } else {
        return { ...prev, experiences: [...prev.experiences, experience] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-404-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        console.error('Submission failed');
        alert('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 font-sans relative overflow-hidden" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl w-full text-center space-y-8 z-10"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto border border-neutral-200"
          >
            <CheckCircle className="w-8 h-8 text-black" />
          </motion.div>
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-serif italic text-black">
              Application Received.
            </h2>
            <p className="text-neutral-500 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
              We're carefully selecting early engineers for Phase 1 testing. Keep an eye on your inbox.
            </p>
          </div>
          
          <motion.a 
            href="/"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-medium rounded-full mt-8"
          >
            Return to society <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans relative" style={{ backgroundColor: '#ffffff', color: '#000000', selectionBackgroundColor: '#000000', selectionColor: '#ffffff' }}>
      <Helmet>
        <title>404 AI | Early Access</title>
        <meta name="theme-color" content="#ffffff" />
      </Helmet>

      {/* Global Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-50" style={{ opacity: 0.04, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Nav */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-40">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2 text-black">
          <div className="w-2 h-2 bg-black rounded-full"></div>
          404 AI
        </div>
        <div className="text-xs uppercase tracking-widest text-neutral-500 font-medium">Phase 1 Testing</div>
      </nav>

      <main className="relative">
        
        {/* SECTION 1: HERO */}
        <section className="min-h-screen flex items-center justify-center relative px-6 pt-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black rounded-full pointer-events-none" style={{ opacity: 0.03, filter: 'blur(120px)' }}></div>
          
          <div className="max-w-5xl mx-auto w-full z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1 text-xs uppercase tracking-wider border border-neutral-300 rounded-full text-neutral-500">Restricted Access</span>
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-[120px] font-medium leading-[0.9] tracking-[-0.04em] text-black">
                AI agents don't <br />
                <span className="font-serif italic text-neutral-400">fail loudly.</span>
              </h1>
              
              <div className="mt-12 flex flex-col md:flex-row md:items-center gap-8 justify-between border-t border-neutral-200 pt-8">
                <p className="text-lg md:text-xl text-neutral-500 max-w-md font-light leading-relaxed">
                  Help us test the future of AI debugging. Root cause analysis for autonomous systems.
                </p>
                <button 
                  onClick={() => {
                    document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative px-8 py-4 bg-black text-white rounded-full overflow-hidden flex items-center gap-2 w-fit"
                >
                  <span className="relative z-10 font-medium text-sm uppercase tracking-wide">Request Early Access</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-neutral-800 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: THE PROBLEM */}
        <section id="problem-section" className="py-32 px-6 relative border-t border-neutral-200" style={{ backgroundColor: '#ffffff' }}>
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center"
            >
              <div>
                <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-8 text-black">
                  The <span className="font-serif italic text-neutral-500">black box</span> is getting deeper.
                </h2>
                <div className="space-y-6 text-neutral-600 text-lg font-light leading-relaxed">
                  <p>Silent failures. Hallucinated tool calls. Infinite reasoning loops. As agents grow more autonomous, observability breaks down.</p>
                  <p>When an agent fails on step 47 of a 50-step workflow, traditional logging isn't enough. You need the <span className="text-black font-medium">Decisive Error Step (DES)</span>.</p>
                </div>
              </div>
              
              <div className="relative border border-neutral-200 rounded-2xl p-8 font-mono text-sm overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent opacity-50"></div>
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                  <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                  <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                </div>
                <div className="space-y-3 opacity-90 text-neutral-600">
                  <div className="flex items-center gap-3"><Activity className="w-4 h-4" /> <span>[10:42:01] Agent starting...</span></div>
                  <div className="flex items-center gap-3"><Terminal className="w-4 h-4" /> <span>[10:42:05] Tool call: fetch_db_schema (Success)</span></div>
                  <div className="flex items-center gap-3"><Cpu className="w-4 h-4" /> <span>[10:42:12] Reasoning: Analyzing schema structure</span></div>
                  <div className="flex items-center gap-3 text-black font-medium"><Bug className="w-4 h-4" /> <span>[10:42:18] Warning: Hallucinated table reference 'users_v2'</span></div>
                  <div className="flex items-center gap-3 text-neutral-400"><Activity className="w-4 h-4" /> <span>[10:43:00] Critical: Infinite loop detected in tool execution</span></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: WHO WE ARE LOOKING FOR */}
        <section className="py-32 px-6 border-t border-neutral-200" style={{ backgroundColor: '#ffffff' }}>
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-black">Who should apply?</h2>
              <p className="text-neutral-500 text-lg">We are onboarding a highly curated group of builders.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "LangGraph Engineers", desc: "Building complex stateful workflows." },
                { title: "CrewAI Builders", desc: "Managing multi-agent orchestrations." },
                { title: "LLMOps Teams", desc: "Scaling agentic systems to production." },
                { title: "AI Founders", desc: "Solving actual user problems with agents." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 border border-neutral-200 rounded-2xl transition-colors"
                  style={{ backgroundColor: '#fafafa' }}
                >
                  <h3 className="text-black font-medium mb-2">{item.title}</h3>
                  <p className="text-neutral-500 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: APPLICATION EXPERIENCE */}
        <section className="py-32 px-6 border-t border-neutral-200 relative" id="apply" style={{ backgroundColor: '#fafafa' }}>
          <div className="max-w-3xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4 font-serif italic text-black">The Application</h2>
              <p className="text-neutral-500">Secure your spot in Phase 1.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="text-xs uppercase tracking-widest text-neutral-900 font-medium group-focus-within:text-black transition-colors">Name</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full bg-transparent border-b border-neutral-300 py-3 text-black focus:outline-none focus:border-black transition-colors font-light text-lg placeholder-neutral-400" placeholder="John Doe" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs uppercase tracking-widest text-neutral-900 font-medium group-focus-within:text-black transition-colors">Work Email</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-transparent border-b border-neutral-300 py-3 text-black focus:outline-none focus:border-black transition-colors font-light text-lg placeholder-neutral-400" placeholder="john@company.com" />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs uppercase tracking-widest text-neutral-900 font-medium group-focus-within:text-black transition-colors">Company / Project Name</label>
                <input required name="company" value={formData.company} onChange={handleInputChange} type="text" className="w-full bg-transparent border-b border-neutral-300 py-3 text-black focus:outline-none focus:border-black transition-colors font-light text-lg placeholder-neutral-400" placeholder="Acme AI" />
              </div>

              {/* Tech Stack */}
              <div className="space-y-4 pt-8 border-t border-neutral-200">
                <label className="text-sm font-medium text-black">What AI frameworks/tools are you currently using?</label>
                <textarea required name="frameworks" value={formData.frameworks} onChange={handleInputChange} rows={2} className="w-full border border-neutral-300 rounded-xl p-4 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none text-sm font-light placeholder-neutral-400" style={{ backgroundColor: '#ffffff' }} placeholder="LangChain, Autogen, custom Python logic..."></textarea>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-black">Have you experienced any of the following? (Select all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Silent Failures', 'Hallucinated Tool Calls', 'Infinite Loops', 'Incorrect Final Outputs'].map(exp => (
                    <label 
                      key={exp} 
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default label click behavior if no input is present
                        handleCheckboxChange(exp);
                      }}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.experiences.includes(exp) ? 'border-black bg-neutral-100 text-black' : 'border-neutral-300 bg-transparent text-neutral-800 hover:border-black'}`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.experiences.includes(exp) ? 'border-black bg-black' : 'border-neutral-300'}`}>
                        {formData.experiences.includes(exp) && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-sm font-medium">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deep Questions */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-black">Describe the hardest AI debugging issue you’ve faced.</label>
                <textarea required name="hardestIssue" value={formData.hardestIssue} onChange={handleInputChange} rows={3} className="w-full border border-neutral-300 rounded-xl p-4 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none text-sm font-light placeholder-neutral-400" style={{ backgroundColor: '#ffffff' }} placeholder="Tell us a war story..."></textarea>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-black">How are you currently debugging AI agents?</label>
                <textarea required name="currentDebugging" value={formData.currentDebugging} onChange={handleInputChange} rows={2} className="w-full border border-neutral-300 rounded-xl p-4 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none text-sm font-light placeholder-neutral-400" style={{ backgroundColor: '#ffffff' }} placeholder="Print statements, LangSmith, custom dashboards..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-black block">Would you be open to sharing failed traces privately?</label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="shareTraces" value={opt} onChange={handleInputChange} className="accent-black w-4 h-4" required />
                        <span className="text-neutral-900 font-medium text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-black">Why do you want to test 404 AI?</label>
                <textarea required name="whyTest" value={formData.whyTest} onChange={handleInputChange} rows={2} className="w-full border border-neutral-300 rounded-xl p-4 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none text-sm font-light placeholder-neutral-400" style={{ backgroundColor: '#ffffff' }} placeholder="What are you hoping to achieve?"></textarea>
              </div>

              {/* Submit */}
              <div className="pt-8 border-t border-neutral-200 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-black text-white rounded-full font-medium text-sm uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</>
                  ) : (
                    <>Submit Application <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

            </form>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-neutral-400 text-xs tracking-widest uppercase border-t border-neutral-200">
        © {new Date().getFullYear()} 404 AI Infrastructure
      </footer>
    </div>
  );
}
