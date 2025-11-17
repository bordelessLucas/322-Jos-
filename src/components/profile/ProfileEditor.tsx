import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile } from '../../services/profileService';
import { EditFarmProfile } from '../../pages/EditProfile/EditFarmProfile';
import { EditOperatorProfile } from '../../pages/EditProfile/EditOperatorProfile';
import { EditConsultantProfile } from '../../pages/EditProfile/EditConsultantProfile';
import type { AccountType } from '../../types/profile';
import { Layout } from '../layout/Layout/Layout';

interface ProfileEditorProps {
  onCancel?: () => void;
  className?: string;
}

export const ProfileEditor = ({ onCancel, className }: ProfileEditorProps) => {
  const { user, loading: authLoading } = useAuth();
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid || authLoading) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setAccountType(profile.accountType);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className={className} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div>Carregando perfil...</div>
      </div>
    );
  }

  if (!user || !accountType) {
    return (
      <div className={className} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <p>Perfil não encontrado.</p>
        {onCancel && (
          <button onClick={onCancel}>
            Voltar
          </button>
        )}
      </div>
    );
  }

  // Renderiza o formulário de edição apropriado baseado no tipo de conta
  switch (accountType) {
    case 'farm':
      return (
        <Layout>
          <div className={className}>
            <EditFarmProfile />
          </div>
        </Layout>
      );
    case 'operator':
      return (
        <Layout>
        <div className={className}>
          <EditOperatorProfile />
        </div>
        </Layout>
      );
    case 'consultant':
      return (
        <Layout>
        <div className={className}>
          <EditConsultantProfile />
        </div>
        </Layout>
      );
    default:
      return (
        <Layout>
        <div className={className} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '2rem',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <p>Tipo de perfil não reconhecido.</p>
          {onCancel && (
            <button onClick={onCancel}>
              Voltar
            </button>
          )}
        </div>
        </Layout>
      );
  }
};

