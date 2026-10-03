import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CoinContext } from '../../context/coinConstants';
import { ArrowUpRight, Star, Menu, X, Coins } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { currency, setCurrency, watchlist, openModal } = useContext(CoinContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* Brand / Logo */}
        <div className="logo" onClick={() => handleNavigate('/')}>
          <div className="logo-icon-wrap">
            <Coins className="logo-icon" size={26} />
            <span className="logo-glow"></span>
          </div>
          <span className="logo-text">
            Crypto<span className="logo-accent">Place</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => handleNavigate('/')}
          >
            Home
          </li>
          <li onClick={() => openModal('features')}>
            Features
          </li>
          <li
            className={location.pathname === '/history' || location.pathname === '/histroy' ? 'active' : ''}
            onClick={() => handleNavigate('/history')}
          >
            Historical Data
          </li>
          <li onClick={() => openModal('blog')}>
            Blog
          </li>
          <li className="watchlist-link" onClick={() => openModal('watchlist')}>
            <Star size={16} className="watchlist-nav-icon" fill={watchlist.length > 0 ? '#facc15' : 'none'} color={watchlist.length > 0 ? '#facc15' : 'currentColor'} />
            <span>Watchlist</span>
            {watchlist.length > 0 && (
              <span className="watchlist-badge">{watchlist.length}</span>
            )}
          </li>
        </ul>

        {/* Right Section: Currency selector, Sign Up button, Mobile Hamburger */}
        <div className="nav-right">
          <select
            value={currency.name}
            onChange={handleCurrencyChange}
            aria-label="Select Currency"
            className="currency-select"
          >
            <option value="usd">USD ($)</option>
            <option value="eur">EUR (€)</option>
            <option value="inr">INR (₹)</option>
            <option value="gbp">GBP (£)</option>
          </select>

          <button
            className="signup-btn"
            onClick={() => openModal('auth')}
          >
            <span>Sign up</span>
            <ArrowUpRight size={16} />
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="logo" onClick={() => handleNavigate('/')}>
                <Coins size={22} className="logo-icon" />
                <span className="logo-text">Crypto<span className="logo-accent">Place</span></span>
              </div>
              <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <ul className="mobile-nav-links">
              <li onClick={() => handleNavigate('/')}>Home</li>
              <li onClick={() => { openModal('features'); setMobileMenuOpen(false); }}>Features</li>
              <li onClick={() => handleNavigate('/history')}>Historical Data</li>
              <li onClick={() => { openModal('blog'); setMobileMenuOpen(false); }}>Blog</li>
              <li onClick={() => { openModal('watchlist'); setMobileMenuOpen(false); }}>
                Watchlist ({watchlist.length})
              </li>
            </ul>

            <div className="mobile-drawer-footer">
              <div className="mobile-currency-row">
                <span>Currency:</span>
                <select value={currency.name} onChange={handleCurrencyChange}>
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="inr">INR (₹)</option>
                  <option value="gbp">GBP (£)</option>
                </select>
              </div>
              <button
                className="signup-btn mobile-signup"
                onClick={() => { openModal('auth'); setMobileMenuOpen(false); }}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
