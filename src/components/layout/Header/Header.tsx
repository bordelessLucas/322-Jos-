import { FiBell, FiSearch, FiUser } from 'react-icons/fi';
import { useAuth } from '../../../hooks/useAuth';
import { ProfileEditorLink } from '../../profile/ProfileEditorLink';
import './Header.css';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__search">
          <FiSearch className="header__search-icon" />
          <input
            type="text"
            placeholder="Buscar..."
            className="header__search-input"
          />
        </div>

        <div className="header__actions">
          <button className="header__action-btn" aria-label="Notificações">
            <FiBell />
            <span className="header__badge">3</span>
          </button>

          <ProfileEditorLink className="header__user" title="Editar perfil">
            <div className="header__user-avatar">
              {user?.email?.charAt(0).toUpperCase() || <FiUser />}
            </div>
            <div className="header__user-info">
              <span className="header__user-name">
                {user?.displayName || user?.email?.split('@')[0] || 'Usuário'}
              </span>
              <span className="header__user-role">Administrador</span>
            </div>
          </ProfileEditorLink>
        </div>
      </div>
    </header>
  );
};

