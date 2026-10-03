import { useState } from 'react';
import { X, Lock, Mail, User, CheckCircle2 } from 'lucide-react';
import './Modals.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="auth-success-state">
            <CheckCircle2 size={54} className="success-icon" />
            <h3>{isSignUp ? 'Welcome to CryptoPlace!' : 'Welcome Back!'}</h3>
            <p>You have successfully {isSignUp ? 'created your account' : 'signed in'}.</p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
              <p>Explore real-time cryptocurrency markets and build your portfolio.</p>
            </div>

            <div className="auth-tabs">
              <button
                className={`auth-tab ${isSignUp ? 'active' : ''}`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
              <button
                className={`auth-tab ${!isSignUp ? 'active' : ''}`}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {isSignUp && (
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                {isSignUp ? 'Create Free Account' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer-text">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <span onClick={() => setIsSignUp(false)}>Sign In</span>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <span onClick={() => setIsSignUp(true)}>Sign Up</span>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

