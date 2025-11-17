import { type FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLogIn, FiLock, FiMail, FiShield, FiTrendingUp } from 'react-icons/fi';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { paths } from '../../routes/paths';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redireciona quando o usuário fizer login com sucesso
  useEffect(() => {
    if (user && !authLoading) {
      navigate(paths.dashboard);
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // O redirecionamento será feito pelo useEffect quando o usuário estiver disponível
    } catch (err: any) {
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado. Verifique seu e-mail.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta. Tente novamente.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido. Verifique e tente novamente.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__overlay" />

      <div className="login-page__container">
        <section className="login-hero" aria-label="Sobre a plataforma">
          <div className="login-hero__content">
            <span className="login-hero__badge">
              <FiShield aria-hidden="true" />
              Conexões agrícolas confiáveis
            </span>

            <h1 className="login-hero__title">
              Simplifique a ponte entre fazendas e operadores com inteligência agronômica.
            </h1>

            <p className="login-hero__description">
              A plataforma X integra fazendas, consultores e operadores de campo, com avaliações de
              desempenho, perfis completos e liberação de contato segura sob demanda.
            </p>

            <div className="login-hero__highlights" aria-label="Benefícios principais">
              <div className="highlight-card">
                <FiTrendingUp aria-hidden="true" />
                <div>
                  <h3>Gestão estratégica</h3>
                  <p>Rankings dinâmicos para escolher os melhores talentos com base em entregas reais.</p>
                </div>
              </div>
              <div className="highlight-card">
                <FiLock aria-hidden="true" />
                <div>
                  <h3>Contato protegido</h3>
                  <p>Liberação de dados mediante pagamento e consultoria especializada em agronomia.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="login-card" aria-label="Área de login">
          <div className="login-card__intro">
            <span className="login-card__brand">Agro</span>
            <h2>Entre na sua conta</h2>
            <p>Conecte-se para gerenciar fazendas, operadores e consultorias com mais transparência.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
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

            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <div className="input-group__field">
                <FiMail aria-hidden="true" />
                <input 
                  id="email" 
                  type="email" 
                  name="email" 
                  placeholder="nome@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <div className="input-group__field input-group__field--password">
                <FiLock aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Digite sua senha"
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
            </div>

            <div className="login-form__actions">
              <label className="checkbox">
                <input type="checkbox" name="remember" />
                <span>Lembrar acesso</span>
              </label>
              <Link to="/recuperar-senha" className="forgot-link">
                Esqueci minha senha
              </Link>
            </div>

            <Button type="submit" fullWidth leftIcon={<FiLogIn />} size="lg" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar na plataforma'}
            </Button>
          </form>

          <footer className="login-card__footer">
            <span>Ainda não possui cadastro?</span>
            <Link to="/register">Criar conta agora</Link>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default Login;

