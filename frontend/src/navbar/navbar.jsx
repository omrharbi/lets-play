import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import { isAdmin } from '../jwt/jwt';
import './navbar.css'; // Import the CSS file

export default function Navbar() {
  const [ddOpen, setDdOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount } = useCart();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setDdOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'My listings', path: '/my-listings' },
  ];

  // Debug log
  console.log(isAdmin(), "--------------");

  return (
    <nav className="nav">
      <Link to="/" className="logo">
        ShopPlay
      </Link>

      <div className="links">
        {navLinks.map((l) => (
          <Link
            key={l.path}
            to={l.path}
            className={`nav-link ${isActive(l.path) ? 'active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="right">
        {/* Cart Button */}
        <div className="cart-btn" onClick={() => navigate('/cart')}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888780"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {totalCount > 0 && (
            <div className="cart-badge">
              {totalCount > 99 ? '99+' : totalCount}
            </div>
          )}
        </div>

        {/* Guest View */}
        {!token ? (
          <div className="auth-row">
            <Link to="/login" className="btn-login">
              Login
            </Link>
            <Link to="/register" className="btn-register">
              Register
            </Link>
          </div>
        ) : (
          /* Logged In View */
          <div className="avatar-btn" onClick={() => setDdOpen(!ddOpen)}>
            <div className="avatar">{initials}</div>
            <div className="avatar-name">
              {user.name?.split(' ')[0] || 'User'}
            </div>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888780"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>

            {ddOpen && (
              <div
                className="dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="dd-header">
                  <div className="dd-name">{user.name}</div>
                  <div className="dd-email">{user.email}</div>
                </div>

                <Link
                  to="/profile"
                  className="dd-item"
                  onClick={() => setDdOpen(false)}
                >
                  👤 Profile
                </Link>
                <Link
                  to="/my-products"
                  className="dd-item"
                  onClick={() => setDdOpen(false)}
                >
                  📦 My products
                </Link>
                <Link
                  to="/add-product"
                  className="dd-item"
                  onClick={() => setDdOpen(false)}
                >
                  ➕ Add product
                </Link>
                <Link
                  to="/settings"
                  className="dd-item"
                  onClick={() => setDdOpen(false)}
                >
                  ⚙️ Settings
                </Link>

                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="dd-item accent"
                    onClick={() => setDdOpen(false)}
                  >
                    🛡 Admin panel
                  </Link>
                )}

                <div className="dd-sep" />
                <div className="dd-logout" onClick={handleLogout}>
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}