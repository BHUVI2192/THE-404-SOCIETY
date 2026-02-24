
import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import { getEvents, EventData } from "../lib/events";
import { Loader2 } from "lucide-react";
import "./Events.css";

export default function EventsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div ref={pageRef} className="events-page-container">
      {/* --- HEADER --- */}
      <header className="events-header">
        <div className="events-header-top">
          <span className="brand-badge">THE 404 SOCIETY <span className="brand-badge-divider">//</span> CALENDAR</span>
        </div>
        <h1 className="huge-title">THE_SESSIONS</h1>
        <p className="header-subtitle">
          Tech workshops, hackathons &amp; coding events at PESITM Shivamogga.
        </p>
      </header>

      {/* --- THE SIDE-WAVE LIST --- */}
      <section className="events-list-container">
        {/* Header Row */}
        <div className="events-list-header">
          <span className="header-col-date">DATE</span>
          <span className="header-col-details">EVENT DETAILS</span>
          <span className="header-col-action">ACTION</span>
        </div>

        <div className="events-rows-wrapper">
          {events.length > 0 ? (
            events.map((event) => (
              <SideWaveRow key={event.id} event={event} />
            ))
          ) : (
            <div className="py-20 text-center font-black uppercase text-gray-200 tracking-widest text-xl">
              No Upcoming Sessions Scheduled.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
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
          <span>{isLocked ? "CLOSED" : "VIEW"}</span>
        </div>
      </motion.div>

      {/* Divider Line */}
      <div className="row-divider" />

    </motion.div>
  );
};

const Footer = () => (
  <footer className="events-footer">
    <div className="footer-content">
      <h3>THE 404 SOCIETY</h3>
      <p className="footer-email">hello@404society.com</p>
    </div>
  </footer>
);
