import { useEffect, useContext } from "react";
import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Analytics from "./pages/Analytics.jsx";
import Companies from "./pages/Companies.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import logo from "./assets/logo.png";
import { AuthContext } from "./contexts/AuthContext.jsx";

import "./styles/header.css";

// --- Header ---
function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="fk-header">
      <div className="fk-header-inner">
        {/* ESQUERDA: marca */}
        <Link
          to="/"
          className="brand"
          aria-label="Início"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <img src={logo} alt="Logo" style={{ width: "24px", height: "24px" }} />
          <span className="brand-text">FutureKey</span>
        </Link>

        {/* CENTRO: navegação */}
        <nav className="nav">
          {!isAuthenticated && (
            <NavLink to="/" end className="nav-link">
              Início
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/analytics" className="nav-link">
              Análise
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/companies" className="nav-link">
              Empresas
            </NavLink>
          )}
        </nav>

        {/* DIREITA: login/logout */}
        <div className="actions">
          {isAuthenticated ? (
            <button onClick={logout} className="btn ghost">
              Sair
            </button>
          ) : (
            <Link to="/login" className="btn ghost">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

// --- ScrollToTop ---
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

// === APP ===
export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <ScrollToTop />

      <div style={{ flex: 1 }}>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/companies" element={<Companies />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
