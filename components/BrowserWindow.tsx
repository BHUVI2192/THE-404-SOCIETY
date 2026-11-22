// Interactive Browser Window Component
// Inspired by Framer BrowserWindow (https://framer.com/m/BrowserWindow-ZKKW.js@FwHQ44KHrEOb7hrqjQhF)
// Features responsive macOS Desktop Web Browser and iPhone Mobile Browser with live interactive iframe

import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  RotateCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Globe,
  Wifi,
} from 'lucide-react';

export interface BrowserWindowProps {
  url: string;
  name: string;
  id?: string;
  fallbackLogo?: string;
  initialMode?: 'desktop' | 'mobile';
  className?: string;
  style?: React.CSSProperties;
}

export const BrowserWindow: React.FC<BrowserWindowProps> = ({
  url,
  name,
  id,
  fallbackLogo,
  initialMode,
  className = '',
  style = {},
}) => {
  const [isWindowMobile, setIsWindowMobile] = useState<boolean>(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [iframeBlocked, setIframeBlocked] = useState<boolean>(false);

  // Auto-detect mobile viewport on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsWindowMobile(mobile);
      if (initialMode) {
        setDeviceMode(initialMode);
      } else {
        setDeviceMode(mobile ? 'mobile' : 'desktop');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [initialMode]);

  // Sites with known X-Frame-Options: SAMEORIGIN
  useEffect(() => {
    if (id === 'parivarthana' || url.includes('parivarthana')) {
      setIframeBlocked(true);
      setIsLoading(false);
    } else {
      setIframeBlocked(false);
      setIsLoading(true);
    }
  }, [id, url, reloadKey]);

  // Extract clean domain for address bar (e.g. nike-vision.vercel.app)
  const displayDomain = React.useMemo(() => {
    try {
      const parsed = new URL(url);
      return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
    } catch {
      return url.replace(/^https?:\/\//, '');
    }
  }, [url]);

  const handleReload = () => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const activeMode = isWindowMobile ? 'mobile' : deviceMode;

  return (
    <div
      className={`interactive-browser-wrapper ${className}`}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        ...style,
      }}
    >
      {/* ── DESKTOP/MOBILE SWITCHER BAR (Visible on screens > 768px) ── */}
      {!isWindowMobile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: activeMode === 'mobile' ? '390px' : '1240px',
            marginBottom: '16px',
            transition: 'max-width 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Device toggle pills */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '4px',
              gap: '4px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              aria-label="Desktop browser view"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                border: 'none',
                background:
                  activeMode === 'desktop' ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                color: activeMode === 'desktop' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)',
                fontFamily: '"Geist Mono", monospace',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Monitor size={14} />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              aria-label="Mobile browser view"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                border: 'none',
                background:
                  activeMode === 'mobile' ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                color: activeMode === 'mobile' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)',
                fontFamily: '"Geist Mono", monospace',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
          </div>

          {/* Quick open in new tab action */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'rgba(255, 255, 255, 0.65)',
              textDecoration: 'none',
              fontFamily: '"Geist Mono", monospace',
              fontSize: '12px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
          >
            <span>Open live website</span>
            <ExternalLink size={13} />
          </a>
        </div>
      )}

      {/* ── BROWSER CONTAINER ── */}
      {activeMode === 'desktop' ? (
        /* ══════════════════════════════════════════════════════════
           DESKTOP BROWSER WINDOW MOCKUP (macOS / Safari Dark)
           ══════════════════════════════════════════════════════════ */
        <div
          style={{
            width: '100%',
            maxWidth: '1240px',
            height: 'clamp(560px, 76vh, 840px)',
            backgroundColor: '#1E1E22',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow:
              '0 32px 80px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06)',
            position: 'relative',
          }}
        >
          {/* macOS Title & Controls Bar */}
          <div
            style={{
              height: '48px',
              backgroundColor: '#18181B',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 18px',
              gap: '16px',
              userSelect: 'none',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* macOS Traffic Lights */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#FF5F56',
                  boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.2) inset',
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#FFBD2E',
                  boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.2) inset',
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#27C93F',
                  boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.2) inset',
                }}
              />
            </div>

            {/* Back / Forward / Reload Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'rgba(255, 255, 255, 0.45)',
              }}
            >
              <button
                type="button"
                aria-label="Back"
                disabled
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 0.4,
                  cursor: 'default',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Forward"
                disabled
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 0.4,
                  cursor: 'default',
                }}
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={handleReload}
                aria-label="Reload website"
                title="Reload website"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)';
                }}
              >
                <RotateCw size={14} />
              </button>
            </div>

            {/* Address / URL Bar */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                onClick={handleOpenExternal}
                title="Open website in new tab"
                style={{
                  maxWidth: '560px',
                  width: '100%',
                  height: '30px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <Lock size={12} style={{ color: '#10B981', flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {displayDomain}
                </span>
                <ExternalLink
                  size={12}
                  style={{ color: 'rgba(255, 255, 255, 0.4)', flexShrink: 0 }}
                />
              </div>
            </div>

            {/* Right Spacing / Live Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: '"Geist Mono", monospace',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.4)',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <span className="live-status-text">Interactive</span>
            </div>
          </div>

          {/* Top Loading Progress Bar */}
          {isLoading && !iframeBlocked && (
            <div
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: 'transparent',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #3B82F6, #60A5FA, #93C5FD)',
                  animation: 'browserLoading 1.2s infinite ease-in-out',
                }}
              />
            </div>
          )}

          {/* Browser Body / Interactive iframe Viewport */}
          <div
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: '#000000',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {iframeBlocked ? (
              /* Fallback overlay when host blocks iframe embedding */
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px',
                  textAlign: 'center',
                  backgroundColor: '#0A0A0C',
                }}
              >
                {fallbackLogo && (
                  <img
                    src={fallbackLogo}
                    alt={name}
                    style={{
                      width: '84px',
                      height: '84px',
                      objectFit: 'contain',
                      marginBottom: '20px',
                      borderRadius: '16px',
                    }}
                  />
                )}
                <h3
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '22px',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    margin: '0 0 12px',
                  }}
                >
                  {name}
                </h3>
                <p
                  style={{
                    fontFamily: '"Geist", sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.65)',
                    maxWidth: '440px',
                    lineHeight: 1.5,
                    margin: '0 0 24px',
                  }}
                >
                  This institutional domain enforces security policies that prevent direct nested
                  browser embedding. You can view the live project directly in a full window.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '13px',
                    fontWeight: 600,
                    padding: '12px 24px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'transform 0.2s, opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span>Launch {name}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <iframe
                key={reloadKey}
                src={url}
                title={name}
                onLoad={() => setIsLoading(false)}
                onError={() => setIframeBlocked(true)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#FFFFFF',
                  display: 'block',
                }}
              />
            )}
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════
           MOBILE PHONE BROWSER MOCKUP (iPhone Frame)
           ══════════════════════════════════════════════════════════ */
        <div
          style={{
            width: '100%',
            maxWidth: '380px',
            height: 'clamp(620px, 78vh, 760px)',
            backgroundColor: '#1E1E22',
            borderRadius: '48px',
            padding: '10px',
            border: '3px solid rgba(255, 255, 255, 0.18)',
            boxShadow:
              '0 32px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 0, 0, 0.8) inset, 0 12px 24px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* Inner Phone Screen */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000000',
              borderRadius: '38px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* iOS Status Bar with Dynamic Island */}
            <div
              style={{
                height: '40px',
                backgroundColor: '#18181B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                userSelect: 'none',
                flexShrink: 0,
                position: 'relative',
                zIndex: 10,
              }}
            >
              {/* iOS Time */}
              <span
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                }}
              >
                9:41
              </span>

              {/* Dynamic Island Pill */}
              <div
                style={{
                  position: 'absolute',
                  top: '7px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '96px',
                  height: '24px',
                  backgroundColor: '#000000',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '8px',
                  gap: '6px',
                  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Camera lens dot */}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                />
              </div>

              {/* Status Icons: Wifi & Battery */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#FFFFFF',
                }}
              >
                <Wifi size={13} />
                <div
                  style={{
                    width: '18px',
                    height: '9px',
                    border: '1px solid #FFFFFF',
                    borderRadius: '3px',
                    padding: '1px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '80%',
                      height: '100%',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '1px',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Safari Top URL Bar */}
            <div
              style={{
                height: '42px',
                backgroundColor: '#18181B',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                gap: '8px',
                flexShrink: 0,
                zIndex: 10,
              }}
            >
              <div
                onClick={handleOpenExternal}
                style={{
                  flex: 1,
                  height: '28px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 10px',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Lock size={11} style={{ color: '#10B981', flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '11px',
                    color: '#FFFFFF',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '180px',
                  }}
                >
                  {displayDomain}
                </span>
                <ExternalLink
                  size={10}
                  style={{ color: 'rgba(255, 255, 255, 0.4)', flexShrink: 0 }}
                />
              </div>
              <button
                type="button"
                onClick={handleReload}
                aria-label="Reload"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RotateCw size={13} />
              </button>
            </div>

            {/* Top Loading Progress Bar */}
            {isLoading && !iframeBlocked && (
              <div
                style={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: 'transparent',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #3B82F6, #60A5FA, #93C5FD)',
                    animation: 'browserLoading 1.2s infinite ease-in-out',
                  }}
                />
              </div>
            )}

            {/* Mobile Viewport iframe */}
            <div
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: '#000000',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {iframeBlocked ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#0A0A0C',
                  }}
                >
                  {fallbackLogo && (
                    <img
                      src={fallbackLogo}
                      alt={name}
                      style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'contain',
                        marginBottom: '16px',
                        borderRadius: '12px',
                      }}
                    />
                  )}
                  <h4
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: '18px',
                      fontWeight: 500,
                      color: '#FFFFFF',
                      margin: '0 0 10px',
                    }}
                  >
                    {name}
                  </h4>
                  <p
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.65)',
                      lineHeight: 1.45,
                      margin: '0 0 20px',
                    }}
                  >
                    Institutional origin policies restrict in-app mobile frames. Tap below to launch
                    directly in your browser.
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '10px 18px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Open website</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ) : (
                <iframe
                  key={reloadKey}
                  src={url}
                  title={name}
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIframeBlocked(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: '#FFFFFF',
                    display: 'block',
                  }}
                />
              )}
            </div>

            {/* iOS Bottom Home Bar */}
            <div
              style={{
                height: '24px',
                backgroundColor: '#18181B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.45)',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading animation keyframes */}
      <style>{`
        @keyframes browserLoading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @media (max-width: 600px) {
          .live-status-text {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BrowserWindow;
