import { type FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiBriefcase,
  FiChevronDown,
  FiClipboard,
  FiEye,
  FiEyeOff,
  FiFeather,
  FiLock,
  FiMail,
  FiMap,
  FiPhone,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { paths } from '../../routes/paths';
import { createInitialProfile } from '../../services/profileService';
import { maskPhone } from '../../utils/masks';
import './Register.css';

const Register = () => {
  const [accountType, setAccountType] = useState<'farm' | 'operator' | 'consultant'>('farm');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redireciona quando o usuário se cadastrar com sucesso e criar perfil
  useEffect(() => {
    const createProfileAndRedirect = async () => {
      if (user && !authLoading) {
        try {
          // Criar perfil inicial se ainda não existir
          await createInitialProfile(
            user.uid,
            accountType,
            {
              fullName,
              email,
              phone,
              region,
            }
          );
          navigate(paths.dashboard);
        } catch (err) {
          console.error('Erro ao criar perfil:', err);
          // Ainda redireciona mesmo se houver erro ao criar perfil
          navigate(paths.dashboard);
        }
      }
    };
    createProfileAndRedirect();
  }, [user, authLoading, accountType, fullName, email, phone, region, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(email, password, fullName);
      // O perfil será criado e redirecionamento feito pelo useEffect
    } catch (err: any) {
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está cadastrado. Tente fazer login.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido. Verifique e tente novamente.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca. Use no mínimo 6 caracteres.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-page__overlay" />

      <div className="register-page__container">
        <section className="register-intro">
          <div className="register-intro__content">
            <span className="register-intro__badge">
              <FiFeather aria-hidden="true" />
              Transformação digital para o campo
            </span>

            <h1>Cadastre-se para impulsionar a produtividade e o matchmaking agrícola.</h1>
            <p>
              Junte-se ànAgro para criar perfis ricos em dados, apresentar operações e contratar equipes com
              confiança. Conecte-se a consultores agronômicos e libere contatos mediante segurança transacional.
            </p>

            <div className="register-intro__stats" aria-label="Por que se cadastrar">
              <article className="stat-card">
                <FiClipboard aria-hidden="true" />
                <div>
                  <h3>+250 fazendas ativas</h3>
                  <p>Compartilhe exigências de safra, acompanhe KPIs e escolha operadores certificados.</p>
                </div>
              </article>
              <article className="stat-card">
                <FiAward aria-hidden="true" />
                <div>
                  <h3>Ranking inteligente</h3>
                  <p>Avaliações transparentes, consultoria agronômica e liberação de contato sob demanda.</p>
                </div>
              </article>
            </div>

            <div className="register-intro__cta">
              <Link to="/consultoria" className="register-intro__cta-link">
                <FiArrowRight aria-hidden="true" />
                Conheça nossa consultoria agronômica
              </Link>
            </div>
          </div>
        </section>

        <section className="register-card">
          <div className="register-card__intro">
            <span className="register-card__brand"> Agro</span>
            <h2>Criar conta Agro</h2>
            <p>Complete os dados abaixo para acessar o ecossistema e desbloquear novas oportunidades.</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message" style={{ 
                padding: '0.75rem', 
                background: '#fee2e2', 
                color: '#dc2626', 
                borderRadius: '0.5rem', 
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}
          <fieldset className="account-types">
            <legend>Tipo de conta</legend>
            <div className="account-types__options">
              <label className={`account-card ${accountType === 'farm' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="accountType"
                  value="farm"
                  checked={accountType === 'farm'}
                  onChange={() => setAccountType('farm')}
                />
                <FiBriefcase aria-hidden="true" />
                <strong>Fazenda / Produtor</strong>
                <span>Gerencie propriedades, contrate operadores e monitore consultorias.</span>
              </label>

              <label className={`account-card ${accountType === 'operator' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="accountType"
                  value="operator"
                  checked={accountType === 'operator'}
                  onChange={() => setAccountType('operator')}
                />
                <FiUser aria-hidden="true" />
                <strong>Operador</strong>
                <span>Construa portfolio, receba avaliações e se conecte com fazendas premium.</span>
              </label>

              <label className={`account-card ${accountType === 'consultant' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="accountType"
                  value="consultant"
                  checked={accountType === 'consultant'}
                  onChange={() => setAccountType('consultant')}
                />
                <FiUsers aria-hidden="true" />
                <strong>Consultor agronômico</strong>
                <span>Ofereça consultoria especializada e libere relatórios sob demanda.</span>
              </label>
            </div>
          </fieldset>

          <div className="register-grid">
            <div className="input-group">
              <label htmlFor="fullName">Nome completo</label>
              <div className="input-group__field">
                <FiUser aria-hidden="true" />
                <input 
                  className='teste' 
                  id="fullName" 
                  type="text" 
                  name="fullName" 
                  placeholder="Nome e sobrenome" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">E-mail profissional</label>
              <div className="input-group__field">
                <FiMail aria-hidden="true" />
                <input 
                  id="email" 
                  type="email" 
                  name="email" 
                  placeholder="nome@empresa.com.br" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="phone">Telefone/WhatsApp</label>
              <div className="input-group__field">
                <FiPhone aria-hidden="true" />
                <input 
                  id="phone" 
                  type="tel" 
                  name="phone" 
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  maxLength={15}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="region">Região de atuação principal</label>
              <div className="input-group__field input-group__field--select">
                <FiMap aria-hidden="true" />
                <select 
                  id="region" 
                  name="region" 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione uma região
                  </option>
                  <option value="centro-oeste">Centro-Oeste</option>
                  <option value="sudeste">Sudeste</option>
                  <option value="sul">Sul</option>
                  <option value="nordeste">Nordeste</option>
                  <option value="norte">Norte</option>
                </select>
                <FiChevronDown aria-hidden="true" className="input-group__select-icon" />
              </div>
            </div>

            <div className="input-group input-group--full">
              <label htmlFor="password">Senha</label>
              <div className="input-group__field input-group__field--password">
                <FiLock aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Crie uma senha segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="input-group__toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                </button>
              </div>
              <small className="input-helper">
                Mínimo de 6 caracteres, combine letras, números e caracteres especiais para maior segurança.
              </small>
            </div>
          </div>

          <div className="register-terms">
            <label className="checkbox">
              <input type="checkbox" name="terms" required />
              <span>
                Confirmo que li e concordo com os{' '}
                <Link to="/politica-de-privacidade" className="terms-link">
                  Termos de uso e Política de privacidade
                </Link>
                .
              </span>
            </label>
          </div>

          <Button type="submit" fullWidth size="lg" rightIcon={<FiArrowRight />} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Finalizar cadastro'}
          </Button>
        </form>

        <footer className="register-card__footer">
          <span>Já possui uma conta?</span>
          <Link to="/login">Entrar na plataforma</Link>
        </footer>
      </section>
      </div>
    </div>
  );
};

export default Register;

