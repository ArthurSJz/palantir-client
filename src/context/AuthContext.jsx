import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      api.get("/auth/verify")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("authToken"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("authToken", res.data.authToken);
    const userRes = await api.get("/auth/verify");
    setUser(userRes.data);
    return userRes.data;
  };

  const signup = async (name, email, password) => {
    await api.post("/auth/signup", { name, email, password });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);