import { FC } from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
}

const SuccessDialog: FC<SuccessDialogProps> = ({ open, onClose, title, subtitle }) => (
  <Dialog open = {open} onClose = {onClose} aria-labelledby = "success-dialog-title">
    <DialogContent sx = {{ textAlign: "center", p: 4 }}>
      <CheckCircleIcon sx = {{ fontSize: 60, color: "green", mb: 2 }} />
      <Typography variant = "h5" sx = {{ mb: 2 }}>
        {title}
      </Typography>
      <Typography variant = "body1" color = "textSecondary">
        {subtitle}
      </Typography>
    </DialogContent>
    <DialogActions sx = {{ justifyContent: "center", pb: 3 }}>
      <Button variant = "contained" onClick = {onClose} color = "primary">
        {"Cerrar\r"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default SuccessDialog;
