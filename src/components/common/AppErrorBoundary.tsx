import { FC, useCallback } from "react";
import { useRouteError, Navigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ErrorResponse {
  status: number;
  statusText?: string;
  data?: unknown;
}

const AppErrorBoundary: FC = () => {
  const error = useRouteError() as ErrorResponse | Error;

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const handleGoBack = useCallback(() => {
    window.history.back();
  }, []);

  // Si es un error 401, redirigir al login
  if ("status" in error && error.status === 401) {
    localStorage.removeItem("token");
    return <Navigate to = "/login" replace />;
  }

  // Para otros errores, mostrar una página de error amigable
  return (
    <Container maxWidth = "md" sx = {{ mt: 8, textAlign: "center" }}>
      <Box sx = {{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <ErrorOutlineIcon sx = {{ fontSize: 80, color: "error.main" }} />

        <Typography variant = "h4" component = "h1" gutterBottom>
          {"¡Oops! Algo salió mal\r"}
        </Typography>

        <Typography variant = "body1" color = "text.secondary" sx = {{ mb: 3 }}>
          {"status" in error
            ? `Error ${error.status}: ${error.statusText || "Error del servidor"}`
            : "Ha ocurrido un error inesperado"}
        </Typography>

        <Box sx = {{ display: "flex", gap: 2 }}>
          <Button variant = "contained" onClick = {handleReload}>
            {"Recargar página\r"}
          </Button>

          <Button variant = "outlined" onClick = {handleGoBack}>
            {"Volver atrás\r"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AppErrorBoundary;
