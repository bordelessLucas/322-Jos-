import {
  FiTruck,
  FiHardDrive,
  FiTool,
  FiHome,
  FiMapPin,
  FiStar,
  FiSearch,
  FiFileText,
  FiUser,
} from 'react-icons/fi';
import { Button } from '../../components/ui/Button/Button';
import { Layout } from '../../components/layout/Layout/Layout';
import './Home.css';

const Home = () => {
  const topFarms = [
    { id: 1, name: 'Fazenda Santa Maria', location: 'Ribeirão Preto, SP', rating: 4.9 },
    { id: 2, name: 'Agro Boa Vista', location: 'Uberlândia, MG', rating: 4.8 },
    { id: 3, name: 'Fazenda Verde', location: 'Dourados, MS', rating: 4.9 },
    { id: 4, name: 'Agro Sul', location: 'Cascavel, PR', rating: 4.7 },
    { id: 5, name: 'Fazenda Norte', location: 'Lucas do Rio Verde, MT', rating: 4.8 },
  ];

  const topOperators = [
    { id: 1, name: 'João Silva', location: 'Ribeirão Preto, SP', rating: 5.0 },
    { id: 2, name: 'Carlos Santos', location: 'Uberlândia, MG', rating: 4.9 },
    { id: 3, name: 'Pedro Oliveira', location: 'Dourados, MS', rating: 5.0 },
    { id: 4, name: 'Miguel Costa', location: 'Cascavel, PR', rating: 4.9 },
    { id: 5, name: 'Lucas Pereira', location: 'Lucas do Rio Verde, MT', rating: 4.8 },
  ];

  const categories = [
    {
      id: 1,
      icon: <FiTruck />,
      title: 'Operador Agrícola',
      description: 'Profissionais especializados em operação de máquinas agrícolas',
    },
    {
      id: 2,
      icon: <FiHardDrive />,
      title: 'Linha Amarela',
      description: 'Especialistas em equipamentos de linha amarela',
    },
    {
      id: 3,
      icon: <FiTool />,
      title: 'Mecânico',
      description: 'Mecânicos especializados em maquinário agrícola',
    },
    {
      id: 4,
      icon: <FiHome />,
      title: 'Caseiro',
      description: 'Profissionais para cuidados gerais da propriedade rural',
    },
    {
      id: 5,
      icon: <FiUser />,
      title: 'Vaqueiro',
      description: 'Especialistas em manejo e cuidado de gado',
    },
    {
      id: 6,
      icon: <FiTruck />,
      title: 'Colheitadeira',
      description: 'Operadores especializados em colheitadeiras',
    },
  ];

  return (
    <Layout>
      <div className="home-page">
        <main className="home-main">
        <div className="home-main__container">
          <aside className="home-sidebar home-sidebar--left">
            <h2 className="home-sidebar__title">Top Fazendas</h2>
            <div className="home-sidebar__list">
              {topFarms.map((farm) => (
                <div key={farm.id} className="home-sidebar__item">
                  <div className="home-sidebar__item-number">{farm.id}</div>
                  <div className="home-sidebar__item-avatar">
                    <FiUser />
                  </div>
                  <div className="home-sidebar__item-info">
                    <div className="home-sidebar__item-name">{farm.name}</div>
                    <div className="home-sidebar__item-location">
                      <FiMapPin aria-hidden="true" />
                      {farm.location}
                    </div>
                    <div className="home-sidebar__item-rating">
                      <FiStar aria-hidden="true" />
                      {farm.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="home-content">
            <section className="home-hero">
              <h1 className="home-hero__title">
                Conectando Fazendas com os Melhores Profissionais do Agro
              </h1>
              <p className="home-hero__description">
                Encontre operadores qualificados, mecânicos especializados e profissionais do setor
                agrícola com avaliações verificadas.
              </p>
              <div className="home-hero__actions">
                <Button variant="primary" size="lg" leftIcon={<FiSearch />}>
                  Buscar Profissionais
                </Button>
                <Button variant="secondary" size="lg" leftIcon={<FiFileText />}>
                  Cadastrar Currículo
                </Button>
              </div>
            </section>

            <section className="home-mission">
              <h2 className="home-mission__title">Nossa Missão</h2>
              <p className="home-mission__text">
                Facilitar a conexão entre fazendas e profissionais qualificados do setor agrícola,
                promovendo transparência através de avaliações verificadas e rankings baseados em
                desempenho real. Nossa plataforma visa elevar os padrões de qualidade no
                recrutamento agrícola.
              </p>
            </section>

            <section className="home-categories">
              <h2 className="home-categories__title">Categorias de Profissionais</h2>
              <div className="home-categories__grid">
                {categories.map((category) => (
                  <div key={category.id} className="home-category-card">
                    <div className="home-category-card__icon">{category.icon}</div>
                    <h3 className="home-category-card__title">{category.title}</h3>
                    <p className="home-category-card__description">{category.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="home-sidebar home-sidebar--right">
            <h2 className="home-sidebar__title">Top Operadores</h2>
            <div className="home-sidebar__list">
              {topOperators.map((operator) => (
                <div key={operator.id} className="home-sidebar__item">
                  <div className="home-sidebar__item-number">{operator.id}</div>
                  <div className="home-sidebar__item-avatar">
                    <FiUser />
                  </div>
                  <div className="home-sidebar__item-info">
                    <div className="home-sidebar__item-name">{operator.name}</div>
                    <div className="home-sidebar__item-location">
                      <FiMapPin aria-hidden="true" />
                      {operator.location}
                    </div>
                    <div className="home-sidebar__item-rating">
                      <FiStar aria-hidden="true" />
                      {operator.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
    </Layout>
  );
};

export default Home;

