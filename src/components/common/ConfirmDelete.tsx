import { FC, useCallback } from "react";
import { Modal as MuiModal, Box, Button, Typography, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import { DeleteRoleModalProps } from "../../models/deleteRoleModalPropsInterface";

import "./ModalStyle.css";

const DeleteRoleModal: FC<DeleteRoleModalProps> = ({
  roleName,
  isVisible,
  setIsVisible,
  onDelete,
}) => {
  const handleDelete = useCallback(async () => {
    onDelete();
    setIsVisible(false);
  }, [onDelete, setIsVisible]);

  const toggleModal = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible, setIsVisible]);

  return (
    <MuiModal
      open = {isVisible}
      onClose = {toggleModal}
      aria-labelledby = "delete-modal-title"
      aria-describedby = "delete-modal-description"
    >
      <Box className = "modal-box">
        <IconButton sx = {{ position: "absolute", top: 6, right: 6 }} onClick = {toggleModal}>
          <CancelIcon color = "primary" />
        </IconButton>
        <Typography id = "delete-modal-title" variant = "h5" align = "center">
          {"Eliminar rol\r"}
        </Typography>
        <Typography
          id = "delete-modal-description"
          variant = "body1"
          sx = {{ marginTop: "20px" }}
          align = "center"
        >
          {"¿Estás seguro de que deseas eliminar el rol "}<strong>{roleName}</strong>{"?\r"}
        </Typography>
        <Typography
          id = "delete-modal-description"
          variant = "body2"
          sx = {{ marginTop: "20px" }}
          align = "center"
          color = "gray"
        >
          {"Si eliminas el rol no podrás recuperarlo\r"}
        </Typography>
        <Box
          display = "flex"
          justifyContent = "center"
          mt = {2}
          sx = {{ marginTop: "20px" }}
        >
          <Button variant = "outlined" color = "secondary" onClick = {toggleModal}>
            {"Cancelar\r"}
          </Button>
          <Button
            variant = "contained"
            color = "error"
            onClick = {handleDelete}
            sx = {{ marginLeft: "15px" }}
          >
            {"Eliminar\r"}
          </Button>
        </Box>
      </Box>
    </MuiModal>
  );
};

export default DeleteRoleModal;