// src/pages/Meetings.jsx
import { useState } from "react";
import "../styles/Meetings.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Meetings() {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([
    {
      createdAt: "",
      likes: 0,
      comments: 0,
      caption: "",
      image: "",
      mediaType: "image",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePostChange = (index, field, value) => {
    const updated = [...posts];
    updated[index][field] = value;
    setPosts(updated);
  };

  const addPost = () => {
    setPosts([
      ...posts,
      {
        createdAt: "",
        likes: 0,
        comments: 0,
        caption: "",
        image: "",
        mediaType: "image",
      },
    ]);
  };

  const removePost = (index) => {
    const updated = [...posts];
    updated.splice(index, 1);
    setPosts(updated);
  };

  const handleSubmit = async () => {
    if (!username.trim()) {
      setMessage("Informe um username.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/instagram/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), posts }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Erro ao salvar os dados.");
      }

      setMessage("✅ Dados enviados com sucesso!");
      setUsername("");
      setPosts([
        {
          createdAt: "",
          likes: 0,
          comments: 0,
          caption: "",
          image: "",
          mediaType: "image",
        },
      ]);
    } catch (e) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>📊 Cadastro de Dados do Instagram</h2>

      <div className="card">
        <label style={{ fontWeight: 600, marginBottom: 6 }}>Usuário (@username)</label>
        <input
          className="input"
          placeholder="@usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            background: "#1f1f2b",
            border: "1px solid #444",
            color: "#fff",
            marginBottom: 20,
            width: "100%",
          }}
        />

        <h3 style={{ marginBottom: 12 }}>Posts</h3>
        {posts.map((post, idx) => (
          <div
            key={idx}
            style={{
              background: "#16161e",
              border: "1px solid #333",
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label>Data e hora</label>
                <input
                  type="datetime-local"
                  value={post.createdAt ? post.createdAt.slice(0, 16) : ""}
                  onChange={(e) =>
                    handlePostChange(idx, "createdAt", new Date(e.target.value).toISOString())
                  }
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label>Tipo de mídia</label>
                <select
                  value={post.mediaType}
                  onChange={(e) => handlePostChange(idx, "mediaType", e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value="image">Imagem</option>
                  <option value="video">Vídeo</option>
                  <option value="carousel">Carrossel</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <div>
                <label>Likes</label>
                <input
                  type="number"
                  value={post.likes}
                  onChange={(e) => handlePostChange(idx, "likes", parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Comentários</label>
                <input
                  type="number"
                  value={post.comments}
                  onChange={(e) => handlePostChange(idx, "comments", parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label>Legenda</label>
              <input
                type="text"
                value={post.caption}
                onChange={(e) => handlePostChange(idx, "caption", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <label>Imagem (URL ou deixe vazio)</label>
              <input
                type="text"
                value={post.image}
                onChange={(e) => handlePostChange(idx, "image", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginTop: 12, textAlign: "right" }}>
              <button
                onClick={() => removePost(idx)}
                disabled={posts.length === 1}
                className="btn ghost"
              >
                Remover post
              </button>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={addPost} className="btn ghost">
            ➕ Adicionar post
          </button>
          <button onClick={handleSubmit} disabled={loading} className="btn primary">
            {loading ? "Enviando..." : "📤 Enviar dados"}
          </button>
        </div>

        {message && <div style={{ marginTop: 16 }}>{message}</div>}
      </div>
    </div>
  );
}
