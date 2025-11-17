import { Link } from 'react-router-dom';
import { paths } from '../../routes/paths';
import type { ReactNode } from 'react';


interface ProfileEditorLinkProps {
  children: ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

/**
 * Componente reutilizável que navega para a página de edição de perfil.
 * O componente EditProfile detecta automaticamente o tipo de perfil do usuário
 * e renderiza o formulário apropriado.
 */
export const ProfileEditorLink = ({ 
  children, 
  className, 
  title = 'Editar perfil',
  onClick 
}: ProfileEditorLinkProps) => {
  return (
    <Link
      to={paths.editProfile}
      className={className}
      onClick={onClick}
      title={title}
    >
      {children}
    </Link>
  );
};

