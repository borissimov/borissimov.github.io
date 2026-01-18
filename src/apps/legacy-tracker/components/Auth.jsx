import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    const { error, data } = result;

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      if (isSignUp && !data.session) {
        setMessage('Check your email to confirm your account!');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Master Plan</h1>
        <p className="auth-subtitle">
          {isSignUp ? 'Create your account' : 'Welcome back, athlete'}
        </p>
        
        <form onSubmit={handleAuth} className="auth-form">
          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        
        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        <div className="auth-footer">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }}
            className="auth-link"
          >
            {isSignUp ? 'Sign In' : 'Create One'}
          </button>
        </div>
      </div>
    </div>
  );
};