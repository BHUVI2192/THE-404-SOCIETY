import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { AnimatedLiquidBackground } from '../../components/admin/AnimatedLiquidBackground';

export const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminSecret = import.meta.env.VITE_ADMIN_SECRET || 'admin123';
        if (password === adminSecret) {
            localStorage.setItem('adminAuth', 'true');
            localStorage.setItem('adminAuthTime', Date.now().toString());
            navigate('/admin');
        } else {
            setError('Incorrect security passphrase');
        }
    };

    return (
        <div
            className="min-h-screen relative flex items-center justify-center p-4 selection:bg-black selection:text-white"
            style={{
                fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
                background: '#fafafa',
                color: '#09090b',
            }}
        >
            {/* Framer WebGL Animated Liquid Ambient Background */}
            <AnimatedLiquidBackground />

            {/* Subtle ambient light gradient mesh */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.8) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(240, 240, 245, 0.6) 0%, transparent 50%)',
                    zIndex: 1,
                }}
            />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md">
                <div
                    style={{
                        background: 'rgba(255, 255, 255, 0.86)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: '20px',
                        padding: '36px 32px',
                        boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.03)',
                    }}
                >
                    {/* Brand & Badge */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: '#000000',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '18px',
                                boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.25)',
                            }}
                        >
                            <Lock className="w-6 h-6" strokeWidth={2.2} />
                        </div>

                        <div
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: '10.5px',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                color: '#71717a',
                                fontWeight: 700,
                                marginBottom: '6px',
                            }}
                        >
                            The 404 Society — Secure Admin
                        </div>
                        <h1
                            style={{
                                fontSize: '26px',
                                fontWeight: 800,
                                color: '#000000',
                                letterSpacing: '-0.03em',
                                margin: 0,
                                lineHeight: 1.2,
                            }}
                        >
                            Admin Gateway
                        </h1>
                        <p
                            style={{
                                fontSize: '13.5px',
                                color: '#52525b',
                                marginTop: '6px',
                            }}
                        >
                            Enter your master passphrase to access management
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    color: '#52525b',
                                    display: 'block',
                                    marginBottom: '8px',
                                }}
                            >
                                Passphrase
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                placeholder="••••••••••••"
                                autoFocus
                                required
                                style={{
                                    width: '100%',
                                    padding: '13px 16px',
                                    fontSize: '14px',
                                    fontFamily: "'Space Mono', monospace",
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    color: '#000000',
                                    border: error ? '1px solid #ef4444' : '1px solid rgba(0, 0, 0, 0.12)',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = '#000000')}
                                onBlur={(e) => (e.target.style.borderColor = error ? '#ef4444' : 'rgba(0, 0, 0, 0.12)')}
                            />
                            {error && (
                                <p
                                    style={{
                                        color: '#ef4444',
                                        fontSize: '12.5px',
                                        fontWeight: 600,
                                        marginTop: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    <span>⚠</span> {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '13px 18px',
                                borderRadius: '12px',
                                background: '#000000',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                boxShadow: '0 4px 14px -3px rgba(0, 0, 0, 0.25)',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                                (e.currentTarget as HTMLButtonElement).style.background = '#27272a';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLButtonElement).style.background = '#000000';
                            }}
                        >
                            <span>Authenticate</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Footer link */}
                    <div className="mt-8 text-center pt-5 border-t border-black/5">
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#71717a',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#000000')}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#71717a')}
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Return to public site
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
