import { Navigate } from "react-router-dom";
import { getStoredToken } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;