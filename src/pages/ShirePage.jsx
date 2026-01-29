import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ShirePage.css";

export default function ShirePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [realms, setRealms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newRealmName, setNewRealmName] = useState("");
  const [gatePassword, setGatePassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRealms();
  }, []);

  const fetchRealms = async () => {
    try {
      const res = await api.get("/api/realms");
      setRealms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRealm = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/realms", { name: newRealmName });
      setNewRealmName("");
      setShowModal(false);
      fetchRealms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create realm");
    }
  };

  const handleJoinRealm = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/realms/join", { gatePassword });
      setGatePassword("");
      setShowJoinModal(false);
      fetchRealms();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid gate password");
    }
  };

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
          {realms.map((realm) => (
            <div
              key={realm._id}
              className="realm-card"
              onClick={() => navigate(`/realm/${realm._id}`)}
            >
              <span className="realm-icon">{realm.icon || "🏰"}</span>
              <span className="realm-name">{realm.name}</span>
              <span className="realm-members">{realm.members?.length || 0} travelers</span>
            </div>
          ))}

          <div className="realm-card create-realm" onClick={() => setShowModal(true)}>
            <span className="icon">➕</span>
            <span>Create Realm</span>
          </div>

          <div className="realm-card create-realm" onClick={() => setShowJoinModal(true)}>
            <span className="icon">🚪</span>
            <span>Join Realm</span>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Realm</h3>
            <form onSubmit={handleCreateRealm}>
              <input
                type="text"
                placeholder="Realm name"
                value={newRealmName}
                onChange={(e) => setNewRealmName(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Join a Realm</h3>
            <p className="modal-subtitle">Speak friend and enter</p>
            <form onSubmit={handleJoinRealm}>
              <input
                type="text"
                placeholder="Gate password"
                value={gatePassword}
                onChange={(e) => setGatePassword(e.target.value.toUpperCase())}
                required
              />
              {error && <p className="error">{error}</p>}
              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={() => setShowJoinModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Enter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}