import { FC } from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

const ErrorDialog: FC<ErrorDialogProps> = ({
  open,
  onClose,
  title = "¡Vaya!",
  subtitle = "Algo salió mal. Por favor, inténtelo de nuevo.",
}) => (
  <Dialog open = {open} onClose = {onClose} aria-labelledby = "error-dialog-title">
    <DialogContent sx = {{ textAlign: "center", p: 4 }}>
      <ErrorIcon sx = {{ fontSize: 60, color: "red", mb: 2 }} />
      <Typography variant = "h5" sx = {{ mb: 2 }}>
        {title}
      </Typography>
      <Typography variant = "body1" color = "textSecondary">
        {subtitle}
      </Typography>
    </DialogContent>
    <DialogActions sx = {{ justifyContent: "center", pb: 3 }}>
      <Button variant = "contained" onClick = {onClose} color = "primary">
        {"Confirmar\r"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ErrorDialog;
