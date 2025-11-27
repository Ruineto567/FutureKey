import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("jwt"));

  function login(token) {
    localStorage.setItem("jwt", token);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
