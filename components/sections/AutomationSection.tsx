// Automation Services — ColorPeekLinks Interactive Directory
// Foundation: Framer ColorPeekLinks Component (https://framer.com/m/ColorPeekLinks-jb8X4M.js@1Mw7GEjwAelcvDrTRhVI)
// Interactive color-peek banners showcasing each business automation category

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AUTOMATIONS, AutomationItem } from '../../data/automations';
import { ColorPeekLinks, ColorPeekItem } from '../ColorPeekLinks';
import { AutomationDetail } from './AutomationDetail';

export interface AutomationSectionProps {
  className?: string;
  gap?: number;
}

export const AutomationSection: React.FC<AutomationSectionProps> = ({
  className = '',
  gap = 14,
}) => {
  const [selectedAutomation, setSelectedAutomation] = useState<AutomationItem | null>(null);

  // Map structured automation data into ColorPeekLinks items
  const peekItems: ColorPeekItem[] = AUTOMATIONS.map((auto) => ({
    id: auto.id,
    title: `${auto.number}. ${auto.cardTitle}`,
    description: auto.introduction,
    image: auto.image,
    imagePosition: auto.imagePosition || '50% 50%',
    background: auto.background,
    textColor: auto.textColor || '#FFFFFF',
    onClick: () => setSelectedAutomation(auto),
  }));

  return (
    <section
      id="automations"
      className={`automation-showcase-section ${className}`}
      style={{
        maxWidth: '1320px',
        width: '100%',
        margin: 'clamp(40px, 5.5vh, 64px) auto',
        padding: '0 clamp(24px, 5vw, 64px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '84px',
      }}
    >
      {/* ── SECTION HEADER: BIG, CURSIVE & LEFT-ALIGNED (OF CENTERED CONTENT) ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          marginBottom: 'clamp(28px, 4.5vh, 44px)',
          textAlign: 'left',
          paddingLeft: '0',
        }}
      >
        {/* Main Title: Big & Cursive (Instrument Serif Italic) */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontStyle: 'italic',
            fontSize: 'clamp(32px, 5vw, 76px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            margin: '0 0 10px',
            textAlign: 'left',
          }}
        >
          Automation, beyond the obvious.
        </motion.h2>

        {/* 2. Automation Subhead — Same size and styling as 1. Websites */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: 'clamp(16px, 1.8vw, 22px)',
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 18px',
            textAlign: 'left',
          }}
        >
          2. Automation
        </motion.p>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist", -apple-system, sans-serif',
            fontSize: 'clamp(15px, 1.6vw, 17px)',
            lineHeight: 1.55,
            color: 'rgba(255, 255, 255, 0.65)',
            margin: 0,
            maxWidth: '680px',
            fontWeight: 400,
            textAlign: 'left',
          }}
        >
          We build systems that eliminate repetitive work, connect disconnected tools and make
          businesses run smarter.
        </motion.p>
      </div>

      {/* ── FRAMER COLOR PEEK LINKS DIRECTORY ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <ColorPeekLinks
          items={peekItems}
          gap={gap}
          cardHeight={160}
          radius={22}
          cardPadding={28}
          imageInset={10}
          imageWidth={24}
          hoverWidth={35}
          imageRadius={16}
          titleSize={36}
          animationSpeed={0.65}
          background="transparent"
          titleFont={{
            fontFamily: '"Geist", -apple-system, sans-serif',
            fontWeight: 400,
          }}
          smallFont={{
            fontFamily: '"Geist", -apple-system, sans-serif',
          }}
        />
      </motion.div>

      {/* ── DETAILED MODAL VIEW ── */}
      <AutomationDetail
        item={selectedAutomation}
        onClose={() => setSelectedAutomation(null)}
      />
    </section>
  );
};

export default AutomationSection;
