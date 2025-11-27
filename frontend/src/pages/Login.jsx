import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [msg, setMsg] = useState("");
  const nav = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      nav("/");
    }
  }, [isAuthenticated]);

  async function doLogin(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      login(data.token);
      nav("/");
    } catch (err) {
      setMsg(err?.response?.data?.error || "Erro ao fazer login");
    }
  }

  async function doRegister(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/register", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      login(data.token);
      nav("/analytics");
    } catch (err) {
      setMsg(err?.response?.data?.error || "Erro ao registrar");
    }
  }

  return (
    <div
      className="login-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 400,
          width: "100%",
          padding: "32px",
          background: "#1e1e2f",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Entrar na <span style={{ color: "#8b5cf6" }}>FutureKey</span>
        </h2>

        {/* Formulário de Login */}
        <form onSubmit={doLogin}>
          <input
            className="input"
            placeholder="E-mail"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            style={{ marginBottom: "12px" }}
          />
          <input
            className="input"
            type="password"
            placeholder="Senha"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            style={{ marginBottom: "16px" }}
          />
          <button className="btn btn-grad" style={{ width: "100%" }}>
            Entrar
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <small>
            Ainda não tem conta?{" "}
            <span
              style={{ color: "#a78bfa", cursor: "pointer" }}
              onClick={() =>
                document.getElementById("register-box").style.display = "block"
              }
            >
              Criar conta
            </span>
          </small>
        </div>

        {msg && (
          <p
            style={{
              marginTop: "16px",
              color: "#f87171",
              textAlign: "center",
            }}
          >
            {msg}
          </p>
        )}

        {/* Cadastro */}
        <div id="register-box" style={{ marginTop: "24px", display: "none" }}>
          <form onSubmit={doRegister}>
            <input
              className="input"
              placeholder="Nome"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              style={{ marginBottom: "12px" }}
            />
            <input
              className="input"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              style={{ marginBottom: "12px" }}
            />
            <input
              className="input"
              type="password"
              placeholder="Senha"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            <button className="btn ghost" style={{ width: "100%" }}>
              Criar conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
