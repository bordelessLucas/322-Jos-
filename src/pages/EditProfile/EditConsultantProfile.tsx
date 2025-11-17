import { type FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiMapPin, FiUser, FiHash, FiAward, FiBriefcase, FiInfo, FiLink, FiHome } from 'react-icons/fi';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, updateUserProfile } from '../../services/profileService';
import { maskCPF, maskCNPJ, maskPhone, maskCEP, maskInteger } from '../../utils/masks';
import type { ConsultantProfile } from '../../types/profile';
import './EditProfile.css';

export const EditConsultantProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profileType, setProfileType] = useState<'individual' | 'company'>('individual');

  const [formData, setFormData] = useState<Partial<ConsultantProfile>>({
    fullName: '',
    email: '',
    phone: '',
    region: '',
    cpf: '',
    cnpj: '',
    companyName: '',
    crc: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    specialties: [],
    certifications: [],
    yearsOfExperience: undefined,
    description: '',
    website: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;

      try {
        setLoadingProfile(true);
        const profile = await getUserProfile(user.uid);
        
        if (profile && profile.accountType === 'consultant') {
          const hasCNPJ = !!profile.cnpj;
          setProfileType(hasCNPJ ? 'company' : 'individual');
          
          setFormData({
            fullName: profile.fullName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            region: profile.region || '',
            cpf: profile.cpf || '',
            cnpj: profile.cnpj || '',
            companyName: profile.companyName || '',
            crc: profile.crc || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            zipCode: profile.zipCode || '',
            specialties: profile.specialties || [],
            certifications: profile.certifications || [],
            yearsOfExperience: profile.yearsOfExperience,
            description: profile.description || '',
            website: profile.website || '',
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
      const updateData: Partial<ConsultantProfile> = {
        ...formData,
        accountType: 'consultant',
      };

      // Limpa campos que não se aplicam ao tipo de perfil selecionado
      if (profileType === 'individual') {
        updateData.cnpj = '';
        updateData.companyName = '';
      } else {
        updateData.cpf = '';
      }

      await updateUserProfile(user.uid, updateData as ConsultantProfile);

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
          <h1>Editar Perfil - Consultor Agronômico</h1>
          <p>Atualize suas informações profissionais e credenciais</p>
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
            <h2>Tipo de Perfil</h2>
            
            <div className="form-group">
              <div className="radio-group">
                <label className={`radio-option ${profileType === 'individual' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="profileType"
                    value="individual"
                    checked={profileType === 'individual'}
                    onChange={(e) => setProfileType(e.target.value as 'individual' | 'company')}
                  />
                  <span>Pessoa Física</span>
                </label>
                <label className={`radio-option ${profileType === 'company' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="profileType"
                    value="company"
                    checked={profileType === 'company'}
                    onChange={(e) => setProfileType(e.target.value as 'individual' | 'company')}
                  />
                  <span>Pessoa Jurídica</span>
                </label>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Informações {profileType === 'individual' ? 'Pessoais' : 'da Empresa'}</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">
                {profileType === 'individual' ? 'Nome Completo *' : 'Razão Social *'}
              </label>
              <div className="input-wrapper">
                <FiUser />
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder={profileType === 'individual' ? 'Seu nome completo' : 'Razão social da empresa'}
                />
              </div>
            </div>

            {profileType === 'individual' ? (
              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <div className="input-wrapper">
                  <FiHash />
                  <input
                    id="cpf"
                    type="text"
                    value={formData.cpf || ''}
                    onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="cnpj">CNPJ *</label>
                  <div className="input-wrapper">
                    <FiHash />
                    <input
                      id="cnpj"
                      type="text"
                      value={formData.cnpj || ''}
                      onChange={(e) => setFormData({ ...formData, cnpj: maskCNPJ(e.target.value) })}
                      required
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="companyName">Nome Fantasia</label>
                  <div className="input-wrapper">
                    <FiHome />
                    <input
                      id="companyName"
                      type="text"
                      value={formData.companyName || ''}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Nome fantasia da empresa"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="crc">CRC - Registro no Conselho Regional *</label>
              <div className="input-wrapper">
                <FiAward />
                <input
                  id="crc"
                  type="text"
                  value={formData.crc || ''}
                  onChange={(e) => setFormData({ ...formData, crc: e.target.value })}
                  required
                  placeholder="Ex: CRC-12345/UF"
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

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <div className="input-wrapper">
                <FiLink />
                <input
                  id="website"
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://seu-site.com"
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
              <label htmlFor="specialties">Áreas de Especialização</label>
              <div className="input-wrapper">
                <FiBriefcase />
                <input
                  id="specialties"
                  type="text"
                  value={formData.specialties?.join(', ') || ''}
                  onChange={(e) => handleArrayFieldChange('specialties', e.target.value)}
                  placeholder="Fertilidade do solo, Manejo de pragas, Irrigação (separadas por vírgula)"
                />
              </div>
              <small>Separe as especialidades por vírgula</small>
            </div>

            <div className="form-group">
              <label htmlFor="certifications">Certificações Técnicas</label>
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
              <label htmlFor="yearsOfExperience">Anos de Experiência</label>
              <div className="input-wrapper">
                <input
                  id="yearsOfExperience"
                  type="text"
                  inputMode="numeric"
                  value={formData.yearsOfExperience !== undefined ? formData.yearsOfExperience.toString() : ''}
                  onChange={(e) => {
                    const value = maskInteger(e.target.value);
                    setFormData({ ...formData, yearsOfExperience: value ? parseInt(value) : undefined });
                  }}
                  placeholder="Ex: 10"
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
                  placeholder="Descreva sua experiência, metodologia de trabalho e áreas de atuação"
                  rows={4}
                />
              </div>
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

