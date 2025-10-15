import { DataGrid, GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Box,
  useMediaQuery,
  Modal,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteStudent, getInterns, getStudents } from "../../services/studentService";
import ContainerPage from "../../components/common/ContainerPage";
import { getPermissionById } from "../../services/permissionsService";
import HasPermission from "../../helper/permissions";
import Permission from "../../models/permissionInterface";
import dataGridLocaleText from "../../locales/datagridLocaleEs";
import CreateStudentForm from "./CreateStudentForm";
import SpinModal from "../../components/common/SpinModal";
import EditStudentForm from "./EditStudentForm";

const StudentPage = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("sm"));
  const [, setIsSidebarVisible] = useState(true);
  const [students, setStudents] = useState([]);
  const [interns, setInterns] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [addStudentPermission, setAddStudentPermission] = useState<Permission>();
  const [editStudentPermission, setEditStudentPermission] = useState<Permission>();
  const [deleteStudentPermission, setDeleteStudentPermission] = useState<Permission>();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [viewStudentReportPermission, setViewStudentReportPermission] =
    useState<Permission | null>();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    code: true,
    name: true,
    email: true,
    phone: true,
    actions: true,
  });

  useEffect(() => {
    if (isSmallScreen) {
      setIsSidebarVisible(false);
    } else {
      setIsSidebarVisible(true);
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const fetchPermissions = async () => {
      const response = await getPermissionById(13);
      setAddStudentPermission(response.data[0]);
      const deleteStudentResponse = await getPermissionById(14);
      setDeleteStudentPermission(deleteStudentResponse.data[0]);
      const editStudentResponse = await getPermissionById(15);
      setEditStudentPermission(editStudentResponse.data[0]);
      const viewStudentReportResponse = await getPermissionById(16);
      setViewStudentReportPermission(viewStudentReportResponse.data[0]);
      setIsLoading(false);
    };
    fetchPermissions();
    fetchInterns();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Código",
      description: "Código",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
      resizable: true,
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Nombre Completo",
      description: "Nombre Completo",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      resizable: true,
      sortable: false,
      filterable: false,
    },
    {
      field: "email",
      headerName: "Correo",
      description: "Correo",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      resizable: true,
      sortable: false,
      filterable: false,
    },
    {
      field: "phone",
      headerName: "Celular",
      description: "Celular",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
      resizable: true,
      sortable: false,
      filterable: false,
    },
    {
      field: "actions",
      headerName: "Acciones",
      description: "Acciones",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div>
          {HasPermission(viewStudentReportPermission?.name || "") && (
            <IconButton color = "primary" aria-label = "ver" onClick = {() => handleView(params.row.id)}>
              <VisibilityIcon />
            </IconButton>
          )}
          {HasPermission(editStudentPermission?.name || "") && (
            <IconButton
              color = "primary"
              aria-label = "editar"
              onClick = {() => handleEdit(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          )}
          {HasPermission(deleteStudentPermission?.name || "") && (
            <IconButton
              color = "secondary"
              aria-label = "eliminar"
              onClick = {() => handleClickOpen(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  const getResponsiveColumns = (): GridColDef[] => {
    const visibleColumns = columns.filter(
      (col) => columnVisibilityModel[col.field] !== false && col.field !== "actions"
    );
    const dynamicFlex = visibleColumns.length > 0 ? Math.floor(12 / visibleColumns.length) : 1;

    return columns.map((col) => {
      const isVisible = columnVisibilityModel[col.field] !== false;

      if (!isVisible) {
        return {
          ...col,
          flex: 0,
          minWidth: 0,
          maxWidth: 0,
          hide: true,
        };
      }
      if (col.field === "actions") {
        return {
          ...col,
          flex: 4,
          minWidth: 150,
          maxWidth: 300,
        };
      }

      return {
        ...col,
        flex: dynamicFlex,
        minWidth: 100,
        maxWidth: 300,
      };
    });
  };

  const handleCreateStudent = () => setOpenCreateModal(true);
  const handleCloseCreateStudent = () => setOpenCreateModal(false);

  const handleStudentCreated = () => {
    setOpenCreateModal(false);
    fetchStudents();
    fetchInterns();
  };

  const fetchStudents = async () => {
    const students = await getStudents();
    setStudents(students.data);
    if (import.meta.env.DEV) {
      console.log(students);
    }
  };

  const fetchInterns = async () => {
    const interns = await getInterns();
    setInterns(interns.data);
  };

  useEffect(() => {
    fetchStudents();
    fetchInterns();
  }, []);

  const handleView = (id: number) => {
    navigate(`/profile/${id}`);
    if (import.meta.env.DEV) {
      console.log(`Ver estudiante con id: ${id}`);
    }
  };

  const handleEdit = (id: number) => {
    setSelectedStudentId(id);
    setOpenEditModal(true);
  };

  const handleClickOpen = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedStudentId(null);
  };

  const handleStudentUpdated = () => {
    fetchStudents();
    fetchInterns();
  };

  const handleDelete = async () => {
    if (selectedId !== null) {
      try {
        await deleteStudent(selectedId);
        fetchStudents();
        fetchInterns();
      } catch (error: any) {
        if (error.response?.data?.message?.includes("proceso de graduación")) {
          setErrorMessage(
            "No se puede eliminar al estudiante ya que este se encuentra en un proceso de graduación."
          );
        } else {
          setErrorMessage("Este estudiante se encuentra en un proceso de graduación");
        }
        setErrorDialogOpen(true);
      } finally {
        handleClose();
      }
    }
  };

  return (
    <ContainerPage
      title = "Estudiantes"
      subtitle = "Lista de estudiantes"
      actions = {
        HasPermission(addStudentPermission?.name || "") && (
          <Button
            variant = "contained"
            color = "secondary"
            onClick = {handleCreateStudent}
            startIcon = {<AddIcon />}
            style = {{ display: "inline-flex" }}
          >
            {"Agregar Estudiante\r"}
          </Button>
        )
      }
    >
      {isLoading ? (
        <div
          style = {{
            position: "absolute",
            top: "50%",
            left: "55%",
          }}
        >
          <SpinModal />
        </div>
      ) : (
        <div style = {{ width: "100%", paddingBottom: 0 }}>
          <DataGrid
            rows = {[...students, ...interns]}
            columns = {getResponsiveColumns()}
            localeText = {dataGridLocaleText}
            initialState = {{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions = {[5, 10]}
            checkboxSelection = {false}
            disableRowSelectionOnClick
            autoHeight
            columnVisibilityModel = {columnVisibilityModel}
            onColumnVisibilityModelChange = {(newModel) => {
              const updatedModel = {
                ...newModel,
                code: true,
              };
              setColumnVisibilityModel(updatedModel);
            }}
            slotProps = {{
              columnsManagement: {
                autoFocusSearchField: false,
                searchInputProps: {
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "secondary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "secondary.main",
                      },
                    },
                    "& input": {
                      outline: "none !important",
                      boxShadow: "none !important",
                    },
                  },
                },
              },
            }}
            classes = {{
              root: "bg-white dark:bg-gray-800",
              columnHeader: "bg-gray-200 dark:bg-gray-800",
              cell: "bg-white dark:bg-gray-800",
              row: "bg-white dark:bg-gray-800",
              columnHeaderTitle: "!font-bold text-center",
              sortIcon: "bg-gray-200 dark:bg-gray-800",
            }}
            sx = {{
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
                border: "none !important",
                boxShadow: "none !important",
              },
              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                outline: "none !important",
                border: "none !important",
                boxShadow: "none !important",
              },
              "& .MuiDataGrid-cell--editing": {
                boxShadow: "none !important",
              },
              "& .MuiDataGrid-cell.MuiDataGrid-cell--editing": {
                outline: "none !important",
              },
              "& .MuiDataGrid-cell": {
                borderColor: "transparent",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "inherit !important",
              },
            }}
          />
          <Dialog
            open = {open}
            onClose = {handleClose}
            aria-labelledby = "alert-dialog-title"
            aria-describedby = "alert-dialog-description"
          >
            <DialogTitle id = "alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>
            <DialogContent>
              <DialogContentText id = "alert-dialog-description">
                {"¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede\r"}
                {"deshacer.\r"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick = {handleClose} color = "primary">
                {"Cancelar"}
              </Button>
              <Button onClick = {handleDelete} color = "secondary" autoFocus>
                {"Eliminar"}
              </Button>
            </DialogActions>
          </Dialog>
          <Modal open = {openCreateModal} onClose = {handleCloseCreateStudent}>
            <Box
              sx = {{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "100vh",
                maxHeight: "80vh",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                overflowY: "auto",
                p: 2,
              }}
            >
              <CreateStudentForm onSuccess = {handleStudentCreated} />
            </Box>
          </Modal>
          <Modal open = {openEditModal} onClose = {handleCloseEditModal}>
            <Box
              sx = {{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "100vh",
                maxHeight: "80vh",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                overflowY: "auto",
                p: 2,
              }}
            >
              {selectedStudentId && (
                <EditStudentForm
                  id = {selectedStudentId}
                  onSuccess = {handleStudentUpdated}
                  onClose = {handleCloseEditModal}
                />
              )}
            </Box>
          </Modal>
        </div>
      )}
      <Dialog open = {errorDialogOpen} onClose = {() => setErrorDialogOpen(false)}>
        <DialogTitle color = "red">{"Error al eliminar estudiante"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick = {() => setErrorDialogOpen(false)} color = "primary" autoFocus>
            {"Cerrar\r"}
          </Button>
        </DialogActions>
      </Dialog>
    </ContainerPage>
  );
};

export default StudentPage;
