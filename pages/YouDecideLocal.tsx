import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import GlimmerVale from '../components/GlimmerVale';

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

type SceneType = 'aurora' | 'dunes' | 'mountain';

const SCENE_OPTIONS: { id: SceneType; label: string; icon: string }[] = [
  { id: 'aurora', label: 'Lavender Aurora', icon: '🌌' },
  { id: 'dunes', label: 'Dusk Dunes', icon: '🌅' },
  { id: 'mountain', label: 'Moonlit Mountains', icon: '🏔️' },
];

const SERVICES = [
  {
    title: 'Websites',
    desc: 'Fast, clear, responsive sites that turn visitors into partners and enquiries.',
    tag: 'Design & Code',
  },
  {
    title: 'Business Automation',
    desc: 'Remove the manual, repetitive friction from your team’s weekly workflows.',
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
    desc: 'A practical, grounded roadmap executed sprint by sprint.',
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
  const [activeScene, setActiveScene] = useState<SceneType>('aurora');
  const [sliderVal, setSliderVal] = useState<number>(65);

  const calculatePerceivedValue = (val: number) => {
    if (val < 25) return 'Sprint Prototype';
    if (val < 50) return 'Custom MVP & Launch';
    if (val < 75) return 'Full Stack Automation & Web';
    return 'Enterprise Transformation';
  };

  return (
    <>
      <Helmet>
        <title>youdecide.studio · Glimmervale Edition</title>
        <meta
          name="description"
          content="Design Beyond the Surface. youdecide.studio website preview."
        />
        {/* Load Michroma for the signature wide display headline, plus Geist & Geist Mono */}
        <link
          href="https://fonts.googleapis.com/css2?family=Michroma&family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div
        style={{
          backgroundColor: '#040711',
          color: '#FFFFFF',
          minHeight: '100vh',
          fontFamily: 'Geist, -apple-system, sans-serif',
          overflowX: 'hidden',
        }}
      >
        {/* ========================================================================= */}
        {/* HERO SECTION WITH GLIMMERVALE WEBGL SHADER BACKGROUND */}
        {/* ========================================================================= */}
        <section
          style={{
            position: 'relative',
            height: '100vh',
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
              scene={activeScene}
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

          {/* ── HEADER (Logo Only) ── */}
          <header
            style={{
              position: 'relative',
              zIndex: 20,
              maxWidth: '1280px',
              width: '100%',
              margin: '0 auto',
              padding: '36px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <YouDecideLogo height={32} />
          </header>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE VALUE SLIDER SECTION */}
        {/* ========================================================================= */}
        <section
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
              <button
                type="submit"
                style={{
                  background: '#FFFFFF',
                  color: '#0A0B38',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Geist, sans-serif',
                  marginTop: '4px',
                  transition: 'opacity 0.2s',
                }}
              >
                Submit Project Brief →
              </button>
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
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>
    </>
  );
};

export default YouDecideLocal;
