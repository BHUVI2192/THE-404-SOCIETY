import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import GlimmerVale from '../components/GlimmerVale';
import FluidGlassButton from '../components/FluidGlassButton';
import MotionOverlayMenu from '../components/MotionOverlayMenu';
import YoudecideIntro from '../components/YoudecideIntro';
import AudioWave from '../components/AudioWave';
import PortfolioSection from '../components/PortfolioSection';

// Official Vector Logo Component (Reversed for dark/night aesthetic)
const YouDecideLogo: React.FC<{ height?: number; className?: string }> = ({
  height = 28,
  className = '',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-9 -741 7720 921"
      role="img"
      aria-label="youdecide.studio"
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
      className={className}
    >
      <title>youdecide.studio</title>
      <g id="logo">
        <path
          id="letters"
          fill="#FFFFFF"
          d="M110 150V38H181Q207 38 219 30.5Q231 23 239 4L250 -27H209L21 -536H174L297 -167L412 -536H565L359 51Q341 104 307 127Q273 150 212 150Z M856 12Q774 12 713 -22.5Q652 -57 618 -120Q584 -183 584 -268Q584 -353 618 -415.5Q652 -478 713 -513Q774 -548 856 -548Q938 -548 999.5 -513Q1061 -478 1094.5 -415.5Q1128 -353 1128 -268Q1128 -183 1094.5 -120Q1061 -57 999.5 -22.5Q938 12 856 12ZM856 -103Q912 -103 943 -146.5Q974 -190 974 -268Q974 -346 943 -389.5Q912 -433 856 -433Q800 -433 769 -389.5Q738 -346 738 -268Q738 -190 769 -146.5Q800 -103 856 -103Z M1389 12Q1307 12 1260 -41Q1213 -94 1213 -190V-534H1341V-222Q1341 -154 1363.5 -123Q1386 -92 1432 -92Q1483 -92 1512 -126.5Q1541 -161 1541 -227V-534H1669V0H1552L1550 -87Q1508 12 1389 12Z M1978 12Q1910 12 1860.5 -22Q1811 -56 1784 -118.5Q1757 -181 1757 -267Q1757 -352 1784.5 -415Q1812 -478 1861.5 -512Q1911 -546 1978 -546Q2034 -546 2076.5 -523Q2119 -500 2141 -458V-710H2269V0H2147L2144 -79Q2122 -36 2078 -12Q2034 12 1978 12ZM2017 -92Q2076 -92 2108.5 -137.5Q2141 -183 2141 -267Q2141 -352 2109 -397Q2077 -442 2017 -442Q1959 -442 1924.5 -395.5Q1890 -349 1890 -267Q1890 -187 1924.5 -139.5Q1959 -92 2017 -92Z M2611 12Q2533 12 2476.5 -22.5Q2420 -57 2389.5 -119.5Q2359 -182 2359 -266Q2359 -350 2389.5 -412.5Q2420 -475 2476 -509.5Q2532 -544 2608 -544Q2680 -544 2735 -510.5Q2790 -477 2820.5 -414Q2851 -351 2851 -262V-235H2469Q2473 -157 2510.5 -118Q2548 -79 2612 -79Q2659 -79 2689.5 -100.5Q2720 -122 2733 -160L2843 -153Q2822 -78 2760.5 -33Q2699 12 2611 12ZM2469 -315H2739Q2734 -386 2698 -420Q2662 -454 2608 -454Q2551 -454 2514.5 -418.5Q2478 -383 2469 -315Z M3165 12Q3089 12 3032 -22.5Q2975 -57 2944 -119.5Q2913 -182 2913 -266Q2913 -350 2944 -412.5Q2975 -475 3032 -509.5Q3089 -544 3165 -544Q3262 -544 3326 -493.5Q3390 -443 3403 -351L3292 -345Q3284 -397 3250 -424.5Q3216 -452 3165 -452Q3098 -452 3060.5 -402.5Q3023 -353 3023 -266Q3023 -178 3060.5 -129Q3098 -80 3165 -80Q3216 -80 3250 -108.5Q3284 -137 3292 -195L3403 -189Q3390 -97 3326.5 -42.5Q3263 12 3165 12Z M3482 0V-530H3566V0ZM3480 -613V-711H3568V-613Z M3886 12Q3817 12 3766.5 -22Q3716 -56 3689 -118Q3662 -180 3662 -265Q3662 -350 3689 -412Q3716 -474 3766.5 -508Q3817 -542 3886 -542Q3939 -542 3983 -519.5Q4027 -497 4049 -456V-710H4133V0H4057L4054 -80Q4032 -37 3987 -12.5Q3942 12 3886 12ZM3903 -68Q3974 -68 4011.5 -121Q4049 -174 4049 -265Q4049 -357 4011.5 -409.5Q3974 -462 3903 -462Q3833 -462 3791.5 -409.5Q3750 -357 3750 -265Q3750 -174 3791.5 -121Q3833 -68 3903 -68Z M4478 12Q4403 12 4348.5 -22Q4294 -56 4264.5 -118.5Q4235 -181 4235 -265Q4235 -349 4264.5 -411Q4294 -473 4347.5 -507.5Q4401 -542 4474 -542Q4543 -542 4596 -509.5Q4649 -477 4678.5 -415Q4708 -353 4708 -264V-239H4323Q4328 -154 4368.5 -111Q4409 -68 4478 -68Q4530 -68 4563.5 -92.5Q4597 -117 4610 -157L4700 -150Q4679 -79 4620.5 -33.5Q4562 12 4478 12ZM4323 -313H4616Q4610 -390 4571.5 -426Q4533 -462 4474 -462Q4413 -462 4373.5 -424.5Q4334 -387 4323 -313Z"
        />
        <circle id="dot" fill="#1920F0" cx="4853" cy="-95" r="95" />
        <path
          id="studio"
          fill="#A1A1AA"
          d="M5235 12Q5126 12 5069 -38.5Q5012 -89 5006 -167L5094 -173Q5102 -125 5133.5 -96.5Q5165 -68 5235 -68Q5289 -68 5318.5 -85.5Q5348 -103 5348 -142Q5348 -163 5338.5 -177Q5329 -191 5301 -201.5Q5273 -212 5219 -222Q5145 -236 5103 -257Q5061 -278 5044 -308Q5027 -338 5027 -380Q5027 -451 5079.5 -496.5Q5132 -542 5228 -542Q5298 -542 5342.5 -517.5Q5387 -493 5410 -454Q5433 -415 5438 -372L5350 -366Q5346 -404 5318.5 -433Q5291 -462 5226 -462Q5169 -462 5142 -440Q5115 -418 5115 -384Q5115 -345 5140 -326.5Q5165 -308 5235 -296Q5313 -283 5357 -263Q5401 -243 5418.5 -213.5Q5436 -184 5436 -142Q5436 -69 5379.5 -28.5Q5323 12 5235 12Z M5714 0Q5642 0 5607.5 -33Q5573 -66 5573 -136V-456H5495V-530H5573V-654H5657V-530H5798V-456H5657V-138Q5657 -102 5673 -88Q5689 -74 5722 -74H5798V0Z M6068 12Q5989 12 5941.5 -41.5Q5894 -95 5894 -189V-530H5978V-212Q5978 -135 6005.5 -98.5Q6033 -62 6090 -62Q6153 -62 6189 -102.5Q6225 -143 6225 -214V-530H6309V0H6229V-86Q6185 12 6068 12Z M6635 12Q6566 12 6515.5 -22Q6465 -56 6438 -118Q6411 -180 6411 -265Q6411 -350 6438 -412Q6465 -474 6515.5 -508Q6566 -542 6635 -542Q6688 -542 6732 -519.5Q6776 -497 6798 -456V-710H6882V0H6806L6803 -80Q6781 -37 6736 -12.5Q6691 12 6635 12ZM6652 -68Q6723 -68 6760.5 -121Q6798 -174 6798 -265Q6798 -357 6760.5 -409.5Q6723 -462 6652 -462Q6582 -462 6540.5 -409.5Q6499 -357 6499 -265Q6499 -174 6540.5 -121Q6582 -68 6652 -68Z M7010 0V-530H7094V0ZM7008 -613V-711H7096V-613Z M7439 12Q7366 12 7311 -22Q7256 -56 7226 -118.5Q7196 -181 7196 -265Q7196 -350 7226 -412Q7256 -474 7311 -508Q7366 -542 7439 -542Q7512 -542 7566.5 -508Q7621 -474 7651 -412Q7681 -350 7681 -265Q7681 -181 7651 -118.5Q7621 -56 7566.5 -22Q7512 12 7439 12ZM7439 -68Q7512 -68 7552.5 -120.5Q7593 -173 7593 -265Q7593 -357 7552.5 -409.5Q7512 -462 7439 -462Q7366 -462 7325 -409.5Q7284 -357 7284 -265Q7284 -173 7325 -120.5Q7366 -68 7439 -68Z"
        />
      </g>
    </svg>
  );
};

const SERVICES = [
  {
    title: 'Website Design & Development',
    desc: 'Custom website development and affordable website design for small businesses, crafted to turn visitors into enquiries.',
    tag: 'Pay As You Wish',
  },
  {
    title: 'Business Automation',
    desc: 'Remove the manual, repetitive friction from your team’s weekly workflows with custom trigger pipelines.',
    tag: 'Workflows',
  },
  {
    title: 'BI & Analytics',
    desc: 'Dashboards that actually answer the commercial questions you care about.',
    tag: 'Data',
  },
  {
    title: 'Workflow Optimisation',
    desc: 'Cleaner processes, fewer hand-offs, and automated trigger pipelines.',
    tag: 'Systems',
  },
  {
    title: 'Digital Transformation',
    desc: 'A practical, grounded roadmap executed sprint by sprint. Pay what you want web development built around your goals.',
    tag: 'Strategy',
  },
  {
    title: 'Custom Engineering',
    desc: 'Have a bespoke technical bottleneck? We will tell you honestly if we can build it.',
    tag: 'Special Projects',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Brief',
    desc: 'Tell us what your business or project needs. We scope it together in plain language.',
  },
  {
    num: '02',
    title: 'Build',
    desc: 'We design and engineer the solution. You inspect progress live as it happens, not at the end.',
  },
  {
    num: '03',
    title: 'Decide',
    desc: 'You review the finished delivery, verify its commercial value, and tell us what it was worth.',
  },
];

const YouDecideLocal: React.FC = () => {
  const [sliderVal, setSliderVal] = useState<number>(65);

  const calculatePerceivedValue = (val: number) => {
    if (val < 25) return 'Sprint Prototype';
    if (val < 50) return 'Custom MVP & Launch';
    if (val < 75) return 'Full Stack Automation & Web';
    return 'Enterprise Transformation';
  };

  useEffect(() => {
    document.title = 'Affordable Website Design for Small Businesses | youdecide.studio';
    const updateMeta = (selector: string, attr: string, val: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[')) {
          const match = selector.match(/meta\[(.*?)="(.*?)"\]/);
          if (match) el.setAttribute(match[1], match[2]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };

    updateMeta('meta[name="description"]', 'content', 'Pay as you wish for professional website design and development. Bring your idea, get your website built, and decide what the work is worth.');
    updateMeta('meta[property="og:title"]', 'content', 'Affordable Website Design for Small Businesses | youdecide.studio');
    updateMeta('meta[property="og:description"]', 'content', 'Pay as you wish for professional website design and development. Bring your idea, get your website built, and decide what the work is worth.');
    updateMeta('meta[name="twitter:title"]', 'content', 'Affordable Website Design for Small Businesses | youdecide.studio');
    updateMeta('meta[name="twitter:description"]', 'content', 'Pay as you wish for professional website design and development. Bring your idea, get your website built, and decide what the work is worth.');
  }, []);

  return (
    <>
      <Helmet>
        <title>Affordable Website Design for Small Businesses | youdecide.studio</title>
        <meta
          name="description"
          content="Pay as you wish for professional website design and development. Bring your idea, get your website built, and decide what the work is worth."
        />
        <meta
          name="keywords"
          content="Pay As You Wish, Pay as you wish website design, Pay what you want web development, Affordable website development, Website design for small businesses, Custom website development"
        />
        <link rel="canonical" href="https://youdecide.studio/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://youdecide.studio/" />
        <meta
          property="og:title"
          content="Affordable Website Design for Small Businesses | youdecide.studio"
        />
        <meta
          property="og:description"
          content="Pay as you wish for professional website design and development. Bring your idea, get your website built, and decide what the work is worth."
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://youdecide.studio/" />
        <meta
          name="twitter:title"
          content="Affordable Website Design for Small Businesses | youdecide.studio"
        />
        <meta
          name="twitter:description"
          content="Pay as you wish for professional website design and development. Bring your idea, get your website built, and decide what the work is worth."
        />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'youdecide.studio',
            url: 'https://youdecide.studio/',
            description:
              'Pay as you wish for professional website design and development. Bring your idea, get your website built, and decide what the work is worth.',
            priceRange: 'Pay As You Wish',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'Pay As You Wish model for professional website design and development',
            },
          })}
        </script>

        {/* Optimized font loading with font-display: swap */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Geist:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <YoudecideIntro />

      <div
        style={{
          backgroundColor: '#040711',
          color: '#FFFFFF',
          minHeight: '100vh',
          fontFamily: 'Geist, -apple-system, sans-serif',
          overflowX: 'hidden',
        }}
      >
        {/* ── FIXED TOP BAR: ACCESSIBLE ACROSS ALL SCROLL POSITIONS ON THE WEBSITE ── */}
        <header
          style={{
            position: 'fixed',
            top: '12px',
            left: 0,
            right: 0,
            zIndex: 10005,
            maxWidth: '1120px',
            width: '100%',
            margin: '0 auto',
            padding: '0 20px',
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <MotionOverlayMenu
              brandElement={<YouDecideLogo height={15} />}
              brandHref="#overview"
              rightAction={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AudioWave
                    audioUrl="/audio/backgroundmusic.mp3"
                    volume={45}
                    loop={true}
                    animation="bars"
                    barCount={14}
                    svgWidth={34}
                    svgHeight={16}
                    strokeWidth={2}
                    color="#60A5FA"
                    restingColor="rgba(255, 255, 255, 0.4)"
                    showLabel={true}
                    labelOnText="Sound On"
                    labelOffText="Sound Off"
                    labelOnColor="#FFFFFF"
                    labelOffColor="rgba(255, 255, 255, 0.55)"
                    labelGap={6}
                    labelFont={{
                      fontSize: 11,
                      fontFamily: '"Geist", sans-serif',
                      fontWeight: 500,
                      letterSpacing: '0.03em',
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                    }}
                  />
                  <FluidGlassButton
                    text="Contact"
                    link="#contact"
                    padding="5px 15px"
                    fontSize="12px"
                    baseColor="#071838"
                    glassColor="#60A5FA"
                  />
                </div>
              }
              links={[
                { label: 'Capabilities', link: '#services' },
                { label: 'Commercial Model', link: '#model' },
                { label: '3-Step Process', link: '#process' },
                { label: 'Project Briefing', link: '#contact' },
                { label: 'Launch Teaser', link: '#/youdecide.studio' },
              ]}
              secondaryLinks={[
                { label: 'LinkedIn', link: 'https://linkedin.com', newTab: true },
                { label: 'X (Twitter)', link: 'https://x.com', newTab: true },
                { label: 'GitHub', link: 'https://github.com', newTab: true },
                { label: 'hello@youdecide.studio', link: 'mailto:hello@youdecide.studio' },
              ]}
              note="© 2026 youdecide.studio · All rights reserved"
              headerColor="#FFFFFF"
              barBackground="rgba(8, 18, 42, 0.65)"
              barBorder="rgba(255, 255, 255, 0.16)"
              overlayBackground="rgba(4, 9, 24, 0.96)"
              accent="#60A5FA"
            />
          </div>
        </header>

        {/* ========================================================================= */}
        {/* HERO SECTION WITH GLIMMERVALE WEBGL SHADER BACKGROUND */}
        {/* ========================================================================= */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            overflow: 'hidden',
          }}
        >
          {/* WebGL2 Glimmervale nightfield canvas */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'auto',
            }}
          >
            <GlimmerVale
              scene="aurora"
              speed={28}
              density={32}
              sparkle={75}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Vignette & subtle ambient gradient overlays */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(2, 5, 14, 0.4) 80%, rgba(2, 5, 14, 0.95) 100%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* ── HERO CENTER CONTENT: POSITIONED IN OPEN SKY CLEARLY ABOVE MOUNTAIN CREST ── */}
          <div
            id="overview"
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '680px',
              width: '100%',
              margin: 'clamp(82px, 12vh, 120px) auto 0',
              padding: 'clamp(14px, 2vh, 26px) 24px clamp(18px, 2.5vh, 30px)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
          >
            {/* Eyebrow: PAY AS YOU WISH */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hero-eyebrow"
            >
              PAY AS YOU WISH
            </motion.div>

            {/* Main headline (H1): Pay as you wish. in Instrument Serif Italic */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="hero-headline"
            >
              Pay as you wish.
            </motion.h1>

            {/* Supporting headline: Your idea deserves a website. Not a price barrier. */}
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="hero-subhead"
            >
              Your idea deserves a website. Not a price barrier.
            </motion.h2>

            {/* Description: Professional websites and digital experiences. We build. You decide what our work is worth. */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="hero-desc"
            >
              Professional websites and digital experiences. We build. You decide what our work is worth.
            </motion.p>

            {/* Call To Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <a href="#contact" className="hero-cta-btn-primary">
                <span>Initiate Project Brief</span>
                <span aria-hidden="true">→</span>
              </a>
              <a href="#services" className="hero-cta-btn-secondary">
                <span>Explore Capabilities</span>
              </a>
            </motion.div>
          </div>

          {/* Bottom spacer so WebGL mountain floor is gracefully visible */}
          <div style={{ height: '24px' }} />
        </section>

        {/* ========================================================================= */}
        {/* PORTFOLIO & WORK ARCHIVE (MILK GLASS FOLDER & BRAND LOGO SHOWCASE) */}
        {/* ========================================================================= */}
        <PortfolioSection />

        {/* ========================================================================= */}
        {/* INTERACTIVE VALUE SLIDER SECTION */}
        {/* ========================================================================= */}
        <section
          id="model"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '100px 32px 80px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#6169FF',
                  marginBottom: '16px',
                }}
              >
                The Commercial Paradigm
              </div>
              <h2
                style={{
                  fontSize: 'clamp(36px, 4vw, 54px)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  margin: '0 0 20px',
                }}
              >
                No speculative retainers. Pay for outcomes<span style={{ color: '#1920F0' }}>.</span>
              </h2>
              <p
                style={{
                  fontSize: '17px',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.65)',
                  margin: '0 0 28px',
                }}
              >
                Traditional agencies ask for 50% upfront before writing a single line of code. We invert the dynamic: we build the sprint, you inspect the product live, and you decide what it's worth.
              </p>
            </div>

            {/* Interactive Slider Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '40px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#A1A1AA',
                  marginBottom: '12px',
                }}
              >
                Scope Simulator
              </div>

              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  marginBottom: '6px',
                }}
              >
                {calculatePerceivedValue(sliderVal)}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '28px',
                }}
              >
                Adjust scope tier to simulate delivery complexity:
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  height: '8px',
                  accentColor: '#1920F0',
                  cursor: 'pointer',
                  marginBottom: '20px',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '16px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <span>Estimated Band: {sliderVal}%</span>
                <span style={{ color: '#6169FF', fontWeight: 600 }}>0% Advance Risk</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STUDIO CAPABILITIES */}
        {/* ========================================================================= */}
        <section
          id="services"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '96px 32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ maxWidth: '640px', marginBottom: '56px' }}>
            <div
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#6169FF',
                marginBottom: '12px',
              }}
            >
              Full-Stack Capabilities
            </div>
            <h2
              style={{
                fontSize: '44px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                margin: '0 0 16px',
              }}
            >
              Everything digital, one studio<span style={{ color: '#1920F0' }}>.</span>
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.55 }}>
              From high-conversion web frontends to autonomous backend workflows.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {SERVICES.map((srv, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6169FF',
                    letterSpacing: '0.08em',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                  }}
                >
                  {srv.tag}
                </div>
                <h3
                  style={{
                    fontSize: '22px',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    margin: '0 0 10px',
                    color: '#FFFFFF',
                  }}
                >
                  {srv.title}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.65)',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {srv.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE 3-STEP PROCESS */}
        {/* ========================================================================= */}
        <section
          id="process"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '96px 32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ maxWidth: '640px', marginBottom: '56px' }}>
            <div
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#6169FF',
                marginBottom: '12px',
              }}
            >
              The Operating Model
            </div>
            <h2
              style={{
                fontSize: '44px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                margin: '0 0 16px',
              }}
            >
              See the work. Then decide<span style={{ color: '#1920F0' }}>.</span>
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
            }}
          >
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                style={{
                  borderTop: '2px solid rgba(255, 255, 255, 0.25)',
                  paddingTop: '24px',
                }}
              >
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#6169FF',
                    marginBottom: '12px',
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    margin: '0 0 10px',
                    color: '#FFFFFF',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.65)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BRIEFING / CONTACT */}
        {/* ========================================================================= */}
        <section
          id="contact"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '96px 32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1920F0 0%, #0D116D 100%)',
              color: '#FFFFFF',
              borderRadius: '28px',
              padding: '64px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
              boxShadow: '0 24px 64px rgba(25, 32, 240, 0.25)',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  margin: '0 0 16px',
                }}
              >
                Ready when you are.
              </h2>
              <p
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.55,
                  margin: 0,
                  maxWidth: '460px',
                }}
              >
                Tell us about your venture, product, or workflow roadblock. We begin with a zero-risk prototype sprint.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Project brief received. The studio will reach out within 24 hours.');
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <input
                type="text"
                placeholder="Your Name"
                required
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'Geist, sans-serif',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#171717',
                }}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'Geist, sans-serif',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#171717',
                }}
              />
              <textarea
                placeholder="Describe what we are building together..."
                rows={3}
                required
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'Geist, sans-serif',
                  resize: 'none',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#171717',
                }}
              />
              <div style={{ marginTop: '8px' }}>
                <FluidGlassButton
                  text="Submit Project Brief →"
                  padding="16px 36px"
                  fontSize="15px"
                  baseColor="#1920F0"
                  glassColor="#93C5FD"
                  style={{ width: '100%' }}
                />
              </div>
            </form>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FOOTER */}
        {/* ========================================================================= */}
        <footer
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '56px 32px 40px',
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.55)',
          }}
        >
          <div>
            <YouDecideLogo height={24} />
            <div style={{ marginTop: '16px', maxWidth: '300px', lineHeight: 1.5 }}>
              Digital Growth. On Your Terms. Built with precision and care.
            </div>
          </div>
          <div>
            <b style={{ color: '#FFFFFF', display: 'block', marginBottom: '12px' }}>Services</b>
            <div style={{ marginBottom: '8px' }}>Websites</div>
            <div style={{ marginBottom: '8px' }}>Automation</div>
            <div>Analytics</div>
          </div>
          <div>
            <b style={{ color: '#FFFFFF', display: 'block', marginBottom: '12px' }}>Studio</b>
            <div style={{ marginBottom: '8px' }}>How It Works</div>
            <div style={{ marginBottom: '8px' }}>Briefing</div>
            <div>Contact</div>
          </div>
          <div>
            <b style={{ color: '#FFFFFF', display: 'block', marginBottom: '12px' }}>Deploy</b>
            <div style={{ marginBottom: '8px' }}>Official Launch: 25 Nov 2026</div>
            <div>© 2026 youdecide.studio</div>
          </div>
        </footer>

        {/* ========================================================================= */}
        {/* GLIMMERVALE NIGHT MEADOW AT EXACT BOTTOM                                 */}
        {/* ========================================================================= */}
        <section
          aria-label="Meadow Landscape"
          style={{
            position: 'relative',
            width: '100%',
            height: '560px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '24px',
          }}
        >
          {/* GlimmerVale 3D night meadow with grass floor, lavender flowers, and fireflies */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'auto',
            }}
          >
            <GlimmerVale
              scene="aurora"
              speed={24}
              density={36}
              sparkle={75}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Smooth top gradient fade so the dark page flows seamlessly into the meadow landscape */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '140px',
              background:
                'linear-gradient(to bottom, #040711 0%, rgba(4, 7, 17, 0.75) 45%, transparent 100%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        </section>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        /* ══════════════════════════════════════════════════════════════
           RESPONSIVE TYPOGRAPHY SYSTEM (Instrument Serif & Geist Sans)
           ══════════════════════════════════════════════════════════════ */

        /* Main Hero Headline — Instrument Serif Italic */
        .hero-headline {
          font-family: 'Instrument Serif', Georgia, serif !important;
          font-style: italic !important;
          font-weight: 400 !important;
          line-height: 1.05 !important;
          color: #FFFFFF !important;
          margin: 0 0 16px !important;
          letter-spacing: -0.01em !important;
          text-align: center !important;
          white-space: nowrap !important;
          max-width: 100% !important;
        }

        /* 320–374px (Small mobile): 36px */
        @media (max-width: 374px) {
          .hero-headline {
            font-size: 36px !important;
            white-space: normal !important;
          }
        }
        /* 375–479px (Mobile): 40px */
        @media (min-width: 375px) and (max-width: 479px) {
          .hero-headline {
            font-size: 40px !important;
          }
        }
        /* 480–767px (Large mobile): 44px */
        @media (min-width: 480px) and (max-width: 767px) {
          .hero-headline {
            font-size: 44px !important;
          }
        }
        /* 768–1023px (Tablet): 50px */
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-headline {
            font-size: 50px !important;
          }
        }
        /* 1024–1439px (Small desktop): 56px */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .hero-headline {
            font-size: 56px !important;
          }
        }
        /* 1440px+ (Large desktop): 64px */
        @media (min-width: 1440px) {
          .hero-headline {
            font-size: 64px !important;
          }
        }

        /* Eyebrow — Geist Sans (Weight: 500, Letter spacing: ~0.08em) */
        .hero-eyebrow {
          font-family: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
          font-weight: 500 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          color: rgba(255, 255, 255, 0.78) !important;
          font-size: 10px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 5px 14px !important;
          background: rgba(255, 255, 255, 0.06) !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          border-radius: 999px !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          margin-bottom: 16px !important;
        }
        @media (min-width: 768px) {
          .hero-eyebrow {
            font-size: 11px !important;
          }
        }

        /* Supporting Headline — Geist Sans (Weight: 500, Line-height: 1.35) */
        .hero-subhead {
          font-family: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
          font-weight: 500 !important;
          line-height: 1.35 !important;
          color: #FFFFFF !important;
          margin: 0 0 14px !important;
          font-size: 16px !important;
          letter-spacing: -0.01em !important;
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-subhead {
            font-size: 18px !important;
          }
        }
        @media (min-width: 1024px) {
          .hero-subhead {
            font-size: 20px !important;
          }
        }

        /* Description — Geist Sans (Weight: 400, Line-height: 1.6, Max width: ~520px) */
        .hero-desc {
          font-family: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
          font-weight: 400 !important;
          line-height: 1.6 !important;
          color: rgba(255, 255, 255, 0.72) !important;
          font-size: 13px !important;
          max-width: 520px !important;
          margin: 0 auto 28px !important;
          letter-spacing: -0.005em !important;
        }
        @media (min-width: 768px) {
          .hero-desc {
            font-size: 14px !important;
          }
        }

        /* CTA Buttons — Geist Sans (Weight: 500, Font size: 12px mobile & desktop, min 44px touch target) */
        .hero-cta-btn-primary {
          font-family: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          background: #FFFFFF !important;
          color: #040711 !important;
          padding: 12px 24px !important;
          border-radius: 999px !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          min-height: 44px !important;
          box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2) !important;
          transition: all 0.2s ease !important;
          touch-action: manipulation !important;
        }
        .hero-cta-btn-primary:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 24px rgba(255, 255, 255, 0.3) !important;
        }

        .hero-cta-btn-secondary {
          font-family: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: #FFFFFF !important;
          padding: 12px 22px !important;
          border-radius: 999px !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-height: 44px !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          transition: all 0.2s ease !important;
          touch-action: manipulation !important;
        }
        .hero-cta-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: rgba(255, 255, 255, 0.35) !important;
          transform: translateY(-1px) !important;
        }
      `}</style>
    </>
  );
};

export default YouDecideLocal;
