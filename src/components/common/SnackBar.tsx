import { FC } from "react";
import Alert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import SnackbarProps from "../../models/SnackBarProps";

const SnackBar: FC<SnackbarProps> = ({ open, message, onClose, severity }) => (
  <Snackbar
    open = {open}
    autoHideDuration = {6000}
    onClose = {onClose}
    anchorOrigin = {{ vertical: "top", horizontal: "right" }}
  >
    <Alert onClose = {onClose} severity = {severity} sx = {{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default SnackBar;
