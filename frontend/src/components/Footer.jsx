import { Link } from "react-router-dom";
import "../styles/footer.css";
import logo from "../assets/logo.png";


export default function Footer() {
  return (
    <footer className="fk-footer">
      <div className="fk-container fk-footer-grid">
        <div className="fk-footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={logo} alt="Logo" style={{ width: "24px", height: "24px" }} />
            <span className="fk-footer-logo">FutureKey</span>
            </div>
          <p className="fk-footer-copy">© {new Date().getFullYear()} FutureKey. Todos os direitos reservados.</p>
        </div>

        <nav className="fk-footer-nav">
          <Link to="/">Início</Link>
          <Link to="/analytics">Análise</Link>
          <a href="https://github.com/Ruineto567" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}
