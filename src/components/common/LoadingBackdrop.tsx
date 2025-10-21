import { FC } from "react";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

interface LoadingBackdropProps {
  loading: boolean;
  canApproveStage: boolean;
}

const LoadingBackdrop: FC<LoadingBackdropProps> = ({ loading, canApproveStage }) => (
  <Backdrop sx = {{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open = {loading}>
    <Box display = "flex" flexDirection = "column" alignItems = "center">
      <CircularProgress color = "inherit" />
      <Typography variant = "h6" mt = {2}>
        {canApproveStage ? "Aprobando Etapa..." : "Guardando Cambios..."}
      </Typography>
    </Box>
  </Backdrop>
);

export default LoadingBackdrop;
