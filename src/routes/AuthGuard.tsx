import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/store";

const AuthGuard = () => {
  const token = localStorage.getItem("token");
  const user = useUserStore((state) => state.user);

  // Si no hay token o no hay usuario, redirigir al login
  if (!token || !user) {
    // Limpiar cualquier estado inconsistente
    if (!token) {
      localStorage.removeItem("token");
      useUserStore.getState().clearUser();
    }
    return <Navigate to = "/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;