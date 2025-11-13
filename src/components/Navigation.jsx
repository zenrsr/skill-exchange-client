import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/matches', label: 'Matches' },
  { path: '/my-sessions', label: 'My Sessions' },
  { path: '/messages', label: 'Messages' },
  { path: '/profile', label: 'Profile' },
];

const Navigation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-nav">
      <div className="app-nav__logo">Skill Exchange</div>
      <nav className="app-nav__links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="app-nav__user">
        <div>
          <p className="app-nav__user-name">{user?.name}</p>
          <p className="app-nav__user-email">{user?.email}</p>
        </div>
        <button className="btn btn--ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navigation;
