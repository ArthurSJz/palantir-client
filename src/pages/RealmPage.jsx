import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { socket, connectSocket } from "../services/socket";
import api from "../services/api";
import "./RealmPage.css";

export default function RealmPage() {
  const { realmId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [realm, setRealm] = useState(null);
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [scrolls, setScrolls] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateHall, setShowCreateHall] = useState(false);
  const [newHallName, setNewHallName] = useState("");

  useEffect(() => {
    fetchRealm();
    fetchHalls();
    connectSocket();

    return () => {
      if (selectedHall) {
        socket.emit("leave-hall", selectedHall._id);
      }
    };
  }, [realmId]);

  useEffect(() => {
    if (selectedHall) {
      socket.emit("leave-hall", selectedHall._id);
      socket.emit("join-hall", selectedHall._id);
      fetchScrolls(selectedHall._id);

      socket.on("receive-scroll", (scroll) => {
        setScrolls((prev) => [...prev, scroll]);
      });
    }

    return () => {
      socket.off("receive-scroll");
    };
  }, [selectedHall]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scrolls]);

  const fetchRealm = async () => {
    try {
      const res = await api.get(`/api/realms/${realmId}`);
      setRealm(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHalls = async () => {
    try {
      const res = await api.get(`/api/halls/realm/${realmId}`);
      setHalls(res.data);
      if (res.data.length > 0 && !selectedHall) {
        setSelectedHall(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchScrolls = async (hallId) => {
    try {
      const res = await api.get(`/api/scrolls/hall/${hallId}`);
      setScrolls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedHall) return;

    try {
      const res = await api.post("/api/scrolls", {
        content: newMessage,
        hall: selectedHall._id,
      });
      setScrolls((prev) => [...prev, res.data]);
      socket.emit("send-scroll", { hallId: selectedHall._id, scroll: res.data });
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateHall = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/halls", { name: newHallName, realm: realmId });
      setNewHallName("");
      setShowCreateHall(false);
      fetchHalls();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="realm-container">
      {/* Sidebar */}
      <aside className="realm-sidebar">
        <div className="sidebar-header">
          <button className="back-btn" onClick={() => navigate("/shire")}>← Back</button>
          <h2>{realm?.icon} {realm?.name}</h2>
          <p className="gate-password">Gate: {realm?.gatePassword}</p>
        </div>

        <div className="halls-list">
          <div className="halls-header">
            <span>Halls</span>
            <button onClick={() => setShowCreateHall(true)}>+</button>
          </div>
          {halls.map((hall) => (
            <div
              key={hall._id}
              className={`hall-item ${selectedHall?._id === hall._id ? "active" : ""}`}
              onClick={() => setSelectedHall(hall)}
            >
              {hall.icon} {hall.name}
            </div>
          ))}
        </div>

        <div className="sidebar-members">
          <h4>Travelers ({realm?.members?.length || 0})</h4>
          {realm?.members?.map((member) => (
            <div key={member._id} className="member-item">
              <span className="status-dot"></span>
              {member.name}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat */}
      <main className="realm-main">
        <header className="chat-header">
          <h3>{selectedHall?.icon} {selectedHall?.name}</h3>
        </header>

        <div className="scrolls-container">
          {scrolls.map((scroll) => (
            <div key={scroll._id} className={`scroll-item ${scroll.author?._id === user?._id ? "own" : ""}`}>
              <div className="scroll-author">{scroll.author?.name}</div>
              <div className="scroll-content">{scroll.content}</div>
              <div className="scroll-time">
                {new Date(scroll.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder={`Send a scroll to ${selectedHall?.name || "..."}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="btn-primary">Send</button>
        </form>
      </main>

      {showCreateHall && (
        <div className="modal-overlay" onClick={() => setShowCreateHall(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Hall</h3>
            <form onSubmit={handleCreateHall}>
              <input
                type="text"
                placeholder="Hall name"
                value={newHallName}
                onChange={(e) => setNewHallName(e.target.value)}
                required
              />
              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateHall(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}