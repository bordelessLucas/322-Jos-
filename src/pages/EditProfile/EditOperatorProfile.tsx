import { type FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiMapPin, FiUser, FiHash, FiAward, FiBriefcase, FiInfo } from 'react-icons/fi';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, updateUserProfile } from '../../services/profileService';
import { maskCPF, maskPhone, maskCEP } from '../../utils/masks';
import type { OperatorProfile } from '../../types/profile';
import './EditProfile.css';

export const EditOperatorProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<OperatorProfile>>({
    fullName: '',
    email: '',
    phone: '',
    region: '',
    cpf: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    specialties: [],
    certifications: [],
    experience: '',
    description: '',
    availableForHire: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;

      try {
        setLoadingProfile(true);
        const profile = await getUserProfile(user.uid);
        
        if (profile && profile.accountType === 'operator') {
          setFormData({
            fullName: profile.fullName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            region: profile.region || '',
            cpf: profile.cpf || '',
            dateOfBirth: profile.dateOfBirth || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            zipCode: profile.zipCode || '',
            specialties: profile.specialties || [],
            certifications: profile.certifications || [],
            experience: profile.experience || '',
            description: profile.description || '',
            availableForHire: profile.availableForHire || false,
          });
        }
      } catch (err: any) {
        setError('Erro ao carregar perfil. Tente novamente.');
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.uid) return;

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await updateUserProfile(user.uid, {
        ...formData,
        accountType: 'operator',
      } as OperatorProfile);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError('Erro ao salvar perfil. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayFieldChange = (field: 'specialties' | 'certifications', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: items });
  };

  if (loadingProfile) {
    return (
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <header className="edit-profile-header">
          <h1>Editar Perfil - Operador</h1>
          <p>Atualize suas informações profissionais</p>
        </header>

        {error && (
          <div className="edit-profile-error">
            {error}
          </div>
        )}

        {success && (
          <div className="edit-profile-success">
            Perfil atualizado com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <section className="form-section">
            <h2>Informações Pessoais</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">Nome Completo *</label>
              <div className="input-wrapper">
                <FiUser />
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF *</label>
              <div className="input-wrapper">
                <FiHash />
                <input
                  id="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                  required
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateOfBirth">Data de Nascimento</label>
                <div className="input-wrapper">
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail *</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefone/WhatsApp</label>
              <div className="input-wrapper">
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Localização</h2>

            <div className="form-group">
              <label htmlFor="region">Região de Atuação</label>
              <div className="input-wrapper">
                <FiMapPin />
                <select
                  id="region"
                  value={formData.region || ''}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                >
                  <option value="">Selecione uma região</option>
                  <option value="centro-oeste">Centro-Oeste</option>
                  <option value="sudeste">Sudeste</option>
                  <option value="sul">Sul</option>
                  <option value="nordeste">Nordeste</option>
                  <option value="norte">Norte</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Endereço</label>
              <div className="input-wrapper">
                <FiMapPin />
                <input
                  id="address"
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua, número, complemento"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Cidade</label>
                <div className="input-wrapper">
                  <input
                    id="city"
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Cidade"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="state">Estado</label>
                <div className="input-wrapper">
                  <input
                    id="state"
                    type="text"
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">CEP</label>
                <div className="input-wrapper">
                  <input
                    id="zipCode"
                    type="text"
                    value={formData.zipCode || ''}
                    onChange={(e) => setFormData({ ...formData, zipCode: maskCEP(e.target.value) })}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Informações Profissionais</h2>

            <div className="form-group">
              <label htmlFor="specialties">Especialidades</label>
              <div className="input-wrapper">
                <FiBriefcase />
                <input
                  id="specialties"
                  type="text"
                  value={formData.specialties?.join(', ') || ''}
                  onChange={(e) => handleArrayFieldChange('specialties', e.target.value)}
                  placeholder="Colheita, Plantio, Pulverização (separadas por vírgula)"
                />
              </div>
              <small>Separe as especialidades por vírgula</small>
            </div>

            <div className="form-group">
              <label htmlFor="certifications">Certificações</label>
              <div className="input-wrapper">
                <FiAward />
                <input
                  id="certifications"
                  type="text"
                  value={formData.certifications?.join(', ') || ''}
                  onChange={(e) => handleArrayFieldChange('certifications', e.target.value)}
                  placeholder="Certificação A, Certificação B (separadas por vírgula)"
                />
              </div>
              <small>Separe as certificações por vírgula</small>
            </div>

            <div className="form-group">
              <label htmlFor="experience">Anos de Experiência</label>
              <div className="input-wrapper">
                <input
                  id="experience"
                  type="text"
                  value={formData.experience || ''}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Ex: 5 anos"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição Profissional</label>
              <div className="input-wrapper">
                <FiInfo />
                <textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva sua experiência, habilidades e histórico profissional"
                  rows={4}
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.availableForHire || false}
                  onChange={(e) => setFormData({ ...formData, availableForHire: e.target.checked })}
                />
                <span>Disponível para contratação</span>
              </label>
            </div>
          </section>

          <div className="form-actions">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" leftIcon={<FiSave />} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

