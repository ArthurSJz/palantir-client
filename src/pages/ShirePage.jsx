import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ShirePage.css";

export default function ShirePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="shire-container">
      <header className="shire-header">
        <h1>🔮 The Shire</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </header>
      
      <main className="shire-main">
        <h2>Your Realms</h2>
        <p className="subtitle">Select a realm or create a new one</p>
        
        <div className="realms-grid">
          <div className="realm-card create-realm">
            <span className="icon">➕</span>
            <span>Create Realm</span>
          </div>
        </div>
      </main>
    </div>
  );
}