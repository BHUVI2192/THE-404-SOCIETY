
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendApplicationReceivedEmail } from '../lib/emailService';
import { saveCommunityApp } from '../lib/community_apps';

import { Helmet } from 'react-helmet-async';


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
      "PESITM Shivamogga",
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
    id: "skills",
    label: "07 // LOADOUT",
    text: "List your top skills (Tools/Languages).",
    placeholder: "e.g., React, Python, Figma, C++...",
    type: "text"
  },
  {
    id: "reason",
    label: "08 // MOTIVE",
    text: "Why do you want to join The 404 Society?",
    placeholder: "I want to build...",
    type: "textarea"
  },
  {
    id: "social",
    label: "09 // PROOF OF WORK",
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
        skills: formData.skills || '',
        reason: formData.reason || '',
        social: formData.social || '',
      });

      // Auto-send confirmation email to the applicant using SMTP backend
      await sendApplicationReceivedEmail({
          name: formData.name,
          email: formData.email,
      });

      setFormStatus('success');
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Transmission failed. Please try again.");
      setFormStatus('idle');
    }
  };

  return (
    <>
      <Helmet>
        <title>Join The Community | The 404 Society</title>
        <meta name="description" content="Apply to join The 404 Society. We are looking for passionate developers, designers, and innovators to build the future." />
      </Helmet>
      <div ref={containerRef} style={{ fontFamily: CONFIG.fontPrimary, backgroundColor: "#fff", minHeight: "100vh", position: "relative" }}>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800&display=swap');`}
          {`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');`}
          {`::selection { background: #000; color: #fff; }`}
          {`input:focus { outline: none; }`}
          {`body { margin: 0; overflow-x: hidden; }`}
          {`::-webkit-scrollbar { width: 0px; background: transparent; }`}
          {`@keyframes spin { to { transform: rotate(360deg); } }`}
        </style>

        {/* PROGRESS BAR */}
        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBarFill, height: `${((activeIndex) / questions.length) * 100}%` }} />
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
          <div
            id={`q-${questions.length}`}
            style={{
              ...styles.questionBlock,
              opacity: activeIndex === questions.length ? 1 : 0.2,
              pointerEvents: activeIndex === questions.length ? 'auto' : 'none',
            }}
          >
            {formStatus === 'success' ? (
              /* ── SUCCESS STATE ── */
              <div style={{ maxWidth: '680px' }}>
                <div style={styles.successBadge}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Application Transmitted</span>
                </div>

                <h2 style={styles.finalHeading}>APPLICATION<br />RECEIVED.</h2>

                <p style={styles.finalSub}>
                  Your application is now in our queue. We'll review it and reach out to you via email with the next steps. No further action needed from your side.
                </p>

                <div style={styles.infoBox}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoKey}>WHAT'S NEXT</span>
                    <span style={styles.infoVal}>Our team reviews applications on a rolling basis. Expect an email from us within a few days.</span>
                  </div>
                  <div style={{ width: '100%', height: '1px', background: '#e8e8e8', margin: '14px 0' }} />
                  <div style={styles.infoRow}>
                    <span style={styles.infoKey}>CONTACTS</span>
                    <span style={styles.infoVal}>connect@the404society.in<br />Onboarding: Thrisha K (+91 89512 90096)</span>
                  </div>
                </div>
              </div>
            ) : (
              /* ── SUBMIT STATE ── */
              <div style={{ maxWidth: '680px' }}>
                <div style={styles.submitLabel}>FINAL STEP // SUBMIT</div>

                <h2 style={styles.finalHeading}>READY TO<br />INITIALIZE?</h2>

                <p style={styles.finalSub}>
                  Once submitted, you'll receive a confirmation email. We review applications and contact shortlisted applicants — this is not an instant approval.
                </p>

                <p style={{ ...styles.finalSub, fontSize: '0.7rem', marginBottom: '28px', opacity: 0.45 }}>
                  By clicking below, you agree to our{' '}
                  <a href="/code-of-conduct" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#000' }}>Code of Conduct</a>.
                </p>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  style={{
                    ...styles.submitBtn,
                    opacity: formStatus === 'submitting' ? 0.6 : 1,
                    cursor: formStatus === 'submitting' ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleSubmit}
                  disabled={formStatus === 'submitting'}
                >
                  {formStatus === 'submitting' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={styles.spinner} />
                      TRANSMITTING...
                    </span>
                  ) : (
                    'SUBMIT APPLICATION →'
                  )}
                </motion.button>
              </div>
            )}
          </div>

          <div style={styles.spacer} />
        </div>
      </div>
    </>
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
        ) : data.type === "textarea" ? (
          <div style={{ width: '100%' }}>
            <textarea
              placeholder={data.placeholder}
              value={value}
              onChange={(e) => onChange(data.id, e.target.value)}
              style={{ ...styles.input, height: '150px', resize: 'vertical' }}
            />
            <div style={styles.actionRow}>
              <button onClick={onNext} style={styles.nextBtn}>NEXT &rarr;</button>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <input
              type={data.type === "url" ? "text" : data.type}
              placeholder={data.placeholder}
              value={value}
              // autoFocus={isActive}
              onChange={(e) => onChange(data.id, e.target.value)}
              onKeyDown={onKeyDown}
              style={styles.input}
            />
            <div style={styles.actionRow}>
              <span style={styles.enterHintText}>Press <strong>Enter &#8629;</strong> or </span>
              <button onClick={onNext} style={styles.nextBtn}>NEXT &rarr;</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- STYLES ---
const styles: Record<string, React.CSSProperties> = {
  progressBarContainer: { position: "fixed", left: 0, top: 0, bottom: 0, width: "3px", backgroundColor: "#f0f0f0", zIndex: 50 },
  progressBarFill: { width: "100%", backgroundColor: "#000", transition: "height 0.5s ease" },

  header: { position: "fixed", top: 0, left: 0, right: 0, padding: "16px 4vw", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 40, pointerEvents: "none", fontSize: "0.7rem", minHeight: "56px", flexWrap: "wrap", gap: "8px" },
  brand: { fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "0.1em" },
  stepCounter: { fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", fontWeight: "700" },

  scrollContainer: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%" },
  spacer: { height: "40vh", width: "100%", minHeight: "30vh" },

  questionBlock: { width: "100%", maxWidth: "900px", padding: "0 4vw", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", transition: "opacity 0.5s ease" },

  qLabel: { fontFamily: "'Space Mono', monospace", fontSize: "clamp(0.65rem, 2vw, 0.9rem)", fontWeight: "700", letterSpacing: "0.1em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" },
  qText: { fontSize: "clamp(2rem, 6vw, 4.5rem)", fontWeight: "800", lineHeight: 1.1, margin: "0 0 30px 0", letterSpacing: "-0.02em", color: "#000" },

  inputWrapper: { width: "100%" },
  input: { width: "100%", fontSize: "clamp(1.2rem, 4vw, 2.5rem)", fontFamily: "'Manrope', sans-serif", border: "none", borderBottom: "2px solid #ddd", padding: "8px 0", backgroundColor: "transparent", color: "#000", fontWeight: "500", borderRadius: "0", transition: "border-color 0.3s ease" },
  actionRow: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", marginTop: "12px", flexWrap: "wrap" },
  enterHintText: { fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#999" },
  nextBtn: { padding: "10px 20px", minHeight: "44px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "20px", fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", transition: "transform 0.2s", whiteSpace: "nowrap", touchAction: "manipulation" },

  optionsGrid: { display: "flex", flexWrap: "wrap", gap: "10px" },
  optionBtn: { padding: "10px 16px", fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)", fontFamily: "'Manrope', sans-serif", fontWeight: "600", border: "1px solid #ddd", backgroundColor: "#fff", cursor: "pointer", borderRadius: "50px", transition: "all 0.2s ease" },

  finalHeading: { fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: "800", margin: "0 0 20px 0", letterSpacing: "-0.03em", lineHeight: 1.05 },
  finalSub: { fontFamily: "'Space Mono', monospace", fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)", opacity: 0.6, marginBottom: "16px", lineHeight: 1.7, maxWidth: '560px' },
  submitBtn: {
    fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
    padding: "18px 40px",
    backgroundColor: "#000",
    color: "#fff",
    border: "3px solid #000",
    borderRadius: "0",
    fontFamily: "'Space Mono', monospace",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    letterSpacing: "0.05em",
    transition: "all 0.2s ease",
    boxShadow: "5px 5px 0 0 rgba(0,0,0,0.12)",
  },
  submitLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.65rem",
    fontWeight: "700",
    letterSpacing: "0.15em",
    color: "#999",
    marginBottom: "16px",
  },
  successBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#000",
    color: "#fff",
    padding: "8px 16px",
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.7rem",
    fontWeight: "700",
    letterSpacing: "0.1em",
    marginBottom: "24px",
  },
  infoBox: {
    marginTop: "28px",
    border: "2px solid #000",
    padding: "20px 24px",
    maxWidth: "520px",
  },
  infoRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  infoKey: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.65rem",
    fontWeight: "700",
    letterSpacing: "0.15em",
    color: "#999",
  },
  infoVal: {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#000",
    lineHeight: 1.6,
  },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};
