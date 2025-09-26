import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Snackbar, Button } from "@mui/material";
import { useUserStore } from "../store/store";
import getDefaultHomeRoute from "../utils/navigationUtils";

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const fromRoleGuard = location.state?.fromRoleGuard;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (fromRoleGuard) {
      setOpen(true);
    }
  }, [fromRoleGuard]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleGoHome = useCallback(() => {
    if (user && user.roles) {
      const homeRoute = getDefaultHomeRoute(user.roles);
      navigate(homeRoute, { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-6xl font-bold text-blue-600">{"404"}</h1>
      <p className="text-xl mt-2 text-gray-800">{"Página no encontrada"}</p>
      <p className="mt-4 text-gray-600">
        {"Lo sentimos, la página que buscas no existe o fue movida.\r"}
      </p>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
        className="mt-6"
        sx={{ marginTop: "24px" }}
      >
        {"Volver al inicio\r"}
      </Button>
      {fromRoleGuard && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {"No tienes permiso para acceder a esta página.\r"}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default ErrorPage;
