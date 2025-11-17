import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ProfileEditor } from '../../components/profile/ProfileEditor';
import { paths } from '../../routes/paths';

export const EditProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={paths.login} replace />;
  }

  return (
    <ProfileEditor 
      onCancel={() => navigate(paths.dashboard)}
    />
  );
};

