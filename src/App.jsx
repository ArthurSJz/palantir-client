import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ShirePage from "./pages/ShirePage";
import RealmPage from "./pages/RealmPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/shire" element={
            <PrivateRoute><ShirePage /></PrivateRoute>
          } />
          <Route path="/realm/:realmId" element={
            <PrivateRoute><RealmPage /></PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/shire" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;