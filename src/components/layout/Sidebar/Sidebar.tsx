import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { paths } from '../../../routes/paths';
import { useLocation, useNavigate, Link} from 'react-router-dom';
import { ProfileEditorLink } from '../../profile/ProfileEditorLink';
import './Sidebar.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { path: '/operadores', label: 'Operadores', icon: <FiUsers /> },
  { path: '/fazendas', label: 'Fazendas', icon: <FiBriefcase /> },
  { path: '/configuracoes', label: 'Configurações', icon: <FiSettings /> },
  { path: '/editar-perfil', label: 'Editar Perfil', icon: <FiUsers /> },
];

export const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();

      navigate(paths.login);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <button
        className="sidebar__mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`sidebar ${isMobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">AT</div>
            <span className="sidebar__logo-text">AgroTalent</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="sidebar__nav-item">
                <Link
                  to={item.path}
                  className={`sidebar__nav-link ${isActive(item.path) ? 'sidebar__nav-link--active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="sidebar__nav-icon">{item.icon}</span>
                  <span className="sidebar__nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          {user && (
            <ProfileEditorLink
              className="sidebar__user-info"
              onClick={() => setIsMobileOpen(false)}
              title="Editar perfil"
            >
              <div className="sidebar__user-avatar">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="sidebar__user-details">
                <span className="sidebar__user-name">
                  {user.displayName || user.email?.split('@')[0] || 'Usuário'}
                </span>
                <span className="sidebar__user-email">{user.email}</span>
              </div>
            </ProfileEditorLink>
          )}
          <button className="sidebar__logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="sidebar__overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

