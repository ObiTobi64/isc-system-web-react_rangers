import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import { getPermissions } from "../../services/permissionsService";
import { Section } from "../../models/sectionInterface";
import { Permission } from "../../models/permissionInterface";
import SavePermissionsModal from "../common/SavePermissionsModal";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { PermissionsCategory } from "../../models/permissionsCategoryInterface";
import { PermissionTableProps } from "../../models/permissionTablePropsInterface";
import { addPermisionToRole, removePermisionToRole } from "../../services/roleService";
import AlertSnackbar from "../common/AlertSnackbar";

const PermissionTable: React.FC<PermissionTableProps> = ({ currentRol }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [listOfChanges, setListOfChanges] = useState<Permission[]>([]);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [openSections, setOpenSections] = useState<boolean[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const hasPermission = (permissionName: string) => {
    return Array.isArray(currentRol.permissions) && currentRol.permissions.includes(permissionName);
  };

  const fetchPermissions = async () => {
    const response = await getPermissions();
    const permissionsCategory: PermissionsCategory = response.data;
    const sections: Section[] = [];
    Object.keys(permissionsCategory).forEach((secitionName: string) => {
      const section = permissionsCategory[secitionName];
      sections.push({ name: secitionName, permissions: section.flat() });
    });
    setSections(sections);
    setOpenSections(new Array(response.length).fill(true));
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleSwitchChange = (sectionIndex: number, permissionIndex: number) => () => {
    const newSections = [...sections];
    if (!listOfChanges.includes(newSections[sectionIndex].permissions[permissionIndex])) {
      setListOfChanges([...listOfChanges, newSections[sectionIndex].permissions[permissionIndex]]);
    } else {
      setListOfChanges(
        listOfChanges.filter(
          (permission) => permission !== newSections[sectionIndex].permissions[permissionIndex]
        )
      );
    }
  };

  const toggleSection = (index: number) => {
    const newOpenSections = [...openSections];
    newOpenSections[index] = !newOpenSections[index];
    setOpenSections(newOpenSections);
  };

  useEffect(() => {
    if (listOfChanges.length > 0) {
      setButtonVisible(true);
    } else {
      setButtonVisible(false);
    }
  }, [listOfChanges]);

  useEffect(() => {
    setButtonVisible(false);
    setListOfChanges([]);
  }, [currentRol]);

  const cancelChanges = () => {
    setButtonVisible(false);
    setListOfChanges([]);
  };

  const cancelChangesModal = () => {
    setShowModal(false);
  };

  const saveChanges = () => {
    setShowModal(true);
  };

  const handleSaveComplete = async () => {
    try {
      for (const permission of listOfChanges) {
        if (!hasPermission(permission.name)) {
          await addPermisionToRole(currentRol.id, permission.id);
        } else {
          await removePermisionToRole(currentRol.id, permission.id);
        }
      }
      setButtonVisible(false);
      setOpenSnackbar(true);
      setSnackbarMessage("Se guardaron los permisos con éxito");
    } catch (error) {
      console.error("Failed to save changes:", error);
      setOpenSnackbar(true);
      setSnackbarMessage("Se falló al guardar los permisos");
    }
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Table className="border-table" sx={{ marginBottom: "10px" }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: "#191D88",
                color: "white",
                fontWeight: "bold",
                width: "70%",
              }}
            >
              Acción
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#191D88",
                color: "white",
                fontWeight: "bold",
                width: "30%",
              }}
            >
              Permisos
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
        {sections.length > 0 ? (
          sections.map((section, sectionIndex) => (
            <Box key={sectionIndex} sx={{ marginBottom: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#e0e0e0",
                  padding: "10px",
                  overflow: "auto",
                }}
              >
                <IconButton onClick={() => toggleSection(sectionIndex)}>
                  {openSections[sectionIndex] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                <Typography variant="subtitle1" sx={{ marginLeft: "8px", color: "primary" }}>
                  {section.name}
                </Typography>
              </Box>
              <Collapse in={openSections[sectionIndex]} timeout="auto" unmountOnExit>
                <Table className="border-table" sx={{ marginTop: "10px" }}>
                  <TableBody>
                    {section.permissions.map((permission: Permission, permissionIndex: number) => (
                      <TableRow key={permissionIndex}>
                        <TableCell>{permission.name}</TableCell>
                        <TableCell>
                          <Switch
                            checked={
                              (hasPermission(permission.name) ||
                                listOfChanges.includes(permission)) &&
                              !(
                                hasPermission(permission.name) && listOfChanges.includes(permission)
                              )
                            }
                            onChange={handleSwitchChange(sectionIndex, permissionIndex)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Collapse>
            </Box>
          ))
        ) : (
          <Typography>No data available</Typography>
        )}
      </Box>

      {buttonVisible && (
        <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: "20px", borderRadius: "16px" }}
            onClick={saveChanges}
          >
            Guardar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: "16px" }}
            onClick={cancelChanges}
          >
            Cancelar
          </Button>
        </Box>
      )}

      {showModal && (
        <SavePermissionsModal
          isVisible={showModal}
          setIsVisible={setShowModal}
          onSave={handleSaveComplete}
          onCancel={cancelChangesModal}
          role={currentRol.name}
        />
      )}

      {openSnackbar && (
        <AlertSnackbar open={openSnackbar} message={snackbarMessage} onClose={closeSnackbar} />
      )}
    </>
  );
};

export default PermissionTable;
