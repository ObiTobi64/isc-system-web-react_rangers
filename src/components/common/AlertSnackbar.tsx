import { FC } from "react";import Alert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import AlertSnackbarsProps from "../../models/alertSnackbarProps";

const AlertSnackbar: FC<AlertSnackbarsProps> = ({ open, message, onClose }) => (
  <Snackbar
    open = {open}
    autoHideDuration = {4000}
    onClose = {onClose}
    anchorOrigin = {{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert
      severity = {message.includes("falló") ? "error" : "success"}
      variant = "filled"
      sx = {{ width: "100%" }}
    >
      {message}
    </Alert>
  </Snackbar>
);

export default AlertSnackbar;
