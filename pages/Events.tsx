
import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import { getEvents, EventData } from "../lib/events";
import { Loader2 } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import "./Events.css";

export default function EventsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      // Only show 'open' events for public, or all? 
      // User might want to see 'locked' events too but with a 'Closed' label.
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // Run BEFORE the browser paints — sets opacity to 0 instantly,
  // then fades in. This prevents the 1-frame "unstyled" flash.
  useLayoutEffect(() => {
    if (loading) return; // Wait until loaded to animate in
    const ctx = gsap.context(() => {
      gsap.set(pageRef.current, { opacity: 0 });
      gsap.to(pageRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
    });
    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-200" size={48} />
      </div>
    );
  }

  const categories = ["All", ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];

  const filteredEvents = selectedCategory === "All"
    ? events
    : events.filter(e => e.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Events & Sessions | The 404 Society</title>
        <meta name="description" content="Discover upcoming hackathons, AI workshops, and tech events hosted by The 404 Society at PESITM." />
      </Helmet>
      <div ref={pageRef} className="events-page-container">
        {/* --- HEADER --- */}
        <header className="events-header !border-b-0 min-h-[100vh] hidden md:flex flex-col items-center justify-center relative">
          <div className="events-header-top">
            <span className="brand-badge">THE 404 SOCIETY <span className="brand-badge-divider">//</span> CALENDAR</span>
          </div>
          <h1 className="huge-title">THE_SESSIONS</h1>
          <p className="max-w-2xl text-center mx-auto text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed mt-6">
            Tech workshops, hackathons &amp; coding events at PESITM Shivamogga.
          </p>
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as string)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border
                    ${selectedCategory === category
                      ? 'bg-black text-white border-black'
                      : 'bg-transparent text-gray-500 border-gray-200 hover:border-black hover:text-black'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* --- THE SIDE-WAVE LIST --- */}
        <section className="events-list-container">
          {/* Header Row */}
          {filteredEvents.length > 0 && (
            <div className="events-list-header">
              <span className="header-col-date">DATE</span>
              <span className="header-col-details">EVENT DETAILS</span>
              <span className="header-col-action">ACTION</span>
            </div>
          )}

          <div className="events-rows-wrapper pb-32">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <SideWaveRow key={event.id} event={event} />
              ))
            ) : (
              <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center max-w-4xl mx-auto"
                >
                  <h2
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                    className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tight uppercase leading-[0.9] text-center"
                  >
                    <span className="text-black">SOMETHING</span> <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#10B981] inline-block">EXCITING</span> <br />
                    <span className="text-black">IS COMING</span>
                  </h2>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

// --- THE INTERACTIVE ROW COMPONENT ---
interface SideWaveRowProps {
  event: EventData;
}

const SideWaveRow: React.FC<SideWaveRowProps> = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLocked = event.status === "locked";

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`event-row ${isLocked ? "opacity-60" : ""}`}
    >

      {/* 1. THE SIDE WAVE BACKGROUND (Right to Left) */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isHovered ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }}
        className="wave-bg"
      />


      {/* 2. CONTENT LAYER (Mix Blend Mode Inverts Colors (Desktop)) */}
      <div className="row-content-layer">

        {/* DATE */}
        <div className="row-col-left">
          <span className="date-main">{event.date}</span>
          <span className="date-year">{event.year}</span>
        </div>

        {/* TITLE */}
        <div className="row-col-center">
          <h2 className="event-title">{event.title}</h2>
          <div className="flex items-center gap-4">
            <p className="location-text">LOC: {event.location}</p>
            {isLocked && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">Closed</span>
            )}
          </div>
        </div>

        {/* ACTION */}
        <div className="row-col-right">
          <NavLink
            to={`/register-event/${event.id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              width: '100%',
              pointerEvents: isLocked ? 'none' : 'auto' // Optional: allow clicking but show 'Closed' state inside
            }}
          >
            <motion.div
              animate={{ x: isHovered ? -150 : 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
              className={`register-btn ${isLocked ? "bg-gray-400 border-gray-400" : ""}`}
            >
              {isLocked ? "CLOSED" : "REGISTER ↗"}
            </motion.div>
          </NavLink>
        </div>

      </div>

      {/* 3. THE HALF-PILL IMAGE (Anchored Right) */}
      <motion.div
        initial={{ x: "50%", opacity: 0 }} // Hidden further right
        animate={{
          x: isHovered ? "0%" : "50%", // Slides in to 'default' position
          opacity: isHovered ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        className="half-pill-container"
      >
        <img src={event.img} alt={event.title} loading="lazy" className="half-pill-img" />
        {/* Overlay to ensure text readability if needed */}
        <div className="img-overlay">
          <span>{isLocked ? "CLOSED" : ""}</span>
        </div>
      </motion.div>

      {/* Divider Line */}
      <div className="row-divider" />

    </motion.div>
  );
};
