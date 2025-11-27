import { useState } from "react";
import InstagramInsightsOverview from "../components/InstagramInsightsOverview.jsx";
import "../styles/insights.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function BestBadge({ best }) {
  if (!best) return null;
  return (
    <div className="best-pill">
      Melhor horário: <b>{dias[best.dayOfWeekUTC]} · {String(best.hourUTC).padStart(2,"0")}:00 (UTC)</b> — score médio {Math.round(best.scoreAvg).toLocaleString()}
    </div>
  );
}

// NOVO COMPONENTE – Sugestão de agendamento
function NextBestTimeTip({ best }) {
  if (!best) return null;

  // Função para encontrar a próxima data compatível
  function getNextDateFor(dayOfWeek, hourUTC) {
    const now = new Date();
    const nowDay = now.getUTCDay();
    const nowHour = now.getUTCHours();

    let daysToAdd = dayOfWeek - nowDay;
    if (daysToAdd < 0 || (daysToAdd === 0 && hourUTC <= nowHour)) {
      daysToAdd += 7;
    }

    const nextDate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysToAdd,
      hourUTC,
      0,
      0
    ));

    return nextDate;
  }

  const nextDate = getNextDateFor(best.dayOfWeekUTC, best.hourUTC);

  const formatted = nextDate.toLocaleString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC"
  });

  return (
    <div className="next-best-tip" >
      🚀 Próximo melhor horário sugerido:<br />
      <b>{formatted} (UTC)</b>
    </div>
  );
}

export default function Analytics() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [best, setBest] = useState(null);
  const [posts, setPosts] = useState([]);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");

  async function handleCalc() {
    setLoading(true);
    setError("");
    setBest(null);
    setPosts([]);

    const clean = username.trim().replace(/^@/, "");
    if (!clean) {
      setError("Informe um @username");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/instagram/analytics/${encodeURIComponent(clean)}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json?.error || res.statusText);

      setBest(json.best || null);
      setPosts(Array.isArray(json.posts) ? json.posts : []);
      setSource(json._source || "banco de dados");
    } catch (e) {
      setError(e.message || "Falha ao buscar dados");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="analytics-page">
      <div className="card card-bleed">
        <div className="header-row">
          <h2>Insights do Instagram</h2>
          {(posts.length > 0 || best) && (
            <div className="analytics-meta">
              <span className="pill">Fonte: {source || "banco de dados"}</span>
              <span className="pill">{posts.length} posts analisados</span>
            </div>
          )}
        </div>

        <div className="search-bar analytics-search">
          <div className="input-wrapper">
            <span className="at-symbol"></span>
            <input
              className="styled-input"
              type="text"
              placeholder="usuário do Instagram"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button
            className="styled-btn"
            onClick={handleCalc}
            disabled={loading}
          >
            {loading ? "⏳ Calculando..." : "📊 Calcular"}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        <NextBestTimeTip best={best} /> {/* NOVO BLOCO AQUI */}

        {(posts.length > 0 || best) ? (
          <div className="insights-overview grid-12">
            <div className="span-12">
              <InstagramInsightsOverview data={{ best, posts }} />
            </div>
          </div>
        ) : (
          <div className="empty-hint">
            Digite um @usuario e clique em <b>Calcular</b> para ver as métricas.
          </div>
        )}
      </div>
    </div>
    
    );
    
}
