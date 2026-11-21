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
    cta: auto.cta || 'Explore System',
    onClick: () => setSelectedAutomation(auto),
  }));

  return (
    <section
      id="automations"
      className={`automation-showcase-section ${className}`}
      style={{
        maxWidth: '1280px',
        width: '100%',
        margin: 'clamp(72px, 11vh, 128px) auto',
        padding: '0 clamp(16px, 4vw, 36px)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        scrollMarginTop: '110px',
      }}
    >
      {/* ── SECTION INTRODUCTION ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          marginBottom: 'clamp(32px, 5vh, 48px)',
          paddingLeft: '2px',
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#60A5FA',
            margin: '0 0 12px',
          }}
        >
          WHAT WE AUTOMATE
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist", -apple-system, sans-serif',
            fontSize: 'clamp(28px, 3.6vw, 44px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
            color: '#FFFFFF',
            margin: '0 0 14px',
            textTransform: 'uppercase',
          }}
        >
          AUTOMATION, BEYOND THE OBVIOUS.
        </motion.h2>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Geist", -apple-system, sans-serif',
            fontSize: 'clamp(15px, 1.6vw, 17px)',
            lineHeight: 1.55,
            color: 'rgba(255, 255, 255, 0.65)',
            margin: 0,
            fontWeight: 400,
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
          cardHeight={162}
          radius={22}
          cardPadding={28}
          imageInset={10}
          imageWidth={30}
          hoverWidth={52}
          imageRadius={16}
          titleSize={38}
          animationSpeed={0.65}
          background="transparent"
          titleFont={{
            fontFamily: '"Geist", -apple-system, sans-serif',
            fontWeight: 700,
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
