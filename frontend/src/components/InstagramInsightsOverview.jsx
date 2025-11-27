import { useState } from "react";
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  PieChart, Pie, Cell, Tooltip as RTooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";
import SuggestedTags from "./SuggestedTags.jsx";

/* ===== helpers ===== */
function fmtDate(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}
function groupByWeek(posts) {
  const byWeek = {};
  posts.forEach(p => {
    const d = new Date(p.createdAt);
    const y = d.getUTCFullYear();
    const oneJan = new Date(Date.UTC(y, 0, 1));
    const week = Math.ceil((((d - oneJan) / 86400000) + oneJan.getUTCDay() + 1) / 7);
    const key = `${y}-W${week}`;
    byWeek[key] = (byWeek[key] || 0) + 1;
  });
  return byWeek;
}
const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

function computeMetrics(posts, opts = { followers: null, goalPerWeek: 3 }) {
  const likes = posts.map(p => p.likes || 0);
  const comments = posts.map(p => p.comments || 0);
  const avgLikes = Math.round(avg(likes));
  const avgComments = Math.round(avg(comments));
  const byWeek = groupByWeek(posts);
  const freq = avg(Object.values(byWeek));
  const goal = opts.goalPerWeek || 3;
  const progress = Math.min(100, Math.round((freq / goal) * 100));
  const engagementPerPost = avg(likes.map((l, i) => l + (comments[i] || 0)));
  const engagementRate = opts.followers ? (engagementPerPost / opts.followers) * 100 : null;
  const mediaTypeCount = posts.reduce((acc, p) => {
    const k = (p.mediaType || "other").toLowerCase();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  return {
    avgLikes, avgComments,
    freq: Number(freq.toFixed(2)), goal, progress,
    engagementRate: engagementRate != null ? Number(engagementRate.toFixed(2)) : null,
    mediaTypeCount
  };
}
/* ==================== */

const COLORS = ["#8b5cf6", "#22d3ee", "#fb7185", "#f59e0b", "#60a5fa"];

// Tooltip customizado com a data em preto
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <p style={{ margin: 0, color: "#000", fontWeight: "bold" }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ margin: 0, color: entry.color }}>
            {entry.name} : {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function KpiCard({ title, value, helper }) {
  return (
    <div className="kpi">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
      {helper ? <div className="kpi-helper">{helper}</div> : null}
    </div>
  );
}

export default function InstagramInsightsOverview({ data }) {
  const posts = data?.posts || [];
  const best = data?.best || null;

  const [goalPerWeek, setGoalPerWeek] = useState(3);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const startTime = startDate ? new Date(`${startDate}T00:00:00`).getTime() : null;
  const endTime = endDate ? new Date(`${endDate}T23:59:59.999`).getTime() : null;

  const filteredPosts = posts.filter((p) => {
    const t = new Date(p.createdAt).getTime();
    if (Number.isNaN(t)) return false;
    if (startTime && t < startTime) return false;
    if (endTime && t > endTime) return false;
    return true;
  });

  const metrics = computeMetrics(filteredPosts, { followers: null, goalPerWeek });

  const series = [...filteredPosts]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(p => ({
      date: new Date(p.createdAt).toLocaleDateString(),
      likes: p.likes || 0,
      comments: p.comments || 0,
    }));

  const mediaPie = Object.entries(metrics.mediaTypeCount).map(([k, v], i) => ({
    name: k, value: v, fill: COLORS[i % COLORS.length]
  }));

  return (
    <div className="insights-overview grid-12">
      {/* Linha 1: KPIs */}
      <div className="span-12">
        <div className="kpi-grid">
          <KpiCard title="Media de Curtidas" value={metrics.avgLikes.toLocaleString()} />
          <KpiCard title="Media de Comentarios" value={metrics.avgComments.toLocaleString()} />
          <KpiCard title="Frequencia (posts/semana)" value={metrics.freq} helper={`Meta: ${metrics.goal}/sem`} />
          <KpiCard
            title="Engajamento medio"
            value={metrics.engagementRate != null ? `${metrics.engagementRate}%` : `${(metrics.avgLikes + metrics.avgComments).toLocaleString()} por post`}
          />
        </div>
      </div>

      {/* Linha 2: esquerda - Evolucao */}
      <section className="span-7">
        <div className="panel">
          <div className="panel-title">Evolucao (likes & comentarios)</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gComments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#aab3c2' }} />
              <YAxis tick={{ fill: '#aab3c2' }} />
              <Legend />
              <RTooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="likes" stroke="#8b5cf6" fill="url(#gLikes)" />
              <Area type="monotone" dataKey="comments" stroke="#22d3ee" fill="url(#gComments)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <SuggestedTags />
      </section>

      {/* Linha 2: direita - Meta + Tipos */}
      <section className="span-5">
        <div className="panel">
          <div className="panel-title">Meta semanal</div>

          <input
            type="number"
            min="1"
            className="goal-input"
            value={goalPerWeek === 0 ? "" : goalPerWeek}
            onChange={(e) => {
              const val = Number(e.target.value);
              setGoalPerWeek(val >= 1 ? val : 0);
            }}
            placeholder="Defina sua meta semanal"
          />

          <div className="center">
            <ResponsiveContainer width="100%" height={240}>
              <RadialBarChart innerRadius="60%" outerRadius="100%"
                data={[{ name: "Progresso", value: metrics.progress }]}
                startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={8} fill="#8b5cf6" />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="radial-label">
              <div className="radial-main">{metrics.progress}%</div>
              <div className="radial-sub">{metrics.freq} / {metrics.goal} posts</div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Tipos de midia</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={mediaPie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                {mediaPie.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-row">
            {mediaPie.map((m, i) => (
              <span key={i} className="legend-chip"><i style={{ background: m.fill }} /> {m.name} ({m.value})</span>
            ))}
          </div>
        </div>
      </section>

      {/* Linha 3: Posts */}
      <section className="span-12">
        <div className="panel">
          <div className="panel-title">Posts</div>
          <div className="filter-row">
            <div className="filter-inputs">
              <label className="filter-field">
                <span>De</span>
                <input
                  className="date-filter"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label className="filter-field">
                <span>Ate</span>
                <input
                  className="date-filter"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
            </div>
            {(startDate || endDate) && (
              <button
                className="clear-filter-btn"
                type="button"
                onClick={() => { setStartDate(""); setEndDate(""); }}
              >
                Limpar filtro
              </button>
            )}
          </div>
          <div className="filter-summary">
            {filteredPosts.length} de {posts.length} posts no periodo selecionado
          </div>
          <div className="table">
            <div className="thead">
              <div>Data</div><div>Legenda</div><div>Curtidas</div><div>Comentarios</div>
            </div>
            <div className="tbody">
              {(!filteredPosts || filteredPosts.length === 0) && <div className="empty">Nenhum post disponivel.</div>}
              {filteredPosts?.map((p, i) => (
                <div className="tr" key={i}>
                  <div className="td">
                    <div className="date">{fmtDate(p.createdAt)}</div>
                    {p.image && <img className="thumb" src={p.image} alt="" loading="lazy" />}
                  </div>
                  <div className="td">
                    <div className="caption" title={p.caption}>{p.caption || <span className="muted">-</span>}</div>
                    {p.mediaType && <span className="tag">{p.mediaType}</span>}
                  </div>
                  <div className="td">{(p.likes ?? 0).toLocaleString()}</div>
                  <div className="td">{(p.comments ?? 0).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
