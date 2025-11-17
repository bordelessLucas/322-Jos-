import { useState, useEffect } from 'react';
import { FiStar, FiMapPin, FiBriefcase, FiSearch, FiUser, FiPhone, FiMail } from 'react-icons/fi';
import { Button } from '../../components/ui/Button/Button';
import { Layout } from '../../components/layout/Layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile } from '../../services/profileService';
import type { AccountType } from '../../types/profile';
import './Operators.css';

interface Operator {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  region?: string;
  specialties?: string[];
  rating: number;
  totalSearches: number;
  availableForHire?: boolean;
  city?: string;
  state?: string;
}

const Operators = () => {
  const { user } = useAuth();
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [operators, setOperators] = useState<Operator[]>([]);
  const [filteredOperators, setFilteredOperators] = useState<Operator[]>([]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.uid) {
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

    loadUserProfile();
  }, [user]);

  // Mock data - em produção, isso viria do Firestore
  useEffect(() => {
    const mockOperators: Operator[] = [
      {
        id: '1',
        fullName: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(16) 98765-4321',
        region: 'sudeste',
        specialties: ['Colheita', 'Plantio', 'Pulverização'],
        rating: 5.0,
        totalSearches: 245,
        availableForHire: true,
        city: 'Ribeirão Preto',
        state: 'SP',
      },
      {
        id: '2',
        fullName: 'Carlos Santos',
        email: 'carlos.santos@email.com',
        phone: '(34) 98765-4321',
        region: 'sudeste',
        specialties: ['Operador de Máquinas', 'Manutenção'],
        rating: 4.9,
        totalSearches: 189,
        availableForHire: true,
        city: 'Uberlândia',
        state: 'MG',
      },
      {
        id: '3',
        fullName: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        phone: '(67) 98765-4321',
        region: 'centro-oeste',
        specialties: ['Colheitadeira', 'Trator'],
        rating: 5.0,
        totalSearches: 312,
        availableForHire: true,
        city: 'Dourados',
        state: 'MS',
      },
      {
        id: '4',
        fullName: 'Miguel Costa',
        email: 'miguel.costa@email.com',
        phone: '(45) 98765-4321',
        region: 'sul',
        specialties: ['Plantio Direto', 'Irrigação'],
        rating: 4.9,
        totalSearches: 156,
        availableForHire: true,
        city: 'Cascavel',
        state: 'PR',
      },
      {
        id: '5',
        fullName: 'Lucas Pereira',
        email: 'lucas.pereira@email.com',
        phone: '(65) 98765-4321',
        region: 'centro-oeste',
        specialties: ['Colheita', 'Pulverização', 'Plantio'],
        rating: 4.8,
        totalSearches: 203,
        availableForHire: true,
        city: 'Lucas do Rio Verde',
        state: 'MT',
      },
      {
        id: '6',
        fullName: 'Roberto Alves',
        email: 'roberto.alves@email.com',
        phone: '(11) 98765-4321',
        region: 'sudeste',
        specialties: ['Operador de Máquinas', 'Colheita'],
        rating: 4.7,
        totalSearches: 128,
        availableForHire: false,
        city: 'Campinas',
        state: 'SP',
      },
    ];

    setOperators(mockOperators);
    setFilteredOperators(mockOperators);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOperators(operators);
      return;
    }

    const filtered = operators.filter(
      (operator) =>
        operator.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.specialties?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        operator.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.state?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredOperators(filtered);
  }, [searchTerm, operators]);

  const handleContact = (operator: Operator) => {
    // TODO: Implementar página de contato
    console.log('Entrar em contato com:', operator);
    alert(`Funcionalidade de contato será implementada em breve.\nOperador: ${operator.fullName}`);
  };

  const isFarmAccount = accountType === 'farm';

  if (loading) {
    return (
      <Layout>
        <div className="operators-page">
          <div className="operators-loading">
            <p>Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="operators-page">
        <div className="operators-header">
          <div>
            <h1 className="operators-title">Gestão de Operadores</h1>
            <p className="operators-subtitle">
              Encontre e contate os melhores profissionais do setor agrícola
            </p>
          </div>
        </div>

        <div className="operators-search">
          <div className="operators-search__wrapper">
            <FiSearch className="operators-search__icon" />
            <input
              type="text"
              placeholder="Buscar por nome, especialidade, cidade ou estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="operators-search__input"
            />
          </div>
        </div>

        <div className="operators-stats">
          <div className="operators-stats__item">
            <span className="operators-stats__label">Total de Operadores</span>
            <span className="operators-stats__value">{filteredOperators.length}</span>
          </div>
          <div className="operators-stats__item">
            <span className="operators-stats__label">Disponíveis</span>
            <span className="operators-stats__value">
              {filteredOperators.filter((op) => op.availableForHire).length}
            </span>
          </div>
        </div>

        {filteredOperators.length === 0 ? (
          <div className="operators-empty">
            <FiUser className="operators-empty__icon" />
            <p className="operators-empty__text">Nenhum operador encontrado</p>
            <p className="operators-empty__subtext">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div className="operators-grid">
            {filteredOperators.map((operator) => (
              <div key={operator.id} className="operator-card">
                <div className="operator-card__header">
                  <div className="operator-card__avatar">
                    {operator.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="operator-card__info">
                    <h3 className="operator-card__name">{operator.fullName}</h3>
                    {operator.city && operator.state && (
                      <div className="operator-card__location">
                        <FiMapPin />
                        <span>
                          {operator.city}, {operator.state}
                        </span>
                      </div>
                    )}
                  </div>
                  {operator.availableForHire && (
                    <span className="operator-card__badge operator-card__badge--available">
                      Disponível
                    </span>
                  )}
                </div>

                <div className="operator-card__body">
                  <div className="operator-card__rating">
                    <FiStar className="operator-card__rating-icon" />
                    <span className="operator-card__rating-value">{operator.rating}</span>
                  </div>

                  <div className="operator-card__stats">
                    <div className="operator-card__stat">
                      <span className="operator-card__stat-label">Procuras</span>
                      <span className="operator-card__stat-value">{operator.totalSearches}</span>
                    </div>
                  </div>

                  {operator.specialties && operator.specialties.length > 0 && (
                    <div className="operator-card__specialties">
                      <FiBriefcase className="operator-card__specialties-icon" />
                      <div className="operator-card__specialties-list">
                        {operator.specialties.map((specialty, index) => (
                          <span key={index} className="operator-card__specialty-tag">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {operator.phone && (
                    <div className="operator-card__contact">
                      <FiPhone />
                      <span>{operator.phone}</span>
                    </div>
                  )}
                </div>

                {isFarmAccount && (
                  <div className="operator-card__footer">
                    <Button
                      variant="primary"
                      fullWidth
                      leftIcon={<FiMail />}
                      onClick={() => handleContact(operator)}
                    >
                      Entrar em Contato
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Operators;

