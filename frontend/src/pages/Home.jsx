import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import Ana from "../assets/Ana.jpg";
import Bruno from "../assets/Bruno.png";
import Carla from "../assets/Carla.png";
import { AuthContext } from "../contexts/AuthContext.jsx";

const equipe = [
  { nome: "Ana Souza", img: Ana },
  { nome: "Bruno Lima", img: Bruno },
  { nome: "Carla Rocha", img: Carla },
];

const plataformas = [
  { nome: "YouTube", hint: "Crescimento orgânico", cor: "#ff6b6b" },
  { nome: "Instagram", hint: "Engajamento visual", cor: "#ff9f43" },
  { nome: "TikTok", hint: "Conteúdo rápido", cor: "#10b981" },
  { nome: "Facebook", hint: "Comunidades ativas", cor: "#5b8cff" },
];

const features = [
  { icon: "⏱️", titulo: "Melhor horário", texto: "Saiba exatamente quando postar para obter mais engajamento.", tag: "Previsão" },
  { icon: "📊", titulo: "Análises rápidas", texto: "Visualize os dados com gráficos de barras, áreas e donuts.", tag: "Pronto para ação" },
  { icon: "🚀", titulo: "Crescimento real", texto: "Use os insights para tomar decisões com base em dados reais.", tag: "Insights" },
];

export default function Home() {
  const nav = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      nav("/companies", { replace: true });
      return;
    }
    const onScroll = () => {
      const y = window.scrollY;
      document.documentElement.style.setProperty("--heroY", `${y * 0.15}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAuthenticated, nav]);

  useEffect(() => {
    const hero = document.querySelector(".fk-hero");
    if (!hero) return;
    const handlePointer = (e) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      hero.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    hero.addEventListener("pointermove", handlePointer);
    return () => hero.removeEventListener("pointermove", handlePointer);
  }, []);

  return (
    <main className="fk-home">
      {/* HERO */}
      <section className="fk-hero fk-hero-mesh">
        <div className="fk-container fk-hero-grid">
          <div className="fk-hero-text">
            <div className="fk-hero-title">
              <span className="fk-hero-eyebrow">Dados em um só lugar</span>
              <h1>Insights práticos para crescer suas redes e fechar mais negócios.</h1>
            </div>
            <p className="fk-hero-sub">
              Um painel elegante que analisa seus posts, sugere o melhor horário, compara formatos
              e entrega gráficos rápidos - tudo sem complicação.
            </p>

            <Link className="fk-btn fk-btn-primary fk-btn-glow" to="/analytics">
              Ver análise agora
            </Link>

            <ul className="fk-bullets">
              <li><b>Segurança</b> primeiro</li>
              <li><b>Sem complicação</b></li>
            </ul>
          </div>

          <div className="fk-hero-card fk-float">
            <div className="fk-hero-card-inner">
              <div className="fk-chip fk-chip-glow">Painel inteligente</div>

              <div className="fk-hero-metrics">
                <div className="metric">
                  <span className="metric-label">Melhor horário</span>
                  <span className="metric-value">13:00 UTC</span>
                  <span className="metric-hint">+22% engajamento</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Engajamento por mídia</span>
                  <div className="metric-bars">
                    <span className="bar"><i style={{ width: "72%" }} /></span>
                    <span className="bar alt"><i style={{ width: "38%" }} /></span>
                  </div>
                  <span className="metric-hint">imagem vs vídeo</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Insights rápidos</span>
                  <span className="metric-pills">
                    <i>picos</i>
                    <i>tendências</i>
                    <i>volume</i>
                  </span>
                </div>
              </div>

              <button className="fk-btn fk-btn-gradient fk-hero-cta" onClick={() => nav("/analytics")}>
                Abrir painel
              </button>
            </div>
          </div>
        </div>

        <div className="fk-hero-parallax">
          <span className="p1" />
          <span className="p2" />
          <span className="p3" />
        </div>

        <button className="fk-scroll-hint" onClick={() => {
          document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
        }} aria-label="Rolar para mais">
        </button>
      </section>

      {/* REDES */}
      <section className="fk-section fk-parceiros">
        <div className="fk-container fk-block">
          <div className="fk-sec-head">
            <div>
              <p className="fk-kicker">Confiado por criadores</p>
              <h3 className="fk-sec-title">Usado por criadores de conteúdo em</h3>
              <p className="fk-sec-sub">Formatos diferentes, um painel só. Ajustamos a leitura para cada plataforma.</p>
            </div>
            <div className="fk-live-pill">
              <span className="dot" />
              Em tempo real
            </div>
          </div>

          <div className="fk-platforms">
            {plataformas.map((item, i) => (
              <div key={i} className="fk-platform-card">
                <span className="fk-platform-accent" style={{ background: item.cor }} />
                <div>
                  <strong>{item.nome}</strong>
                  <p>{item.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="fk-section">
        <div className="fk-container fk-block">
          <div className="fk-sec-head">
            <div>
              <p className="fk-kicker">Recursos principais</p>
              <h3 className="fk-sec-title">Prontos para agir em minutos</h3>
              <p className="fk-sec-sub">Cards com foco na leitura rápida e hierarquia clara para o time decidir rápido.</p>
            </div>
            <Link to="/analytics" className="fk-btn fk-btn-outline">Explorar painel</Link>
          </div>

          <div className="fk-feature-grid">
            {features.map((item, i) => (
              <article key={i} className="fk-feature-card fk-hover-raise">
                <div className="fk-feature-icon">{item.icon}</div>
                <div className="fk-feature-body">
                  <div className="fk-feature-top">
                    <h4>{item.titulo}</h4>
                    <span className="fk-tag">{item.tag}</span>
                  </div>
                  <p>{item.texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      <section className="fk-section fk-equipe">
        <div className="fk-container fk-block">
          <div className="fk-sec-head">
            <div>
              <p className="fk-kicker">Equipe</p>
              <h3 className="fk-sec-title">Conheça quem está por trás</h3>
              <p className="fk-sec-sub">Especialistas que acompanham as métricas e orientam o crescimento.</p>
            </div>
          </div>

          <div className="fk-team-grid">
            {equipe.map((pessoa, i) => (
              <div key={i} className="fk-team-card">
                <div className="fk-team-glow" />
                <div className="fk-team-header">
                  <span className="fk-pill-soft">Mentoria</span>
                  <span className="fk-pill-soft alt">Suporte</span>
                </div>
                <img src={pessoa.img} alt={pessoa.nome} className="fk-avatar" />
                <h4>{pessoa.nome}</h4>
                <p>Especialista em redes</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="fk-section fk-cta-final">
        <div className="fk-container fk-cta-shell">
          <div className="fk-cta-left">
            <span className="fk-kicker">Vamos em frente</span>
            <h2>Pronto para crescer suas redes com inteligência?</h2>
            <p>Ative o painel, valide insights em minutos e siga com suporte da equipe.</p>
            <div className="fk-cta-actions">
              <Link className="fk-btn fk-btn-gradient fk-btn-glow" to="/analytics">Começar agora</Link>
              <Link className="fk-btn fk-btn-outline" to="/login">Ver demo guiada</Link>
            </div>
            <div className="fk-cta-meta">
              <span>⚡ Respostas rápidas</span>
              <span>🔒 Dados seguros</span>
              <span>🤝 Suporte humano</span>
            </div>

            <div className="fk-cta-steps">
              <div className="step">
                <span className="num">1</span>
                <div>
                  <strong>Acesse o painel</strong>
                  <p>Visualize melhores horários, desempenho por formato e gráficos prontos.</p>
                </div>
              </div>
              <div className="step">
                <span className="num">2</span>
                <div>
                  <strong>Compare resultados</strong>
                  <p>Barra, área e donut para decidir rápido onde investir conteúdo.</p>
                </div>
              </div>
              <div className="step">
                <span className="num">3</span>
                <div>
                  <strong>Compartilhe insights</strong>
                  <p>Leve os highlights para o time ou para clientes sem perder tempo.</p>
                </div>
              </div>
            </div>

            <div className="fk-cta-faq">
              <div>
                <p className="faq-q">Preciso integrar agora?</p>
                <p className="faq-a">Não. Você já vê exemplos e fluxos prontos ao entrar no painel.</p>
              </div>
              <div>
                <p className="faq-q">Quanto tempo para ver valor?</p>
                <p className="faq-a">Em poucos minutos você confere horários ideais e métricas chave.</p>
              </div>
            </div>
          </div>
          <div className="fk-cta-card">
            <div className="fk-cta-badge">Live score</div>
            <div className="fk-cta-metric">
              <small>Taxa de acerto</small>
              <strong>92%</strong>
              <span className="trend up">+6% vs semana passada</span>
            </div>
            <div className="fk-cta-metric alt">
              <small>Tempo para insight</small>
              <strong>2 min</strong>
              <span className="trend steady">em média</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
