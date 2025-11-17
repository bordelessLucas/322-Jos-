import { type FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiMapPin, FiHome, FiHash, FiInfo } from 'react-icons/fi';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, updateUserProfile } from '../../services/profileService';
import { maskCNPJ, maskPhone, maskCEP, maskDecimal } from '../../utils/masks';
import type { FarmProfile } from '../../types/profile';
import './EditProfile.css';

export const EditFarmProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<FarmProfile>>({
    fullName: '',
    email: '',
    phone: '',
    region: '',
    cnpj: '',
    companyName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    area: '',
    mainCrops: [],
    description: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;

      try {
        setLoadingProfile(true);
        const profile = await getUserProfile(user.uid);
        
        if (profile && profile.accountType === 'farm') {
          setFormData({
            fullName: profile.fullName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            region: profile.region || '',
            cnpj: profile.cnpj || '',
            companyName: profile.companyName || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            zipCode: profile.zipCode || '',
            area: profile.area || '',
            mainCrops: profile.mainCrops || [],
            description: profile.description || '',
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
        accountType: 'farm',
      } as FarmProfile);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError('Erro ao salvar perfil. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMainCropsChange = (value: string) => {
    const crops = value.split(',').map(c => c.trim()).filter(c => c);
    setFormData({ ...formData, mainCrops: crops });
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
          <h1>Editar Perfil - Fazenda/Produtor</h1>
          <p>Atualize as informações da sua fazenda</p>
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
            <h2>Informações Básicas</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">Nome/Razão Social *</label>
              <div className="input-wrapper">
                <FiHome />
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="Nome da fazenda ou razão social"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cnpj">CNPJ *</label>
              <div className="input-wrapper">
                <FiHash />
                <input
                  id="cnpj"
                  type="text"
                  value={formData.cnpj}
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
            <h2>Informações da Fazenda</h2>

            <div className="form-group">
              <label htmlFor="area">Área Total (hectares)</label>
              <div className="input-wrapper">
                <input
                  id="area"
                  type="text"
                  value={formData.area || ''}
                  onChange={(e) => setFormData({ ...formData, area: maskDecimal(e.target.value) })}
                  placeholder="Ex: 500.50"
                  inputMode="decimal"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mainCrops">Principais Culturas</label>
              <div className="input-wrapper">
                <input
                  id="mainCrops"
                  type="text"
                  value={formData.mainCrops?.join(', ') || ''}
                  onChange={(e) => handleMainCropsChange(e.target.value)}
                  placeholder="Soja, Milho, Algodão (separadas por vírgula)"
                />
              </div>
              <small>Separe as culturas por vírgula</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <div className="input-wrapper">
                <FiInfo />
                <textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva sua fazenda, histórico e características principais"
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

