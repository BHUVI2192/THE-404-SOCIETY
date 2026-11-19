import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BuilderPortal: React.FC = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <>
      <Helmet>
        <title>Builder Portal · The 404 Society</title>
        <meta
          name="description"
          content="The 404 Society Builder Portal: Interactive roadmaps, learning trees, curated engineering resources, and personal track checklists."
        />
      </Helmet>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: '#0a0a0c',
          overflow: 'hidden',
        }}
      >
        {/* Floating return pill */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '18px',
            zIndex: 10000,
            pointerEvents: 'auto',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.85)',
              background: 'rgba(20, 20, 26, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(32, 32, 42, 0.95)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
              e.currentTarget.style.background = 'rgba(20, 20, 26, 0.75)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <ArrowLeft size={13} strokeWidth={2.4} />
            <span>Return to 404 Society</span>
          </Link>
        </div>

        {/* Loading placeholder */}
        {!iframeLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px',
              color: '#888',
              fontSize: '13px',
              fontFamily: 'Montserrat, system-ui, sans-serif',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: '#6366f1',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span>Loading Builder Portal...</span>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Standalone Builder Portal Application */}
        <iframe
          src="/builderportal/index.html"
          title="The 404 Society Builder Portal"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            opacity: iframeLoaded ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
          onLoad={() => setIframeLoaded(true)}
        />
      </div>
    </>
  );
};

export default BuilderPortal;
