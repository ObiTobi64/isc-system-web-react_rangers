import { FC, useState, MouseEvent, ChangeEvent } from "react";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
  styled,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ConfirmDelete from "../common/ConfirmDelete";
import PermissionTable from "./PermissionTable";
import ExpandMoreProps from "../../models/expandMorePropsInterface";
import RoleComponentProps from "../../models/roleComponentProps";
import SavePermissionsModal from "../common/SavePermissionsModal";

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const RoleComponent: FC<RoleComponentProps> = ({
  role,
  selectedRole,
  onRoleClick,
  onDelete,
  onEdited,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoleName, setEditedRoleName] = useState(role.name);
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const [anchorE1, setAnchorE1] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorE1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorE1(null);
  };

  const handleDeleteClick = () => {
    setShowDelete(true);
    handleClose();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedRoleName(role.name);
    handleClose();
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setEditedRoleName(event.target.value);
  };

  const handleSave = () => {
    if (editedRoleName !== role.name) {
      setShowConfirmation(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleConfirmSave = () => {
    onEdited(role.id, { name: editedRoleName });
    setIsEditing(false);
    setShowConfirmation(false);
  };

  const handleCancelEdit = () => {
    setEditedRoleName(role.name);
    setShowConfirmation(false);
    setIsEditing(false);
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: isSmall ? 700 : "100%",
          backgroundColor: selectedRole === role.name ? "LightGray" : "inherit",
          marginBottom: 2,
        }}
      >
        <CardActionArea onClick={() => onRoleClick(role.name)}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {isEditing ? (
                <TextField
                  value={editedRoleName}
                  onChange={handleInputChange}
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSave();
                    }
                  }}
                />
              ) : (
                <Typography sx={{ fontWeight: selectedRole === role.name ? "bold" : "normal" }}>
                  {role.name}
                </Typography>
              )}
              <Box>
                {isSmall && (
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                )}

                <IconButton color="inherit" aria-label="more" onClick={handleClick}>
                  <MoreHorizIcon color="primary" />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
        {isSmall && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <PermissionTable currentRol={role} />
            </CardContent>
          </Collapse>
        )}
      </Card>
      <Menu anchorEl={anchorE1} open={Boolean(anchorE1)} onClose={handleClose}>
        <MenuItem onClick={handleEditClick} sx={{ justifyContent: "flex-start" }}>
          <ListItem>
            <EditIcon color="primary" />
          </ListItem>
          <Typography>Editar</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ justifyContent: "flex-start" }}>
          <ListItem>
            <DeleteIcon color="primary" />
          </ListItem>
          <Typography>Eliminar</Typography>
        </MenuItem>
      </Menu>
      {showDelete && (
        <ConfirmDelete
          roleName={role.name}
          isVisible={showDelete}
          setIsVisible={setShowDelete}
          onDelete={() => onDelete(role.id)}
        />
      )}
      {showConfirmation && (
        <SavePermissionsModal
          isVisible={showConfirmation}
          setIsVisible={setShowConfirmation}
          onSave={handleConfirmSave}
          onCancel={handleCancelEdit}
          role={role.name}
        />
      )}
    </>
  );
};

export default RoleComponent;
