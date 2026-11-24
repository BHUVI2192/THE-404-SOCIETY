import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const isOpen = type !== null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(2, 5, 14, 0.86)',
            backdropFilter: 'blur(12px)',
          }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            backgroundColor: '#090D1A',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '88vh',
            overflowY: 'auto',
            padding: 'clamp(28px, 4vh, 44px)',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.8)',
            boxSizing: 'border-box',
            color: '#FFFFFF',
            zIndex: 1,
            textAlign: 'left',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close legal modal"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>

          {type === 'terms' ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#60A5FA',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                <FileText size={14} />
                <span>Commercial Terms &amp; Milestone Framework</span>
              </div>
              <h2
                style={{
                  fontFamily: '"Instrument Serif", serif',
                  fontStyle: 'italic',
                  fontSize: '32px',
                  margin: '0 0 16px',
                  color: '#FFFFFF',
                }}
              >
                Terms of Engagement
              </h2>
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.72)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <p>
                  <strong>1. Zero Advance Retainer:</strong> YouDecide Studio engages on a collaborative sprint model. Initial discovery, architectural planning, and milestone prototype builds proceed without mandatory upfront retainers.
                </p>
                <p>
                  <strong>2. Milestone Review &amp; Valuation:</strong> Sprints are demonstrated through functional, deployed staging links. Clients evaluate the work against the agreed scope and determine the final valuation for the milestone.
                </p>
                <p>
                  <strong>3. Full Intellectual Property Transfer:</strong> Upon milestone completion, 100% of the custom source code, Git repositories, deployment configurations, and graphic assets are irrevocably assigned and transferred to the client.
                </p>
                <p>
                  <strong>4. Mutual Good Faith:</strong> Both parties agree to communicate transparently regarding scope, deadlines, and requirements. If a sprint does not meet expectations, neither party is burdened with speculative legal lock-ins.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#60A5FA',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                <Shield size={14} />
                <span>Privacy &amp; Data Protection</span>
              </div>
              <h2
                style={{
                  fontFamily: '"Instrument Serif", serif',
                  fontStyle: 'italic',
                  fontSize: '32px',
                  margin: '0 0 16px',
                  color: '#FFFFFF',
                }}
              >
                Privacy Policy
              </h2>
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.72)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <p>
                  <strong>1. Information Collection:</strong> When you schedule a discovery call or email us, we collect your name, email address, company name, and project scope details solely for evaluating and responding to your inquiry.
                </p>
                <p>
                  <strong>2. Zero Data Selling:</strong> We will never sell, lease, or distribute your personal or commercial information to third-party advertisers, data brokers, or marketing lists.
                </p>
                <p>
                  <strong>3. Data Security:</strong> Inquiries are transmitted over encrypted TLS connections directly to our private studio inbox (`youdecide.std@gmail.com`) and secured database instances.
                </p>
                <p>
                  <strong>4. Right of Deletion:</strong> You may at any time request the complete deletion of your submitted inquiries or correspondence by emailing us at <code>youdecide.std@gmail.com</code>.
                </p>
              </div>
            </div>
          )}

          <div style={{ marginTop: '32px', textAlign: 'right' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                background: '#1920F0',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Understood
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LegalModal;

