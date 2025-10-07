import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
}

function RequireAuth({ children }: RequireAuthProps) {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAuth;
