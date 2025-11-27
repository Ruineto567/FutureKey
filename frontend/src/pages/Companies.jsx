import { useEffect, useMemo, useState } from "react";
import "../styles/companies.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const emptyPost = () => ({
  createdAt: "",
  likes: 0,
  comments: 0,
  caption: "",
  image: "",
  mediaType: "image",
});

export default function Companies() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [selected, setSelected] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ username: "", companyName: "", profileImage: "", posts: [emptyPost()] });
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredResults = useMemo(() => results, [results]);

  const handleSearch = async () => {
    const term = search.trim();
    setLoadingSearch(true);
    setError("");
    setResults([]);
    try {
      const url = term
        ? `${API_BASE}/api/instagram/search?q=${encodeURIComponent(term)}`
        : `${API_BASE}/api/instagram/search`;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Falha ao buscar empresas");
      setResults(Array.isArray(json.users) ? json.users : []);
    } catch (e) {
      setError(e.message || "Falha ao buscar empresas");
    } finally {
      setLoadingSearch(false);
    }
  };

  const loadDetail = async (username) => {
    setIsNew(false);
    setLoadingDetail(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/instagram/${encodeURIComponent(username)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Falha ao carregar empresa");
      setSelected(username);
      setForm({
        username: json.username || "",
        companyName: json.companyName || "",
        profileImage: json.profileImage || "",
        posts: Array.isArray(json.posts) && json.posts.length ? json.posts : [emptyPost()],
      });
    } catch (e) {
      setError(e.message || "Falha ao carregar empresa");
    } finally {
      setLoadingDetail(false);
    }
  };

  const startNew = () => {
    setIsNew(true);
    setSelected(null);
    setMessage("");
    setError("");
    setForm({ username: "", companyName: "", profileImage: "", posts: [emptyPost()] });
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updatePost = (idx, field, value) => {
    setForm((prev) => {
      const posts = [...prev.posts];
      posts[idx] = { ...posts[idx], [field]: value };
      return { ...prev, posts };
    });
  };

  const addPost = () => setForm((prev) => ({ ...prev, posts: [...prev.posts, emptyPost()] }));

  const removePost = (idx) => setForm((prev) => ({ ...prev, posts: prev.posts.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    const payload = { ...form };
    if (!payload.username.trim()) {
      setError("Informe um username");
      return;
    }
    if (!Array.isArray(payload.posts) || payload.posts.length === 0) {
      setError("Inclua pelo menos um post");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (isNew || !selected) {
        const res = await fetch(`${API_BASE}/api/instagram/seed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Falha ao criar empresa");
        setMessage("Empresa criada com sucesso");
        setSelected(payload.username);
      } else {
        const res = await fetch(`${API_BASE}/api/instagram/${encodeURIComponent(selected)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Falha ao salvar");
        setMessage("Alterações salvas com sucesso");
        if (payload.username && payload.username !== selected) {
          setSelected(payload.username);
        }
      }
      handleSearch();
    } catch (e) {
      setError(e.message || "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // carrega lista inicial
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="companies-page">
      <div className="card-bleed companies-card">
        <div className="header-row">
          <div>
            <h2>Gestão de Empresas</h2>
            <p className="muted">Crie ou edite empresas, perfil e posts cadastrados.</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por nome ou username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="styled-btn" onClick={handleSearch} disabled={loadingSearch}>
                {loadingSearch ? "Buscando..." : "Buscar"}
              </button>
            </div>
            <button className="neo-btn" onClick={startNew}>+ Nova empresa</button>
          </div>
        </div>

        {error && <div className="error-block">{error}</div>}
        {message && <div className="success-block">{message}</div>}

        <div className="companies-grid">
          <div className="results">
            <div className="section-title">
              Empresas cadastradas
              <span className="section-meta">{filteredResults.length} empresas</span>
            </div>
            <div className="result-list">
              {filteredResults.length === 0 && <div className="muted">Nenhuma empresa encontrada.</div>}
              {filteredResults.map((item) => (
                <button
                  key={item._id || item.username}
                  className={`result-item ${selected === item.username ? "active" : ""}`}
                  onClick={() => loadDetail(item.username)}
                  disabled={loadingDetail && selected === item.username}
                >
                  <div className="result-main">{item.companyName || item.username}</div>
                  <div className="result-sub">@{item.username}</div>
                  <span className="result-chip">{(item.posts?.length ?? 0)} posts</span>
                </button>
              ))}
            </div>
          </div>

          <div className="detail">
            {!isNew && !selected && (
              <div className="empty-state">
                <div className="empty-glow" />
                <div className="empty-icon">✨</div>
                <div className="empty-title">Selecione ou crie uma empresa para editar</div>
                <div className="empty-sub">Busque um nome ao lado ou clique em “Nova empresa”.</div>
              </div>
            )}
            {(isNew || selected) && (
              <div className="detail-card">
                <div className="detail-pill">
                  {isNew ? "Novo cadastro" : "Edição de empresa"}
                </div>
                <div className="detail-header">
                  <div>
                    <div className="label">Username</div>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => updateField("username", e.target.value)}
                      placeholder="@empresa"
                    />
                  </div>
                  <div>
                    <div className="label">Nome da empresa</div>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      placeholder="Nome fantasia"
                    />
                  </div>
                  <div>
                    <div className="label">Imagem de perfil (URL)</div>
                    <input
                      type="text"
                      value={form.profileImage}
                      onChange={(e) => updateField("profileImage", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  {form.profileImage && (
                    <div className="avatar-preview">
                      <img src={form.profileImage} alt="Perfil" />
                    </div>
                  )}
                </div>

                <div className="posts-title-row">
                  <h3>Posts</h3>
                  <button className="ghost" onClick={addPost}>+ Adicionar post</button>
                </div>

                <div className="posts-list">
                  {form.posts.map((post, idx) => (
                    <div key={idx} className="post-card">
                      <div className="post-row">
                        <div className="field">
                          <div className="label">Data e hora</div>
                          <input
                            type="datetime-local"
                            value={post.createdAt ? post.createdAt.slice(0, 16) : ""}
                            onChange={(e) => updatePost(idx, "createdAt", new Date(e.target.value).toISOString())}
                          />
                        </div>
                        <div className="field">
                          <div className="label">Tipo de mídia</div>
                          <select
                            value={post.mediaType}
                            onChange={(e) => updatePost(idx, "mediaType", e.target.value)}
                          >
                            <option value="image">Imagem</option>
                            <option value="video">Vídeo</option>
                            <option value="carousel">Carrossel</option>
                          </select>
                        </div>
                      </div>

                      <div className="post-row">
                        <div className="field">
                          <div className="label">Likes</div>
                          <input
                            type="number"
                            value={post.likes || 0}
                            onChange={(e) => updatePost(idx, "likes", Number(e.target.value) || 0)}
                          />
                        </div>
                        <div className="field">
                          <div className="label">Comentários</div>
                          <input
                            type="number"
                            value={post.comments || 0}
                            onChange={(e) => updatePost(idx, "comments", Number(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <div className="field">
                        <div className="label">Legenda</div>
                        <input
                          type="text"
                          value={post.caption || ""}
                          onChange={(e) => updatePost(idx, "caption", e.target.value)}
                        />
                      </div>

                      <div className="field">
                        <div className="label">Imagem (URL)</div>
                        <input
                          type="text"
                          value={post.image || ""}
                          onChange={(e) => updatePost(idx, "image", e.target.value)}
                        />
                      </div>

                      <div className="post-actions">
                        <button className="ghost danger" onClick={() => removePost(idx)} disabled={form.posts.length === 1}>
                          Remover post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="save-row">
                  <button className="styled-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Salvando..." : isNew ? "Criar empresa" : "Salvar alterações"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
