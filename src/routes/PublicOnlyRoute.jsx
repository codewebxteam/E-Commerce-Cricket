import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // ✅ Logged in users cannot access public pages (like login)
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
