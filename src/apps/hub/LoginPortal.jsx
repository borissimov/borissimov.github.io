import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Lock, Mail, Loader2, ShieldAlert, ShieldCheck, Fingerprint } from 'lucide-react';
import './HubApp.css';

export const LoginPortal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="hub-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'hidden' }}>
            <div className="hub-glow-orange" style={{ width: '60%', height: '60%', top: '-20%', left: '-20%', opacity: 0.15 }}></div>
            <div className="hub-glow-blue" style={{ width: '60%', height: '60%', bottom: '-20%', right: '-20%', opacity: 0.1 }}></div>
            
            <div className="animate-in fade-in zoom-in duration-700" style={{ maxWidth: '400px', width: '100%', position: 'relative', zIndex: 10 }}>
                {/* Visual Anchor: Shield Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-30px', position: 'relative', zIndex: 20 }}>
                    <div style={{ backgroundColor: '#000', padding: '20px', borderRadius: '50%', border: '1px solid rgba(242, 155, 17, 0.3)', boxShadow: '0 0 40px rgba(242, 155, 17, 0.2)' }}>
                        <ShieldCheck size={40} color="#f29b11" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="premium-card" style={{ 
                    padding: '60px 30px 40px', 
                    textAlign: 'center', 
                    backgroundColor: 'rgba(10, 10, 10, 0.8)', 
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
                }}>
                    <header style={{ marginBottom: '40px' }}>
                        <h1 className="hub-title" style={{ fontSize: '28px', marginBottom: '8px', letterSpacing: '-1px' }}>
                            MASTER <span>PLAN</span>
                        </h1>
                        <div style={{ height: '1px', width: '40px', backgroundColor: '#f29b11', margin: '0 auto 15px', opacity: 0.5 }}></div>
                        <p style={{ fontSize: '9px', fontWeight: '900', color: '#666', textTransform: 'uppercase', letterSpacing: '3px' }}>
                            Encrypted Neural Link
                        </p>
                    </header>

                    {error && (
                        <div className="animate-in slide-in-from-top-2 duration-300" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '15px', marginBottom: '30px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <ShieldAlert size={20} color="#ef4444" />
                            <p style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold', textAlign: 'left', margin: 0, lineHeight: 1.4 }}>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '10px', fontWeight: '900', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Mail size={12} color="#f29b11" /> Athlete ID
                            </label>
                            <input 
                                type="email" 
                                className="premium-input" 
                                style={{ 
                                    fontSize: '15px', 
                                    textAlign: 'left', 
                                    height: '54px', 
                                    padding: '0 20px', 
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="athlete@masterplan.io"
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '10px', fontWeight: '900', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Lock size={12} color="#f29b11" /> Security Phrase
                            </label>
                            <input 
                                type="password" 
                                className="premium-input" 
                                style={{ 
                                    fontSize: '15px', 
                                    textAlign: 'left', 
                                    height: '54px', 
                                    padding: '0 20px', 
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="premium-btn-primary" 
                            style={{ 
                                marginTop: '15px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '12px',
                                height: '60px',
                                borderRadius: '16px',
                                boxShadow: '0 10px 30px rgba(242, 155, 17, 0.2)'
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <Fingerprint size={20} />
                                    <span>INITIALIZE SYSTEM</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                        <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255,255,255,0.03)' }}></div>
                        <p style={{ fontSize: '8px', fontWeight: '900', color: '#222', textTransform: 'uppercase', letterSpacing: '5px', margin: 0 }}>
                            MASTER PLAN CORE V2.1
                        </p>
                        <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255,255,255,0.03)' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};