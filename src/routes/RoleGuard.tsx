import { FC, ReactNode, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/store";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

const RoleGuard: FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const handleLoginRedirect = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const userRoles = user?.roles ?? [];

  const hasRole = allowedRoles.some((role) => userRoles.includes(role));

  useEffect(() => {
    if (!hasRole) {
      navigate("/error", {
        replace: true,
        state: { fromRoleGuard: true },
      });
    }
  }, [hasRole, navigate]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2 style={{ color: "red" }}>{"Usuario no autenticado"}</h2>
        <p>{"Debes iniciar sesión para acceder a esta página."}</p>
        <button
          onClick={handleLoginRedirect}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {"Ir al login\r"}
        </button>
      </div>
    );
  }

  if (!hasRole) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
