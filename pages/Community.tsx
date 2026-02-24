
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from '@emailjs/browser';
import { saveCommunityApp } from '../lib/community_apps';


// --- CONFIGURATION ---
const CONFIG = {
  fontPrimary: "'Manrope', sans-serif",
  fontMono: "'Space Mono', monospace",
};

// --- BASE QUESTIONS ---
const BASE_QUESTIONS = [
  {
    id: "name",
    label: "01 // IDENTIFICATION",
    text: "Who is initiating this connection?",
    placeholder: "Type your full name...",
    type: "text"
  },
  {
    id: "college",
    label: "02 // ACADEMIC BASE",
    text: "Which institution are you deploying from?",
    type: "selection",
    options: [
      "PESITM (Internal Operator)",
      "JNNCE",
      "Sahyadri",
      "Other / External"
    ]
  },
  // This ID is special. It will be dynamically inserted if needed.
  {
    id: "external_college_name",
    label: "02.5 // EXTERNAL ORIGIN",
    text: "Enter your institution's name.",
    placeholder: "e.g., RVCE, BMS, etc.",
    type: "text",
    condition: (answers: any) => answers.college === "Other / External" // LOGIC HERE
  },
  {
    id: "year",
    label: "03 // CLEARANCE LEVEL",
    text: "Current year of study?",
    type: "selection",
    options: [
      "1st Year (Freshman)",
      "2nd Year (Sophomore)",
      "3rd Year (Junior)",
      "4th Year (Senior)",
      "Alumni / Pro"
    ]
  },
  {
    id: "contact",
    label: "04 // COMMS LINK",
    text: "Your WhatsApp number for squad alerts.",
    placeholder: "+91 00000 00000",
    type: "tel"
  },
  {
    id: "email",
    label: "05 // DIGITAL ID",
    text: "Where should we send the invite code?",
    placeholder: "name@example.com",
    type: "email"
  },
  {
    id: "interest",
    label: "06 // PLAYER CLASS",
    text: "Select your primary domain.",
    type: "selection",
    options: [
      "Full Stack Development",
      "AI / ML Engineering",
      "Cybersecurity & Ops",
      "UI / UX Design",
      "Content & Media",
      "Exploring / Beginner"
    ]
  },
  {
    id: "social",
    label: "07 // PROOF OF WORK",
    text: "Drop a GitHub, LinkedIn, or Portfolio link. (Optional)",
    placeholder: "https://github.com/username",
    type: "url"
  }
];

export default function Community() {
  const [questions, setQuestions] = useState(BASE_QUESTIONS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const containerRef = useRef<HTMLDivElement>(null);

  // --- LOGIC ENGINE ---
  // Re-evaluates which questions should be shown based on answers
  useEffect(() => {
    const visibleQuestions = BASE_QUESTIONS.filter(q => {
      if (!(q as any).condition) return true; // Show if no condition
      return (q as any).condition(formData);  // Check condition against current data
    });
    setQuestions(visibleQuestions);
  }, [formData]);

  // Scroll to active question
  useEffect(() => {
    const activeEl = document.getElementById(`q-${activeIndex}`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  const handleNext = () => {
    if (activeIndex < questions.length) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && activeIndex < questions.length) {
      handleNext();
    }
  };

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelection = (id: string, value: string) => {
    handleChange(id, value);
    // Small delay to allow state update & re-render of question list before scrolling
    setTimeout(() => handleNext(), 100);
  };

  const handleSubmit = async () => {
    setFormStatus('submitting');

    // Split full name for emailjs template compatibility
    const nameParts = (formData.name || "").split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      // Save to Firestore for admin (fire-and-forget)
      saveCommunityApp({
        name: formData.name || '',
        email: formData.email || '',
        contact: formData.contact || '',
        college: formData.external_college_name ? `${formData.college} (${formData.external_college_name})` : (formData.college || ''),
        year: formData.year || '',
        interest: formData.interest || '',
        social: formData.social || '',
      });

      // Auto-send confirmation email to the applicant
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          firstName: firstName,
          lastName: lastName,
          email: formData.email,
          contact: formData.contact,
          interest: formData.interest,
          college: formData.college,
          external_college: formData.external_college_name || "N/A",
          year: formData.year,
          social: formData.social || "N/A"
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setFormStatus('success');
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Transmission failed. Please try again.");
      setFormStatus('idle');
    }
  };

  return (
    <div ref={containerRef} style={{ fontFamily: CONFIG.fontPrimary, backgroundColor: "#fff", minHeight: "100vh", position: "relative" }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800&display=swap');`}
        {`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');`}
        {`::selection { background: #000; color: #fff; }`}
        {`input:focus { outline: none; }`}
        {`body { margin: 0; overflow-x: hidden; }`}
        {`::-webkit-scrollbar { width: 0px; background: transparent; }`}
      </style>

      {/* PROGRESS BAR */}
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBarFill, height: `${((activeIndex + 1) / (questions.length + 1)) * 100}%` }} />
      </div>

      {/* HEADER */}
      <header style={styles.header}>
        <span style={styles.brand}>THE 404 SOCIETY // JOIN PESITM'S CODING CLUB</span>
        <span style={styles.stepCounter}>{Math.min(activeIndex + 1, questions.length)} / {questions.length}</span>
      </header>

      {/* CONVERSATION FLOW */}
      <div style={styles.scrollContainer}>
        <div style={styles.spacer} />

        <AnimatePresence>
          {questions.map((q, index) => (
            <QuestionBlock
              key={q.id} // Important: Use ID not index for stable keys
              index={index}
              activeIndex={activeIndex}
              data={q}
              value={formData[q.id] || ""}
              onChange={handleChange}
              onSelection={handleSelection}
              onKeyDown={handleKeyDown}
              onNext={handleNext}
            />
          ))}
        </AnimatePresence>

        {/* SUBMIT SECTION */}
        <div id={`q-${questions.length}`} style={{ ...styles.questionBlock, opacity: activeIndex === questions.length ? 1 : 0.2 }}>
          {formStatus === 'success' ? (
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✓</div>
              <h2 style={styles.finalHeading}>WELCOME TO THE SOCIETY.</h2>
              <p style={styles.finalSub}>Your application sequence is complete. Check your comms link shortly.</p>
            </div>
          ) : (
            <>
              <h2 style={styles.finalHeading}>READY TO INITIALIZE?</h2>
              <p style={styles.finalSub}>By clicking below, you agree to our Code of Conduct.</p>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#000", color: "#fff" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  ...styles.submitBtn,
                  opacity: formStatus === 'submitting' ? 0.5 : 1,
                  cursor: formStatus === 'submitting' ? 'not-allowed' : 'pointer'
                }}
                onClick={handleSubmit}
                disabled={formStatus === 'submitting'}
              >
                {formStatus === 'submitting' ? "TRANSMITTING..." : "SUBMIT APPLICATION \u2192"}
              </motion.button>
            </>
          )}
        </div>

        <div style={styles.spacer} />
      </div>
    </div>
  );
}

// --- SUB-COMPONENT ---
const QuestionBlock = ({ index, activeIndex, data, value, onChange, onSelection, onKeyDown, onNext }: any) => {
  const isActive = index === activeIndex;

  return (
    <motion.div
      id={`q-${index}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isActive ? 1 : 0.2, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        ...styles.questionBlock,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      onClick={() => !isActive && document.getElementById(`q-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
    >
      <div style={styles.qLabel}>
        <span style={{ color: isActive ? "#000" : "#999" }}>{data.label}</span>
      </div>

      <h2 style={styles.qText}>{data.text}</h2>

      <div style={styles.inputWrapper}>
        {data.type === "selection" ? (
          <div style={styles.optionsGrid}>
            {data.options.map((opt: string) => (
              <button
                key={opt}
                style={{
                  ...styles.optionBtn,
                  backgroundColor: value === opt ? "#000" : "#fff",
                  color: value === opt ? "#fff" : "#000",
                  borderColor: value === opt ? "#000" : "#ddd"
                }}
                onClick={() => onSelection(data.id, opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={data.type === "url" ? "text" : data.type}
              placeholder={data.placeholder}
              value={value}
              // autoFocus={isActive}
              onChange={(e) => onChange(data.id, e.target.value)}
              onKeyDown={onKeyDown}
              style={styles.input}
            />
            <div style={styles.enterHint}>Press <strong>Enter &#8629;</strong></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- STYLES ---
const styles: Record<string, React.CSSProperties> = {
  progressBarContainer: { position: "fixed", left: 0, top: 0, bottom: 0, width: "4px", backgroundColor: "#f0f0f0", zIndex: 50 },
  progressBarFill: { width: "100%", backgroundColor: "#000", transition: "height 0.5s ease" },

  header: { position: "fixed", top: 0, left: 0, right: 0, padding: "30px 5vw", display: "flex", justifyContent: "space-between", zIndex: 40, pointerEvents: "none" },
  brand: { fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", fontWeight: "700", letterSpacing: "0.1em" },
  stepCounter: { fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", fontWeight: "700" },

  scrollContainer: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%" },
  spacer: { height: "40vh", width: "100%" },

  questionBlock: { width: "100%", maxWidth: "900px", padding: "0 5vw", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", transition: "opacity 0.5s ease" },

  qLabel: { fontFamily: "'Space Mono', monospace", fontSize: "0.9rem", fontWeight: "700", letterSpacing: "0.1em", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" },
  qText: { fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: "800", lineHeight: 1.1, margin: "0 0 40px 0", letterSpacing: "-0.02em", color: "#000" },

  inputWrapper: { width: "100%" },
  input: { width: "100%", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontFamily: "'Manrope', sans-serif", border: "none", borderBottom: "2px solid #ddd", padding: "10px 0", backgroundColor: "transparent", color: "#000", fontWeight: "500", borderRadius: "0", transition: "border-color 0.3s ease" },
  enterHint: { position: "absolute", right: 0, bottom: "20px", fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: "#999", pointerEvents: "none" },

  optionsGrid: { display: "flex", flexWrap: "wrap", gap: "15px" },
  optionBtn: { padding: "15px 30px", fontSize: "1.2rem", fontFamily: "'Manrope', sans-serif", fontWeight: "600", border: "1px solid #ddd", backgroundColor: "#fff", cursor: "pointer", borderRadius: "50px", transition: "all 0.2s ease" },

  finalHeading: { fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: "800", margin: "0 0 20px 0" },
  finalSub: { fontFamily: "'Space Mono', monospace", fontSize: "1rem", opacity: 0.6, marginBottom: "40px" },
  submitBtn: { fontSize: "1.5rem", padding: "20px 50px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "0", fontFamily: "'Space Mono', monospace", fontWeight: "700", cursor: "pointer", alignSelf: "flex-start", transition: "all 0.2s ease" }
};
