import {
  Box,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SearchIcon from "@mui/icons-material/Search";

import RoleComponent from "./RoleComponent";
import { RoleTableProps } from "../../models/roleTablePropsInterface";
import { ChangeEvent, FC, useEffect, useState } from "react";
import Role from "../../models/roleInterface";
import { deleteRole, editRole } from "../../services/roleService";
import AlertSnackbar from "../common/AlertSnackbar";

const RoleTable: FC<RoleTableProps> = ({
  roles,
  onRoleSelect,
  selectedRole,
  setIsModalVisible,
}) => {
  const [search, setSearch] = useState("");
  const [filteredRoles, setFilteredRoles] = useState(roles);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleRoleClick = (roleName: string) => {
    onRoleSelect(roleName);
  };

  const handleRoleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      setFilteredRoles((prevRoles) => prevRoles.filter((r) => r.id !== id));
      setOpenSnackbar(true);
      setSnackbarMessage("El rol fue eliminado de manera exitosa");
    } catch (error) {
      console.error("Failed to delete the role:", error);
      setOpenSnackbar(true);
      setSnackbarMessage("El rol falló al ser eliminado");
    }
  };

  const handleRoleEdit = async (id: number, role: { name: string }) => {
    try {
      await editRole(id, role);
      setFilteredRoles((prevRoles) =>
        prevRoles.map((r) => (r.id === id ? { ...r, name: role.name } : r))
      );
      onRoleSelect(role.name);
      setOpenSnackbar(true);
      setSnackbarMessage("El rol fue editado de manera exitosa");
    } catch (error) {
      console.error("Failed to update the role:", error);
      setOpenSnackbar(true);
      setSnackbarMessage("El rol falló al ser editado");
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    filterRoles(search);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const filterRoles = (searchValue: string) => {
    if (searchValue.trim() === "") {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter((role: Role) =>
        role.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
  };

  useEffect(() => {
    filterRoles(search);
  }, [search, roles]);

  return (
    <>
      <Table className="border-table">
        <TableHead className="orange-header large-header">
          <TableRow>
            <TableCell className="flex justify-center items-center w-full">
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <Typography variant="h6">Roles</Typography>
                <IconButton aria-label="add" onClick={() => setIsModalVisible(true)}>
                  <PersonAddAlt1Icon fontSize="medium" style={{ color: "white" }} />
                </IconButton>
              </div>
            </TableCell>
          </TableRow>
          <OutlinedInput
            type="text"
            id="roles-search"
            placeholder="Buscar rol"
            onChange={handleSearch}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </TableHead>
        <Box sx={{ overflow: "auto", height: "300px" }}>
          <TableBody sx={{ overflowY: "auto" }}>
            {filteredRoles &&
              filteredRoles.map((role, index) => (
                <TableRow key={index}>
                  <RoleComponent
                    role={role}
                    selectedRole={selectedRole}
                    onRoleClick={handleRoleClick}
                    onDelete={handleRoleDelete}
                    onEdited={handleRoleEdit}
                  />
                </TableRow>
              ))}
          </TableBody>
        </Box>
      </Table>
      <AlertSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
    </>
  );
};

export default RoleTable;
