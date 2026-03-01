import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

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
            setError('Incorrect password');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 selection:bg-white selection:text-black">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black opacity-60 z-0 pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                {/* Card Container */}
                <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-900/50 rounded-2xl p-8 shadow-[0_0_60px_-15px_rgba(255,255,255,0.05)]">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                            <Lock className="w-8 h-8 text-black" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Gateway</h1>
                        <p className="text-zinc-400 text-sm">Enter the passphrase to proceed</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Passphrase"
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
                                    required
                                />
                            </div>
                            {error && (
                                <p className="text-red-400 text-sm pl-1 animate-in slide-in-from-top-1 fade-in duration-200">
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white text-black font-semibold rounded-xl px-4 py-4 flex items-center justify-center group hover:bg-zinc-200 transition-colors"
                        >
                            <span>Authenticate</span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-zinc-500 hover:text-white transition-colors text-sm underline-offset-4 hover:underline"
                        >
                            Return to public site
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
