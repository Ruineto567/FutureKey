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
        <div className="fk-container">
          <h3 className="fk-sec-title">Usado por criadores de conteúdo em:</h3>
          <div className="fk-grid-4">
            {["YouTube", "Instagram", "TikTok", "Facebook"].map((name, i) => (
              <div key={i} className="fk-partner">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="fk-section">
        <div className="fk-container">
          <h3 className="fk-sec-title">Recursos principais</h3>
          <div className="fk-grid-3">
            <div className="fk-card">
              <h4>⏱ Melhor horário</h4>
              <p>Saiba exatamente quando postar para obter mais engajamento.</p>
            </div>
            <div className="fk-card">
              <h4>📊 Análises rápidas</h4>
              <p>Visualize os dados com gráficos de barras, áreas e donuts.</p>
            </div>
            <div className="fk-card">
              <h4>🚀 Crescimento real</h4>
              <p>Use os insights para tomar decisões com base em dados reais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPE */}
<section className="fk-section">
  <div className="fk-container">
    <h3 className="fk-sec-title">Conheça a equipe</h3>
    <div className="fk-grid-3">
      {equipe.map((pessoa, i) => (
        <div key={i} className="fk-team-card">
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
        <h2>Pronto para crescer suas redes com inteligência?</h2>
        <Link className="fk-btn fk-btn-gradient fk-btn-glow" to="/analytics">Começar agora</Link>
      </section>
    </main>
  );
}
