import { FC } from "react";
import { Modal as MuiModal, Box } from "@mui/material";
import CreateStudentForm from "../../pages/Student/CreateStudentForm";
import EditStudentComponent from "./EditStudentComponent";

type funcType = "edit" | "create";
interface ModalProps {
  open: boolean;
  onClose: () => void;
  func: funcType;
  id: number | null;
}

const Modal: FC<ModalProps> = ({ open, onClose, func, id }) => (
  <MuiModal open = {open} onClose = {onClose}>
    <Box
      sx = {{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#ffffff",
        border: "2px solid #000",
        maxHeight: "90vh",
        boxShadow: 24,
        padding: "16px",
        borderRadius: "8px",
        overflowY: "auto",
      }}
    >
      {func === "create" && <CreateStudentForm onSuccess = {onClose} />}
      {func === "edit" && <EditStudentComponent id = {id ?? -1} onClose = {onClose} />}
    </Box>
  </MuiModal>
);

export default Modal;
